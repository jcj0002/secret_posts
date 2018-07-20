class PostsController < ApplicationController
    before_action :authenticate_user!
    
    def index
        @posts = current_user.posts
        render json: @posts
    end

    def show
        @posts = Post.find(params[:id])
        render json: @post
    end

    def create
        @user = current_user
        @posts = @user.post.create!(post_params)
        render json: @post
    end

    def update
        @post = Post.find(params[:id])
        @post = Post.update!(post_params)
        render json: @post
    end

    def destroy
        @post = Post.find (params [:id])
        @post.destroy
    end

    render status: :ok

    private

    def post_params
        params.require(:posts).permit(title, :content)
    end

end
