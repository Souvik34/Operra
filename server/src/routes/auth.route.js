import {Router} from 'express';
import { signup, signin, signout, getUser, updateUser } from '../controllers/auth.controller.js';
import { verifyToken } from '../../utils/verifyToken.js';
const router = Router();

router.route('/signup').post(signup);
router.route('/signin').post(signin)
router.route('/profile').get(verifyToken, getUser);
router.route('/profile').put(verifyToken, updateUser);
router.route('/signout').get(signout);