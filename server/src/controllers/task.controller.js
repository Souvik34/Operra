import { Task } from "../models/task.model.js";

export const getTasks = async (req, res, next) => {
    try {
        const { status } = req.query;
        const isAdmin = req.user.role === 'admin';
        const userId = req.user.id;

        // Build filter
        let filter = {};
        if (status) filter.status = status;
        if (!isAdmin) filter.assignedTo = userId;

        // Fetch tasks with user info
        let tasks = await Task.find(filter)
            .populate('assignedTo', 'username email profileImage')
            .lean(); // lean for faster query + plain JS objects

        // Append completedTodosCount
        tasks = tasks.map(task => {
            const completedTodos = (task.todoCheckList || []).filter(todo => todo.completed).length;
            return {
                ...task,
                completedTodosCount: completedTodos,
            };
        });

        // Status summary counts
        const buildCount = async (statusValue) =>
            Task.countDocuments({
                ...(statusValue && { status: statusValue }),
                ...(isAdmin ? {} : { assignedTo: userId }),
            });

        const [allTasks, completedTasks, inProgressTasks, pendingTasks] = await Promise.all([
            buildCount(),
            buildCount('Completed'),
            buildCount('In Progress'),
            buildCount('Pending'),
        ]);

        res.json({
            success: true,
            message: 'Tasks fetched successfully',
            data: tasks,
            summary: {
                allTasks,
                completedTasks,
                inProgressTasks,
                pendingTasks,
            },
        });

    } catch (error) {
        next(error);
    }
};


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
            todoCheckList,
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
            createdBy: req.user.id,
            attachments,
            todoCheckList,
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

