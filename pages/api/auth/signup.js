import ConectToDB from "@/configs/db";
import userModel from "@/model/userModel";
import { GenerateToken, HashPassWord } from "@/utils/auth";
import { serialize } from "cookie";

export default async function handler(req, res) {
  ConectToDB();
  if (req.method !== "POST") {
    return false;
  }

  try {
    const { firstName, lastName, userName, email, password } = req.body;

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !userName.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      return res.status(422).json({ message: "entry is invalid" });
    }

    const AllUsers = await userModel.find({});

    const isUserExist = await userModel.findOne({
      $or: [{ email }, { userName }],
    });
    if (isUserExist) {
      return res
        .status(422)
        .json({ message: "user name or email is exist ! plz login... " });
    }
    const hashedPassword = await HashPassWord(password);
    const token = GenerateToken({ email });

    await userModel.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
      role: AllUsers.length > 0 ? "USER" : "ADMIN",
    });

    return res
      .setHeader(
        "Set-Cookie",
        serialize("token", token, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 12,
        })
      )
      .status(201)
      .json({ message: "user successfully created !" });
  } catch (error) {
    return res.status(500).json({ message: "Unknown server error !" });
  }
}
