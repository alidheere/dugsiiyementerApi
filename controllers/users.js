

import User from '../models/user.js';
import { generateToken } from '../utils/genarateToken.js';
export const getUsers= async (req, res)=>{
 const users = await User.find();
    res.json(users)
}

export const getUserById=async (req, res)=>{
    const user= await User.findById(req.params.id);
    if(!user) return res.status(404).send({message:'user not found'});
    res.json(user)
}

export const createUser= async (req, res)=>{
    const user= new User(req.body);
 const savedUser =await user.save();
 res.status(201).json(savedUser);
}

export const updateUser = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({
                message: 'user not found'
            });
        }

        res.json(updatedUser);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: 'Error updating user',
            error: err.message
        });
    }
};

export const deleteUser = async (req, res) => {
    const {id}=req.params;

    try{
        const deletedUser= await User.findByIdAndDelete(id);
        res.json({message:'user deleted successfully', user: deletedUser});

    }catch(err){
        res.status(500).json({message:'Error deleting user'});
    }
}

