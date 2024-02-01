import ConectToDB from "@/configs/db";

export default function handler(req, res) {
  ConectToDB();
  res.status(200).json({ message: "everything ok" });
}
