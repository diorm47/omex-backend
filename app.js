import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import * as DataController from "./controllers/datas-controller.js";
import * as UserController from "./controllers/user-controller.js";
import checkAuth from "./utils/check-auth.js";
import { startTimerUpdate } from "./services/timerService.js";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("db ok");
    startTimerUpdate();
  })
  .catch((err) => console.log("db error", err));

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

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

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

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

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server running on port ${PORT}`);
});
