import { Router } from 'express';
import { exportTaskReport, exportUserReport } from '../controllers/report.controller.js';
import { verifyAdmin, verifyToken } from '../utils/verifyToken.js';

const router = Router();

router.route('/export/task').get(verifyToken, verifyAdmin, exportTaskReport);
router.route('/export/user').get(verifyToken, verifyAdmin, exportUserReport);


export default router;