import bcrypt from "bcrypt";
import mongoose from "mongoose";
import UserModel from "./models/users.js";

mongoose
  .connect("mongodb+srv://oblivion:acdc2004@omex.iv9b8.mongodb.net/")
  .then(async () => {
    console.log("DB connected");

    const existingUser = await UserModel.findOne({ username: "admin" });
    if (existingUser) {
      console.log("User already exists!");
      process.exit();
    }

    const passwordHash = await bcrypt.hash("acdc2025", 10);

    const user = new UserModel({
      username: "omex-admin",
      passwordHash,
    });

    await user.save();
    console.log("User created!");
    process.exit();
  })
  .catch((err) => {
    console.log("DB error", err);
    process.exit(1);
  });
