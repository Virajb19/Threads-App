import { signInSchema, signUpSchema } from "../types/userTypes.js";
import { prisma } from "../utils/db.js";
import bcrypt from 'bcrypt'
import { generateToken } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../emails/Emails.js";

export async function signup(req,res) {
 try {
    const userData = signUpSchema.safeParse(req.body)
    if(!userData.success) return res.status(400).json({error : 'Invalid user inputs', userData})
    const {username, email, password} = userData.data

    const userExists = await prisma.user.findFirst({where : {OR : [{email}, {username}]}})
    if(userExists) return res.status(409).json({error: 'User already exists'})

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    const verificationCode = Math.floor(Math.random() * 900000 + 100000).toString()
    const user = await prisma.user.create({data : {username, email, password: hashedPassword, verificationCode, verificationCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000)}})

    const token = generateToken(user.id, res)

    await sendVerificationEmail(user.email, verificationCode, res)

    const {password: _, ...userWithoutPassword} = user

    res.status(201).json({success: true, msg: 'User created successfully', user: userWithoutPassword, token})
   
 } catch(err) {
       console.error(err)
       res.status(500).json({msg: 'Error while signing up', error: err})
 }
}

export async function signin(req,res) {
 try {
    const userData = signInSchema.safeParse(req.body)
    if(!userData.success) return res.status(400).json({error: 'Invalid user inputs', userData})

    const {email, password} = userData.data

    const user = await prisma.user.findFirst({where: {email}})
    const isMatch = await bcrypt.compare(password,user?.password || "")
    if(!user || !isMatch) return res.status(401).json({success: false, error : 'Invalid credentials'})

    const token = generateToken(user.id, res)

    const updatedUser = await prisma.user.update({where: {email}, data: {lastLogin: new Date()}})

    const {password: _, ...userResponse} = updatedUser

    res.status(200).json({success: true, msg: 'Logged in successfully',user: userResponse, token})

 } catch(err) {
     console.error(err)
     res.status(500).json({msg: 'Error while logging in', error: err})
 }
}

export async function signout(req,res) {
    try {
        res.clearCookie("jwt")
        res.status(200).json({success: true, msg: 'Logges out successfully'})
    } catch(err) {
        console.error(err)
        res.status(500).json({success: false, msg: 'Error while signing out', error: err})
    }
}