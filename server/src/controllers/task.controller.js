import { Task } from "../models/task.model.js";

export const getTasks = async (req, res, next) => {
    try {
        const { status } = req.query;
        const isAdmin = req.user.role === 'admin';
        const userId = req.user.id;

        
        let filter = {};
        if (status) filter.status = status;
        if (!isAdmin) filter.assignedTo = userId;

        // Fetch tasks with user info
        let tasks = await Task.find(filter)
            .populate('assignedTo', 'username email profileImage')
            .lean(); // lean() to get plain JavaScript objects

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
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'username email profileImage')
            .lean();

            if(!task)
            return next(errorHandler(404, 'Task not found'));

            res.status(200).json({
                success: true,
                message: 'Task fetched successfully',
                data: task,
            });
        
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

        const task = await Task.findById(req.params.id);
        if(!task) 
        return next(errorHandler(404, 'Task not found'));

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoCheckList = req.body.todoCheckList || task.todoCheckList;
        task.attachments = req.body.attachments || task.attachments;

        if(req.body.assignedTo)
        {
            if(!Array.isArray(req.body.assignedTo)){
                return next(errorHandler(400, 'Assigned to should be an array'));
            }
            task.assignedTo = req.body.assignedTo;
        }
       const updatedTask = await task.save();


        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: updatedTask,
        });
        
    } catch (error) {
        next(error);
        
    }
}

export const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if(!task) 
        return next(errorHandler(404, 'Task not found'));

        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
        });
        
    } catch (error) {
        next(error);
        
    }
}

export const updateTaskStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      if (!status) {
        return next(errorHandler(400, 'Status is required'));
      }
  
      const task = await Task.findById(id);
      if (!task) {
        return next(errorHandler(404, 'Task not found'));
      }
  
      const isAssigned = task.assignedTo.some(
        (userId) => userId.toString() === req.user.id.toString()
      );
  
      if (!isAssigned && req.user.role !== 'admin') {
        return next(errorHandler(403, 'You are not authorized to update this task'));
      }
  
      task.status = status;
  
      if (status === 'Completed') {
        task.todoCheckList = task.todoCheckList.map((item) => ({
          ...item,
          completed: true,
        }));
        task.progress = 100;
      }
  
      await task.save();
  
      res.status(200).json({
        success: true,
        message: 'Task status updated successfully',
        data: task,
      });
  
    } catch (error) {
      next(error);
    }
  };
  

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

