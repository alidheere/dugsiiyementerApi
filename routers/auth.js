import express from 'express';
import { login, register } from '../controllers/auth.js';
import { protect } from '../middlewares/auth.js';
import { createUserSchema, } from '../schemas/userSchema.js';
import { validate } from '../middlewares/validatedZod.js';
const router= express.Router();

router.post('/register',  validate(createUserSchema),register)
router.post('/login', login)

router.get('/profile',  protect,(req, res)=>{
    console.log("req.user", req.user)
    console.log(req.user)
})
export default router;
