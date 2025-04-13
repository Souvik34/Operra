import { Router } from 'express';
import {
    getDashboardData,
    getUserDashboardData, 
    getTasks, 
    getTaskById, 
    createTask, 
    updateTask, 
    deleteTask, 
    updateTaskStatus, 
    updateTaskList
} from '../controllers/task.controller.js';
import { verifyToken, verifyAdmin } from '../utils/verifyToken.js';

const router = Router();

router.route('/dashboard-data').get(verifyToken, getDashboardData);
router.route('/user-dashboard-data').get(verifyToken, getUserDashboardData);
router.route('/').get(verifyToken, getTasks);
router.route('/:id').get(verifyToken, getTaskById);
router.route('/').post(verifyToken, verifyAdmin, createTask);
router.put('/:id', verifyToken, updateTask);
router.delete('/:id', verifyToken, verifyAdmin, deleteTask);
router.put('/:id/status', verifyToken, updateTaskStatus);
router.put('/:id/todo', verifyToken, updateTaskList);

export default router;