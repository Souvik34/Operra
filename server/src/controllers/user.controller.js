import { Task } from '../models/task.model.js';
import { User } from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password -__v').sort({ createdAt: -1 });

        if (users.length === 0) {
            return next(errorHandler(404, 'No users found'));
        }

        // Add task to user
        const usersWithTasks = await Promise.all(users.map(async (user) => {
            const pendingTasks = await Task.countDocuments({
                assignedTo: user._id,
                status: 'pending'
            });
            const inProgressTasks = await Task.countDocuments({
                assignedTo: user._id,
                status: 'in-progress'
            });
            const completedTasks = await Task.countDocuments({
                assignedTo: user._id,
                status: 'completed'
            });

            return {
                ...user.toObject(),
                pendingTasks,
                inProgressTasks,
                completedTasks
            };
        }));

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: usersWithTasks
        });

    } catch (error) {
        next(error);
    }
};


export const getUserById = async (req, res, next) => { }

export const deleteUser = async (req, res, next) => { }

