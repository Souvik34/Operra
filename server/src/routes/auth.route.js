import {Router} from 'express';
import { signup, signin, signout, getUser, updateUser } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyToken.js';
import { signupSchema } from '../utils/validationSchema.js';
import { validate } from '../middlewares/validate.js';
const router = Router();


router.route('/signup').post(validate(signupSchema), signup);
router.route('/signin').post(signin)
router.route('/profile').get(verifyToken, getUser);
router.route('/profile').put(verifyToken, updateUser);
router.route('/signout').get(signout);


export default router;