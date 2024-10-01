import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config({})

const port = process.env.PORT || 3000; 
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: 'http://localhost:5173', credentials: true}))

app.get("/", (_, res) => res.send("<h1>Hello world</h1>"));

app.listen(port, () => {
    console.log("Server is running on port " + port)
  }
)
