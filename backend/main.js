import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import rootRouter from "./routers/index.js";

dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
console.log(process.env.frontend_url);
app.use(
  cors({
    origin: process.env.frontend_url,
    credentials: true,
  })
);

app.use(express.static(import.meta.dirname + "/public"));
app.use(express.static(import.meta.dirname + "/uploads/templates"));

app.use("/api", rootRouter);

app.get("/", (req, res) => res.send("Hello World!"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server side error occurred" });
});

async function init() {
  try {
    console.log("Connecting with MongoDB...");
    await mongoose.connect(process.env.mongodb_url);
    console.log("Connected with MongoDB");

    app.listen(port, () => console.log(`App listening on port ${port}!`));
  } catch (e) {
    console.error("MongoDB connection error:", e);
  }
}

init();
