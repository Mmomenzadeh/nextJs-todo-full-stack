import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

const HashPassWord = async (password) => {
  const hashedPassword = await hash(password, 12);

  return hashedPassword;
};

const VerfiyPassword = async (password, hashedPassword) => {
  const res = await compare(password, hashedPassword);

  return res;
};

const GenerateToken = (data) => {
  const token = sign({ ...data }, process.env.privateKey, { expiresIn: "12h" });

  return token;
};
const VerfiyToken = (token) => {
  try {
    // decoded  :
    const paylaodToken = verify(token, process.env.privateKey);

    return paylaodToken;
  } catch (error) {
    console.log({ "decoded has error => ": error });
  }
};
export { HashPassWord, GenerateToken, VerfiyToken, VerfiyPassword };
