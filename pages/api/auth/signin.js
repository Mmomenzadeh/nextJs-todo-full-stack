import ConectToDB from "@/configs/db";
import userModel from "@/model/userModel";
import { GenerateToken, VerfiyPassword } from "@/utils/auth";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return false;
  }

  try {
    ConectToDB();
    const { identifier, password } = req.body;

    const isUserExist = await userModel.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });

    if (!isUserExist) {
      return res.status(401).json({ message: "you are unauthorized !" });
    }

    const isValidPassWord = await VerfiyPassword(
      password,
      isUserExist.password
    );

    if (!isValidPassWord) {
      return res.status(401).json("your password or email is an incorrect");
    }

    const token = GenerateToken({ email: isUserExist.email });
    return res
      .setHeader(
        "Set-Cookie",
        serialize("token", token, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 12,
        })
      )
      .status(200)
      .json({ message: "user successfully login ... " });
  } catch (error) {
    return res.status(500).json({ message: "Unknown server error !" });
  }
}
