import express from 'express';
import { saveBooklet, getAllBooklets } from '../controllers/bookletController.js';

const router = express.Router();

router.post('/', saveBooklet);
router.get('/', getAllBooklets);

export default router;
