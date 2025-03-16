import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/users.js";

// Секретный ключ для подписи токена
const SECRET_KEY = "oblivion";

// Логин
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    console.log("User found:", user);

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password 1" });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid username or password 2" });
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Обновление пароля
export const updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await UserModel.updateOne({}, { passwordHash: hashedPassword });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
