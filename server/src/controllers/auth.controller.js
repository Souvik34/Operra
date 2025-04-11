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
}

export const getUser = async(req, res, next) =>{
}

export const updateUser = async(req, res, next) =>{
}

export const signout = async(req, res, next) =>{
}


