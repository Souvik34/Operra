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
        const {todoCheckList} = req.body;
        const task = await Task.findById(req.params.id);

        if(!task)
        return next(errorHandler(404, 'Task not found'));

        if(!task.assignedTo.map(id => id.toString()).includes(req.user.id.toString())&& req.user.role !== 'admin')
        return next(errorHandler(403, 'You are not authorized to update this task'));
        
        if (!Array.isArray(todoCheckList)) {
            return next(errorHandler(400, 'Invalid todo checklist format'));
        }
        

        task.todoCheckList = todoCheckList; // Update the todoCheckList with the new data

        // Auto update progress based on completed todos

        const completedCount =task.todoCheckList.filter(item => item.completed).length;
        const totalCount = task.todoCheckList.length;

        task.progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0; // Calculate progress as a percentage

        // Auto mark completed
        if (task.progress === 100) {
            task.status = 'Completed'; // Update status to Completed
        } else if (task.progress > 0) {
            task.status = 'In Progress'; // Update status to In Progress
        } else {
            task.status = 'To Do'; // Update status to To Do
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: { todoCheckList, progress: task.progress, status: task.status } },
            { new: true }
          ).populate('assignedTo', 'username email profileImage').lean();
          

        res.status(200).json({
            success: true,
            message: 'Task checklist updated successfully',
            data: updatedTask,
        })

    } catch (error) {
        next(error);
        
    }
}

export const getDashboardData = async (req, res, next) => {
    try {
        //fetch stats

        const allTasks = await Task.countDocuments({});
        const completedTasks = await Task.countDocuments({ status: 'Completed' });
        const pendingTasks = await Task.countDocuments({ status: 'To Do' });
        const overdueTasks =  await Task.countDocuments({
            status: {$ne: 'Completed'},
            dueDate :{$lt: new Date()},
        })

        const taskStatus = ["To Do", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
            $group: {
                _id: '$status',
                count: { $sum: 1},
            },
        },
        ]);

        const taskDistribution = taskStatus.reduce((acc, status)=>{
            const formattedKey = status.replace(/\s+/g, ""); // Remove spaces
            acc[formattedKey]= 
            taskDistributionRaw.find((item)=> item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution['All'] = allTasks // Add total count to taskDistribution

        //all priority tasks are included or not 

        const taskPriority = ['Low', 'Medium', 'High'];
        const taskPriorityLevelRaw = await Task.aggregate([
            {
                $group:{
                    _id: "$priority",
                    count :{$sum: 1},
                },
            },
        ]);

        const taskPriorityLevel = taskPriority.reduce((acc, priority)=> {
            acc[priority]= taskPriorityLevelRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});


        // Fetch recent 10 tasks

        const recentTasks = await Task.find()
        .sort({ createdAt: -1})
        .limit(10)
        .select('title status priority dueDate createdAt');

        res.status(200).json({
            statistics: {
                allTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevel,
            },
            recentTasks,
        });

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

