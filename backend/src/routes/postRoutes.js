import { Router } from 'express'
import { createPost, deletePost, getPost, getUserPosts } from '../controllers/postController.js'

export const postRouter = Router()

postRouter.post('/create', createPost)
postRouter.get('/userposts/:id', getUserPosts) //  /USERPOSTS/:USERNAME
postRouter.get('/:id', getPost)
postRouter.delete('/:id', deletePost)