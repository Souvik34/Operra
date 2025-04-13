import {Router} from 'express';
import { getUsers } from '../controllers/user.controller.js';
import { verifyToken, verifyAdmin} from '../utils/verifyToken.js';


const router = Router();

router.route('/').get(verifyToken, verifyAdmin, getUsers);

export default router;