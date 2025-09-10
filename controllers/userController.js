import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';


export const register = async(req,res)=>{
    const {name,email,password} = req.body;
    //checking if any field in missing
    if(!name||!email||!password){
        return res.json({success:false,message:"Mising details"})
    }
    try {
        //checking if user exist with the entered email
        const existingUser =await userModel.findOne({email})
        if(existingUser){
            return res.json({success:false,message:"user already exists"})
        }
        //hashinf the password
        const hashedPassword = await bcrypt.hash(password,10)

        //creating new user
        const user = new userModel({name,email,password:hashedPassword})
        //saving the created user in the database
        await user.save()

        //generating token
        const token = jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:'7d'})

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000

        })
        const mailOptions = {
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:'Welcome to my website',
            text:`Welcome to my website.Your account has been created with email id: ${email}`

        }
        await transporter.sendMail(mailOptions)
        return res.json({success:true})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}
export const login = async(req,res)=>{
     const {email,password} = req.body;
     if(!email||!password){
        return res.json({success:false,message:"Mising details"})
    }
    try {
        const user = await userModel.findOne({email})
        if(!user){
             return res.json({success:false,message:"user not exists"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.json({success:false,message:"invalid password"})
        }
        const token = jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:'7d'})

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000

        })
        return res.json({success:true})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}
export const logout = async(req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
        })
        return res.json({strict:true,message:"Logged Out"})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}
export const sendVerifyOtp = async(req,res)=>{
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId)
        if(user.isAccountVerified){
            return res.json({success:false,message:"Account already verified"})
        }
        const otp = String(Math.floor(10000+Math.random()*900000))
        user.verifyOtp = otp
        user.verifyOtpExpiredAt = Date.now()+24*60*60*1000

        await user.save()
        const mailOption = {
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Account Verification OTP',
            text:`Your OTP is ${otp}.Verify your account using this OTP`
        }
        await transporter.sendMail(mailOption)
        res.json({success:true,message:"Verification OTP sent on email"})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}
export const verifyEmail = async(req,res)=>{
    const {userId,otp} = req.body;
    if(!userId || !otp){
        return res.json({success:false,message:"Mising details"})
    }
    try {
        const user = await userModel.findById(userId)
        if(!user){
            return res.json({success:false,message:"User not found"})
        }
        if(user.verifyOtp===' '||user.verifyOtp!==otp){
            return res.json({success:false,message:"Invalid OTP"})
        }
        if(user.verifyOtpExpiredAt<Date.now()){
            return res.json({success:false,message:"OTP expired"})
        }
        user.isAccountVerified = true
        user.verifyOtp = ''
        user.verifyOtpExpiredAt = 0

        await user.save()
        return res.json({success:true,message:"Email verified successfully"})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}
export const isAuthenticated = async(req,res)=>{
    try {

        return res.json({success:true})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}
export const sendResetOTP = async(req,res)=>{
    const {email} = req.body
    if(!email){
        return res.json({success:false,message:"email is required"})
    }
    try {
        const user = await userModel.findOne({email})
        const otp = String(Math.floor(10000+Math.random()*900000))
        user.resetOtp = otp
        user.resetOtpExpiredAt = Date.now()+5*60*1000

        await user.save()
        const mailOption = {
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Password reset OTP',
            text:`Your OTP for resetting your password is ${otp}.`
        }
        await transporter.sendMail(mailOption)
        res.json({success:true,message:"Verification OTP sent on email"})
        if(!user){
            return res.json({success:false,message:error.message})
        }

    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}
export  const resetUserPassword = async(req,res)=>{
    const {email,otp,newPassword} = req.body

    if(!email || !newPassword || !otp){
        return res.json({success:false,message:"Missing fields"})
    }
    try {
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:'User not found'})
        }
        if(user.resetOtp===""||user.resetOtp!==otp){
            return res.json({success:false,message:"Invalid otp"})
        }
        if(user.resetOtpExpiredAt<Date.now()){
            return res.josn({success:false,message:"otp expired"})
        }
        const hashedPassword = await bcrypt.hash(newPassword,10)
        user.password = hashedPassword
        user.resetOtp = ''
        user.resetOtpExpiredAt = 0
        await user.save()
        return res.json({success:true,message:'Password has been updated successfully'})

    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}