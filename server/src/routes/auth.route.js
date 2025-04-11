import {Router} from 'express';
import { signup, signin, signout, getUser, updateUser } from '../controllers/auth.controller.js';
const router = Router();

router.route('/signup').post(signup);
router.route('/signin').post(signin)
router.route('/profile').get(getUser);
router.route('/profile').put(updateUser);
router.route('/signout').get(signout);