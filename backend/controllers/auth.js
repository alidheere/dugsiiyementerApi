
import User from '../models/user.js';
import { generateToken } from '../utils/genarateToken.js';
export const register = async (req, res) => {
    try {
        let { name, password, email, role } = req.body;

        email = email.toLowerCase();

        const exists = await User.findOne({ email });

        if (exists) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const user = await User.create({
            name,
            password,
            email,
            role
        });

        const token = generateToken(user._id);

        res.status(201).json({ token });

    } catch (err) {
        console.log("REGISTER ERROR:", err);

        res.status(500).json({
            message: err.message
        });
    }
};

export const login= async (req, res, next)=>{
    let {email, password}=req.body
    try{
        email= email.toLowerCase()

        const user = await User.findOne({email})
        if(!user || !( await user.comparePassword(password))){
            return res.status(401).json({massage: "invalid email or password"})
        }
        console.log("login info", user)
        const token = generateToken(user._id)

        res.json({token})
    }catch(err){
        next(err)
    }
}


export const getProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;    
        const user = await User.findById(userId);
        res.json({ user });
    } catch (err) {
        next(err);
    }
}