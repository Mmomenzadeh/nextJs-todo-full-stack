import ConectToDB from "@/configs/db";
import todoModel from "@/model/todoModel";
import userModel from "@/model/userModel";
import { VerfiyToken } from "@/utils/auth";

export default async function handler(req, res) {
  ConectToDB();

  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "you are " });
  }

  const paylaodToken = VerfiyToken(token);

  if (!paylaodToken) {
    return res.status(401).json(" you are ");
  }

  const user = await userModel.findOne({ email: paylaodToken.email });
  const { id } = req.query;

  switch (req.method) {
    case "DELETE":
      await todoModel.findOneAndDelete({ _id: id });
      res.status(200).json({ message: "todo successfully deleted !" });
      break;

    case "PATCH":
      const { isCompleted } = req.body;

    //   console.log(isCompleted)

      await todoModel.findOneAndUpdate(
        { _id: id },
        { $set: { isCompleted: isCompleted } }
      );

      res.status(200).json("todo successfully edited ! ");
      break;

    default:
      res.status(200).json("you are in default");
      break;
  }
}
