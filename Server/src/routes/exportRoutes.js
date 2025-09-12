import express from 'express';
import { exportSlides } from '../controllers/exportController.js';

const router = express.Router();

router.post('/', exportSlides);

export default router;
