import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import authRouter from './routes/userRoutes.js'
import userDatarouter from './routes/userDataRoutes.js'


connectDB()
const app = express()
const port = process.env.PORT||4000

app.use(express.json());

app.use(cookieParser())
const allowedOrigins = ['http://localhost:5173']
app.use(cors({origin:allowedOrigins,credentials:true}))

app.get('/',(req,res)=>{
    res.send("API working")
})
app.use('/api/auth',authRouter)
app.use('/api/user',userDatarouter)

app.listen(port,(req,res)=>{
    console.log(`Running on port ${port}`)
})