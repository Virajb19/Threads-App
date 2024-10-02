import { signInSchema, signUpSchema } from "../types/userTypes.js";
import { prisma } from "../utils/db.js";
import bcrypt from 'bcrypt'
import { generateToken } from "../utils/generateTokenAndSetCookie.js";

export async function signup(req,res) {
 try {
    const userData = signUpSchema.safeParse(req.body)

    if(!userData.success) return res.status(400).json({error : 'Invalid user inputs', userData})

    const {username, email, password} = userData.data

    if(!username || !email || !password) return res.status(400).json({error: 'All inputs required'})

    const userExists = await prisma.user.findFirst({where : {OR : [{email}, {username}]}})
    if(userExists) return res.status(409).json({error: 'User already exists'})

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    const user = await prisma.user.create({data : {username, email, password: hashedPassword}})

    const token = generateToken(user.id, res)

    

    const {password: _, ...userWithoutPassword} = user

    res.status(201).json({success: true, msg: 'User created successfully', user: userWithoutPassword, token})
   
 } catch(err) {
       console.error(err)
       res.status(500).json({error: 'Internal server error'})
 }
}

export async function signin(req,res) {
 try {
    const userData = signInSchema.safeParse(req.body)
    if(!userData.success) return res.status(400).json({error: 'Invalid user inputs'})

    const {email, password} = userData.data

    const user = await prisma.user.findFirst({where: {email}})
    const isMatch = await bcrypt.compare(password,user?.password || "")
    if(!user || !isMatch) return res.status(401).json({success: false, error : 'Invalid credentials'})

    const token = generateToken(user.id, res)

    const {password: _, ...userResponse} = user

    res.status(200).json({success: true, msg: 'Logged in successfully',user: userResponse, token})

 } catch(err) {
     console.error(err)
     res.status(500).json({error: 'Error while logging in'})
 }
}

export async function signout(req,res) {
    try {
        res.clearCookie("jwt")
        res.status(200).json({success: true, msg: 'Logges out successfully'})
    } catch(err) {
        console.error(err)
        res.status(500).json({error: 'Error while signing out'})
    }
}