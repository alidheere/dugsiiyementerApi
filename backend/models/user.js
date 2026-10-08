
// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';
// const userSchema= new mongoose.Schema({
//     name: String,
//     email: { type: String, unique: true },
//     password: String,
// });
// // hash the password before saving the user document
// userSchema.pre('save', async function next(){
//     if(!this.isModified("password")) return next() ;
//     const salt = await bcrypt.genSalt(10);
//     this.password =await bcrypt.hash(this.password, salt); 
//    next()
// })
// // method to compare the password entered by the user with the hashed password stored in the database

// userSchema.methods.comparePassword = async function (inputPassword) {
//     return await bcrypt.compare(inputPassword, this.password);
// }

// export default mongoose.model('User', userSchema);


import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: String,

    email: {
        type: String,
        unique: true
    },

    password: String,

    role: {
        type: String,
        enum:["user", "admin"],
         default: "user"
    }
   
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

export default mongoose.model('User', userSchema);

