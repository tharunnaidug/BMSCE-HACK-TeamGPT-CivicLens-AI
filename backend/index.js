import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import setupDatabase from "./config/setupDatabase.js";
import cookieParser from "cookie-parser";

import "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.use("/api/complaints", complaintRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CivicLens API Running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async() => {
  console.log(`Server running on port ${PORT}`);

  await setupDatabase();
});