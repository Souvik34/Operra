import {User} from '../models/user.model.js';
import  {errorHandler} from '../utils/error.js';
import bcrypt from 'bcryptjs';

export const signup = async(req, res, next) =>{
 
    try {
        const{
            username,
            email,
            password,
            profileImage,
            adminInviteToken
        } = req.body;

        // Check if user already exists

        const isValidator = await User.findOne({email});
        if(isValidator){
            return next(errorHandler(400, 'User already exists'));
        }

        // Check if adminInviteToken is provided 
       let role = 'user';
       if(adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN){
        role = 'admin';
       }


       // create new user

       const newUser =  new User({
        username,
        email,
        password,
        profileImage,
        role
       });
       await newUser.save();


       // Send response

       res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            isActive: newUser.isActive,
            profileImage: newUser.profileImage,
            timestamp: newUser.createdAt,
        },
       });
        
    } catch (error) {
        next(error);
    }

}

export const signin = async(req, res, next) =>{
    try {

        const{
            email,
            password,
        } = req.body;

        const validUser = await User.findOne({email});

        if(!validUser){
            return next(errorHandler(404, 'User not found'));
        }

        // check password

        const validPassword = await validUser.comparePassword(password);
        if(!validPassword){
            return next(errorHandler(400, 'Invalid password'));
        }

        // check if user is active

        if(!validUser.isActive){
            return next(errorHandler(403, 'User is not active'));
        }

        // generate tokens
        const accessToken = validUser.generateAccessToken();
        const refreshToken = validUser.generateRefreshToken();

         // Store refresh token in HttpOnly cookie
         res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",

        });

        // Send response with tokens
        res.status(200).json({
            success: true,
            message: "Signin successful!",
            accessToken,
            user: {
                id: validUser._id,
                username: validUser.username,
                email: validUser.email,
            },
        });
        
    } catch (error) {
        next(error);
        
    }
}

export const getUser = async(req, res, next) =>{
    try {
        const user = await User.findById(req.user.id).select('-password -__v -createdAt -updatedAt');
        if(!user){
            return next(errorHandler(404, 'User not found'));
        }
        res.status(200).json({
            success: true,
            message: 'User found',
            data: user,
        });
        
    } catch (error) {
        next(error);
        
    }
}

export const updateUser = async(req, res, next) =>{
    try {
        
    } catch (error) {
        next(error);
        
    }
}

export const signout = async(req, res, next) =>{
}


