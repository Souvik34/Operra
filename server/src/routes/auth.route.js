import {Router} from 'express';
import { signup, signin, signout, getUser, updateUser } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyToken.js';
import { signupSchema, signinSchema} from '../utils/validationSchema.js';
import { validate } from '../middlewares/validate.js';
import upload from '../middlewares/upload.middleware.js';
import { uploadImage } from '../controllers/upload.controller.js';
const router = Router();

router.route('/signup').post(validate(signupSchema), signup);
router.route('/signin').post(validate(signinSchema), signin)
router.route('/profile').get(verifyToken, getUser);
router.route('/profile').put(verifyToken, updateUser);
router.route('/signout').get(verifyToken,signout);
router.route('/upload-image').post(verifyToken, upload.single('image'), uploadImage);


export default router;