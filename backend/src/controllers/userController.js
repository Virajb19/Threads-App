import { codeSchema, forgotPasswordSchema, resetPasswordSchema, signInSchema, signUpSchema, updateProfileSchema } from "../types/userTypes.js";
import { prisma } from "../utils/db.js";
import bcrypt from 'bcrypt'
import { generateToken } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../emails/Emails.js";
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export async function signup(req,res) {
 try {
    const userData = signUpSchema.safeParse(req.body)
    if(!userData.success) return res.status(400).json({error : 'Invalid user inputs', userData})
    const {username, email, password} = userData.data

    const userExists = await prisma.user.findFirst({where : {OR : [{email}, {username}]}})
    if(userExists) return res.status(409).json({msg: 'User already exists'})

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    const verificationCode = Math.floor(Math.random() * 900000 + 100000).toString()
    const user = await prisma.user.create({data : {username, email, password: hashedPassword, verificationCode, verificationCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000), name: username}})

    const token = generateToken(user, res)

    await sendVerificationEmail(user.email, verificationCode, res)

    const {password: _, ...userWithoutPassword} = user

    res.status(201).json({success: true, msg: 'User created successfully', user: userWithoutPassword,})
   
 } catch(err) {
       console.error(err)
       res.status(500).json({msg: 'Error while signing up', error: err.message})
 }
}

export async function signin(req,res) {
 try {
    const userData = signInSchema.safeParse(req.body)
    if(!userData.success) return res.status(400).json({msg: 'Invalid user inputs', userData})

    const {email, password} = userData.data

    const user = await prisma.user.findFirst({where: {email}})
    const isMatch = await bcrypt.compare(password,user?.password || "")
    if(!user || !isMatch) return res.status(401).json({success: false, msg : 'Invalid credentials'})

    const token = generateToken(user, res)

    const updatedUser = await prisma.user.update({where: {email}, data: {lastLogin: new Date()}})

    const {password: _, ...userResponse} = updatedUser

    res.status(200).json({success: true, msg: 'Logged in successfully',user: userResponse, token})

 } catch(err) {
     console.error(err)
     res.status(500).json({msg: 'Error while logging in', error: err.message})
 }
}

export async function signout(_,res) {
    try {
        res.clearCookie("jwt")
        res.status(200).json({success: true, msg: 'Logged out successfully'})
    } catch(err) {
        console.error(err)
        res.status(500).json({success: false, msg: 'Error while signing out', error: err.message})
    }
}

export async function verifyEmail(req,res) {
    try{
      const parsedData = codeSchema.safeParse(req.body)
      if(!parsedData.success) return res.status(400).json({error: 'Invalid code', parsedData})
      const { code } = parsedData.data

      const user = await prisma.user.findFirst({where: {verificationCode: code}})
      if(!user) return res.status(401).json({success: false, error: 'incorrect code'})

      if(user.verificationCodeExpiresAt < new Date()) {
          const newCode = Math.floor(Math.random() * 900000 + 100000).toString()
          await prisma.user.update({where: {id: user.id}, data: {verificationCode: newCode, verificationCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000)}})
          await sendVerificationEmail(user.email,newCode,res)
          return res.status(401).json({success: false, error: 'code expired'})
      }

      const updatedUser = await prisma.user.update({where: {id: user.id}, data: {isVerified: true, verificationCode: null, verificationCodeExpiresAt: null}})

      await sendWelcomeEmail(user.email, user.username, res)

      res.status(200).json({success: true, msg: 'Email verified successfully', updatedUser})

      } catch (e) {
       console.error(e)
       return res.status(500).json({success: false, msg: 'Error while verifying email', error: e})
    }
}

export async function forgotPassword(req,res){
    try {
    const parsedData = forgotPasswordSchema.safeParse(req.body)
    if(!parsedData.success) return res.status(400).json({success: false,error: 'Invalid email address', parsedData})
    const { email } = parsedData.data
   
    const user = await prisma.user.findUnique({where: {email}})
    if(!user) return res.status(400).json({success: false, error: 'Email not found'})

    const resetToken = crypto.randomBytes(20).toString('hex')
    
    await prisma.user.update({where: {id: user.id}, data: {resetPasswordToken: resetToken, resetPasswordTokenExpiresAt: new Date(Date.now() + 3 * 60 * 1000)}})

    await sendPasswordResetEmail(user.email, `process.env.CLIENT_URL/reset-password/${resetToken}`,res)

    res.status(200).json({success: true, msg: 'Reset Password mail sent successfully'})

   } catch(e) {
      console.error(e)
      return res.status(500).json({success: false, msg: 'Internal server error'})
   }
}

export async function resetPassword(req,res) {
    try {

        const token = req.params.token

        const parsedData = resetPasswordSchema.safeParse(req.body)
        if(!parsedData.success) return res.status(400).json({success: false, error: 'Invalid inputs', parsedData})
        const {password , confirmPassword} = parsedData.data
       
        const user = await prisma.user.findFirst({where: {resetPasswordToken: token, resetPasswordTokenExpiresAt: {gt : new Date()}}})
        if(!user) return res.status(401).json({success: false, error: 'Incorrect or expired token. Please ask for another reset password email'})

        if(password != confirmPassword) return res.status(400).json({success: false, msg: 'Passwords do not match'})
        const salt = bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        await prisma.user.update({where: {id: user.id}, data: {password: hashedPassword, resetPasswordToken: null, resetPasswordTokenExpiresAt: null}})

        await sendResetSuccessEmail(user.email, res)

    } catch(e) {
        console.error(e)
        res.status(500).json({success: false, error: 'Error while resetting password', error: e})
    }
}

export async function followUnfollowUser(req,res) {

try {
  
     const id = req.params.id
     if(!id || isNaN(id)) return res.status(400).json({success: false, msg: 'Invalid user id'})
     const userId = parseInt(id)

     const currentUser = await prisma.user.findUnique({where: {id: req.userId}})
     const userToFollow = await prisma.user.findUnique({where: {id: userId}})

     if(!currentUser || !userToFollow) return res.status(400).json({success: false, msg: 'User not found'})

     if(id === req.userId) return res.status(400).json({success: false, msg: 'You cannot follow or unfollow yourself'})

    const isFollowing = currentUser.following.includes(id)

    await prisma.$transaction(async prisma => {
    if(isFollowing) {
        await prisma.user.update({where : {id: currentUser.id}, data: {following: currentUser.following.filter(id => id != userToFollow.id)}})
        await prisma.user.update({where: {id: userToFollow.id}, data: {followers: userToFollow.followers.filter(id => id != currentUser.id)}})
        return res.status(200).json({success: true, msg: 'user unfollowed successfully'})

    } else {
        await prisma.user.update({where: {id: currentUser.id}, data: {following: {set: [...currentUser.following, userToFollow.id]}}})
        await prisma.user.update({where: {id: userToFollow.id}, data: {followers: {set: [...userToFollow.followers, currentUser.id]}}})
        return res.status(200).json({success: true, msg: 'user followed successfully'})
    }
})

} catch(e) {
    console.error(e)
    return res.status(500).json({success: false, msg: 'Error while following a user'})
}

}

export async function updateProfile(req,res) {
    try {
         
        const parsedData = updateProfileSchema.safeParse(req.body)
        if(!parsedData.success) return res.status(400).json({success: false, msg: 'Invalid inputs'})
        const {name, profilePicture, bio} = parsedData.data

        const user = await prisma.user.findFirst({where: {id: req.userId}})
        if(!user) return res.status(400).json({success: false, msg: 'User not found'})

        await prisma.user.update({where: {id: req.userId}, data: {name, profilePicture, bio}})
        res.status(200).json({success: true, msg: 'user profile updated successfully'})

    } catch(e) {
        console.error(e)
        res.status(500).json({success: false, msg: 'Error while updating profile'})
    }
}

export async function getProfile(req,res) {
    try {

        const username = req.params.username
        const user = await prisma.user.findUnique({where: {username}})
        if(!user) return res.status(400).json({success: false, msg: 'User not found'})

        res.status(200).json({success: true, msg: 'user profile fetched successfully', user})

    } catch(e) {
        console.error(e)
        res.status(500).json({success: false, msg: 'Error while getting user profile'})
    }
}

export async function checkAuth(req,res) {
     try {
           const token = req.cookies.jwt
           if(!token) return res.status(401).json({isLoggedIn: false})
           jwt.verify(token, process.env.JWT_SECRET, (err,decoded) => {
           if(err) return res.status(403).json({isLoggedIn: false})
            
           res.status(200).json({isLoggedIn: true, user: decoded.user})
        })
     } catch (e) {
        console.error(e)
        res.status(500).json({success: false, msg: 'Error while authenticating user', error: e.message})
     }
}