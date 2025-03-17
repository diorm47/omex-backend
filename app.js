import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import * as DataController from "./controllers/datas-controller.js";
import * as UserController from "./controllers/user-controller.js";
import checkAuth from "./utils/check-auth.js";
import { startTimerUpdate } from "./services/timerService.js"; 


mongoose
  .connect("mongodb+srv://oblivion:acdc2004@omex.iv9b8.mongodb.net/")
  .then(() => {
    console.log("db ok");
    startTimerUpdate()
  })
  .catch((err) => console.log("db error", err));

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

app.get("/", (req, res) => {
  res.json("Server is working");
});

const upload = multer({ storage });

app.post("/login", UserController.login);
app.put("/update-password", checkAuth, UserController.updatePassword);

app.post("/file", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded!" });
  }
  res.json({ url: `/uploads/${req.file.originalname}` });
});

// Data CRUD
app.get("/datas", DataController.getAll);

app.put("/datas/:id", checkAuth, DataController.update);

app.get("/debug/users", async (req, res) => {
  const users = await UserModel.find();
  res.json(users);
});

app.listen(3001, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server ok");
});
