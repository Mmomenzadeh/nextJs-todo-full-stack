import ConectToDB from "@/configs/db";
import todoModel from "@/model/todoModel";
import userModel from "@/model/userModel";
import { VerfiyToken } from "@/utils/auth";

export default async function handler(req, res) {
  ConectToDB();
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json("you are unauthorized");
  }

  const paylaodToken = VerfiyToken(token);

  if (!paylaodToken) {
    return res.status(401).json("you are unauthorized");
  }

  const user = await userModel.findOne({ email: paylaodToken.email });

  switch (req.method) {
    case "GET":
      const todoList = await todoModel.find({ user: user._id });
      res.status(200).json(todoList);
      break;

    case "POST":
      const { title, isCompleted } = req.body;

      if (!title?.trim()) {
        return res.status(422).json("");
      }

      await todoModel.create({ title, isCompleted, user: user._id });

      res.status(201).json("todo created !");

      break;

    default:
      return res.status(422).json("here is default !");
  }
}
