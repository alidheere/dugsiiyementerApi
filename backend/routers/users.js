
import express from 'express';
const router= express.Router();
import {getUsers, getUserById, createUser, updateUser, deleteUser, } from '../controllers/users.js';

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/create', createUser);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);


export default router;