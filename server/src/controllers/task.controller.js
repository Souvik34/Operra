import { Task } from "../models/task.model.js";

export const getTasks = async (req, res, next) => {
    
}

export const getTaskById = async (req, res, next) => {

    try {
        
    } catch (error) {
        next(error);
        
    }
}

export const createTask = async (req, res, next) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist,
        } = req.body;

        if(!Array.isArray(assignedTo)){
            return next(errorHandler(400, 'Assigned to should be an array'));
        }
        const task = new Task({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            attachments,
            todoChecklist,
        }); 
        await task.save();

        // Send response
        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task,
        });


        
    } catch (error) {
        next(error);
        
    }
}

export const updateTask = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
        
    }
}

export const deleteTask = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
        
    }
}

export const updateTaskStatus = async (req, res, next) => {

    try {
        
    } catch (error) {
        next(error);
        
    }
}

export const updateTaskList = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
        
    }
}

export const getDashboardData = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
        
    }
}

export const getUserDashboardData = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
        
    }
}

