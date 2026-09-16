import express from 'express';
import { protect } from '../middlewares/auth.js';
import { upload } from '../middlewares/uploud.js';
import { uploadFile } from '../controllers/uploadControlled.js';
const router= express.Router();

router.post('/profile-picture', protect, upload.single('file'),uploadFile)

export default router;