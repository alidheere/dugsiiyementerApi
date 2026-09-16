// import mongoose from "mongoose";




// const  taskSchema= new  mongoose.Schema(
//     {
//         title: {type: String, required: true},
//          decsription: String,
//          status: {
//             type: String,
//             enum: ["pending", "in progress", "completed"],
//             default: "pending"
//          },
//          dueDate: Date,
//          createdBy:{
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "user",
//             required: true,
//          }
//     },{timestamps: true}
// )

// export default mongoose.model("task", taskSchema)
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "in progress", "completed"],
      default: "pending",
    },

    dueDate: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Task", taskSchema);