import userModel from "@/model/userModel";
import { VerfiyToken } from "@/utils/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return false;
  }

  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "you are " });
  }
  const payloadToken = VerfiyToken(token);

  if (!payloadToken) {
    return res.status(401).json({ message: "you are " });
  }

  const user = await userModel.findOne(
    { email: payloadToken.email },
    "role firstName lastName -_id"
  );

  return res.status(200).json(user);
}
