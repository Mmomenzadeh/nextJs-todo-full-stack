const mongoose = require("mongoose");
import userModel from "./userModel";
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },

    isCompleted: {
      type: Boolean,
      default: false,
      require: true,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  { timestamps: true }
);

const todoModel = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export default todoModel;
