import { Router } from "express"
import { signin, signout, signup } from "../controllers/userController.js"
 
export const userRouter = Router()

userRouter.post('/signup', signup)
userRouter.post('/signin', signin)
userRouter.post('/signout', signout)