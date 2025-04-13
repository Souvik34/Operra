import {Router} from 'express';
import { getUserById, getUsers, deleteUser } from '../controllers/user.controller.js';
import { verifyToken, verifyAdmin} from '../utils/verifyToken.js';


const router = Router();

router.route('/').get(verifyToken, verifyAdmin, getUsers);
router.route('/:id').get(verifyToken, verifyAdmin, getUserById);
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);

export default router;