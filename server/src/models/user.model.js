import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    
    profileImage: {
        type: String,
        default: null,
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user', 
    },

    isActive: {
        type: Boolean,
        default: true,
    },


}, {timestamps: true});


export const User = mongoose.model('User', userSchema);