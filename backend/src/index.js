import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import { prisma } from './utils/db.js'
import rateLimit from 'express-rate-limit'
import { userRouter } from './routes/userRoutes.js'
import { verifyToken } from './middlewares/verifyToken.js'
import { postRouter } from './routes/postRoutes.js'
import { messageRouter } from './routes/messageRoutes.js'

dotenv.config({})

const port = process.env.PORT || 3000
const app = express()

const generalLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 100, 
  message: 'Too many requests from this IP, please try again after 15 minutes'
})

//MIDDLEWARES
app.use(express.json({ limit : '50mb' }))
app.use(cookieParser())
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}))
app.use(generalLimiter)

const publicPaths = ['/api/v1/user/signin', '/api/v1/user/signup']
app.use((req,res,next) => {
  if(publicPaths.includes(req.path)){
    return next()
  }
  //PROTECTED ROUTES
  verifyToken(req,res,next)
})

// ROUTES
app.use('/api/v1/user', userRouter)
app.use('/api/v1/post', postRouter)
app.use('/api/v1/message', messageRouter)

app.get("/", (_, res) => res.send("<h1>Hello world</h1>"))

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing Prisma client...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing Prisma client...')
  await prisma.$disconnect()
  process.exit(0);
})

app.listen(port, () => {
    console.log("Server is running on port " + port)
  }
)
