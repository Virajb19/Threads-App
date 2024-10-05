import { Router } from 'express'
import { followUnfollowUser, forgotPassword, resetPassword, signin, signout, signup, updateProfile, verifyEmail } from "../controllers/userController.js"
 
export const userRouter = Router()

userRouter.post('/signup', signup)
userRouter.post('/signin', signin)
userRouter.post('/signout', signout)
userRouter.post('/verify-email', verifyEmail)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password/:token', resetPassword)
userRouter.post('/follow/:id', followUnfollowUser)
userRouter.post('/updateProfile', updateProfile)