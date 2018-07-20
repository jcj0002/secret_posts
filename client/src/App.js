import React, { Component } from 'react'
import SignUpLogIn from './components/SignUpLogIn'
import axios from 'axios'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { saveAuthTokens, userIsLoggedIn, setAxiosDefaults } from './utils/SessionHeaderUtil'
import PostsList from './components/PostsList'



class App extends Component {
  state = {
    signedIn: false,
    posts:[]
  }

  async componentDidMount() {
    const signedIn = userIsLoggedIn()
    let posts = []

    if (signedIn) {
      setAxiosDefaults()
      posts = await this.fetchPosts()
    }

    this.setState({ posts, signedIn })
  }
  fetchPosts = async () => {
    const response = await axios.get('/posts')
    return (response.data)

  }

  signUp = async (email, password, password_confirmation) => {

    try {
      const payload = {
        email,
        password,
        password_confirmation
      }


      await axios.post('/auth', payload)
      this.setState({ signIn: true })
    } catch (error) {
      console.error(error)
    }
  }

  signIn = async (email, password) => {

    try {
      const payload = {
        email,
        password,
      }


      const response = await axios.post('/auth/sign_in', payload)
      saveAuthTokens(response.headers)

      const posts = await this.fetchPosts()

      await this.fetchPosts()

      this.setState({ 
        posts,
        signedIn: true 
        
      
      })

    } catch (error) {

      console.error(error)
    }


  }


  render() {
    const SignUpLogInComponent = () => (
      //implicit return represents a function
      <SignUpLogIn
        signUp={this.signUp}
        signIn={this.signIn} />
    )

    const PostsListComponent = () => {
      return <PostsList
        posts={this.state.posts} />

    }

    return (
      <Router>
        <div>
        <button onClick={this.signOut}>Sign Out</button>
          <Switch>
            <Route exact path="/signUp" render={SignUpLogInComponent} />
            <Route exact path="/posts" render={PostsListComponent} />
          </Switch>
          {this.state.signedIn ?
            <Redirect to="/posts" /> :
            <Redirect to="/signUp" />}
        </div>
      </Router>

    )
  }
}


export default App
