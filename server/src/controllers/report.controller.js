import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import exceljs from 'exceljs'


export const exportTaskReport = async (req, res, next) => {
    try {
        const tasks = await Task.find().populate('assignedTo', 'name email');

        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet("Tasks Report");

        worksheet.columns = [
            { header: "Task ID", key: "id", width: 25 },
            { header: "Title", key: "title", width: 30 },
            { header: "Description", key: "description", width: 50 },
            { header: "Priority", key: "priority", width: 15 },
            { header: "Status", key: "status", width: 20 },
            { header: "Due Date", key: "dueDate", width: 20 },
            { header: "Assigned To", key: "assignedTo", width: 30 },
        ];

        tasks.forEach(task => {
            const assignedTo = task.assignedTo && task.assignedTo.length > 0
                ? task.assignedTo.map(user => `${user.name} (${user.email})`).join(', ')
                : 'Unassigned';

            worksheet.addRow({
                id: task._id.toString(),
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : '',
                assignedTo,
            });
        });

        // Set response headers
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=task_report.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        next(error);
    }
};



export const exportUserReport = async (req, res, next) => {
    try {
        const users = await User.find().select('name email role createdAt').lean();
        const userTasks = await Task.find().populate('assignedTo', 'name email').lean();

        // Create a map to track each user's task data
        const userTaskMap = {};

        users.forEach(user => {
            userTaskMap[user._id.toString()] = {
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                totalTasks: 0,
                pendingTasks: 0,
                completedTasks: 0,
            };
        });

        // Populate the map with task info
        userTasks.forEach(task => {
            if (Array.isArray(task.assignedTo)) {
                task.assignedTo.forEach(assignedUser => {
                    const userId = assignedUser._id.toString();
                    if (userTaskMap[userId]) {
                        userTaskMap[userId].totalTasks += 1;
                        if (task.status === 'To Do' || task.status === 'In Progress') {
                            userTaskMap[userId].pendingTasks += 1;
                        } else if (task.status === 'Completed') {
                            userTaskMap[userId].completedTasks += 1;
                        }
                    }
                });
            }
        });

        // Prepare Excel workbook
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('User Report');

        worksheet.columns = [
            { header: 'Name', key: 'name', width: 25 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Role', key: 'role', width: 15 },
            { header: 'Created At', key: 'createdAt', width: 20 },
            { header: 'Total Tasks', key: 'totalTasks', width: 15 },
            { header: 'Pending Tasks', key: 'pendingTasks', width: 15 },
            { header: 'Completed Tasks', key: 'completedTasks', width: 15 },
        ];

        Object.values(userTaskMap).forEach(user => {
            worksheet.addRow({
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt.toISOString().split('T')[0],
                totalTasks: user.totalTasks,
                pendingTasks: user.pendingTasks,
                completedTasks: user.completedTasks,
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=user_report.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        next(error);
    }
};
