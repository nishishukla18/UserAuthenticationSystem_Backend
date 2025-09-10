import express from 'express'
import userAuth from '../middlewares/userAuth.js'
import { getUserData } from '../controllers/userDataController.js'

const userDatarouter = express.Router()

userDatarouter.get('/data',userAuth,getUserData)


export default userDatarouter