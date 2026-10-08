import express, { Router } from 'express';
const router= express.Router();
import { protect } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';

router.get('/dashboard', protect,  authorize('admin'),(req, res)=>{
    res.json({message: "welcome to the admin dashboard"})
})



export default router;