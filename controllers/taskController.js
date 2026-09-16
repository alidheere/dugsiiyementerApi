
// import Task from "../models/task.js";

// export const createTask=async(req ,res,next)=>{
//     try {
//         const tasks = await tasks.create({...req.body, createBy:req.user._id})
//         res.status(201).json(tasks)
//     } catch (error) {
//         next(error)
//     }
// }

import Task from "../models/task.js";

export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      createdBy: req.user._id
    });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const updateTask=async(req,res,next)=>{
  try {
    
    const tasks= await Task.findOneAndUpdate(
      {_id: req.params.id,   createdBy: req.user._id},
      req.body,
      {new: true},
  
    );
        if(!Task) return res.status(404).json("task not found")
          res.json(tasks)
  } catch (error) {
    next(error)
  }
}

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json({
      message: "Task deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};