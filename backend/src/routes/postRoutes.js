import { Router } from 'express'
import { createPost, deletePost, deleteReply, getFeedPosts, getPost, getUserPosts, likeUnlikePost, replyToPost } from '../controllers/postController.js'

export const postRouter = Router()

postRouter.post('/create', createPost)
postRouter.get('/userposts/:id', getUserPosts) //  /USERPOSTS/:USERNAME
postRouter.get('/:id', getPost)
postRouter.delete('/:id', deletePost)
postRouter.put('/like/:id', likeUnlikePost)
postRouter.put('/reply/:id', replyToPost)
postRouter.delete('/reply/:id', deleteReply)
postRouter.get('/feed', getFeedPosts)
