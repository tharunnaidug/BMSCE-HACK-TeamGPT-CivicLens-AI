import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import "./config/db.js";

import setupDatabase from "./config/setupDatabase.js";

// ================= ROUTES =================

import geoRoutes from "./routes/geoRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import subAdminRoutes from "./routes/subAdminRoutes.js";

import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();


// ================= MIDDLEWARE =================

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

app.use(express.urlencoded({
  extended: true,
}));

app.use(cookieParser());

app.use(helmet());

app.use(morgan("dev"));
app.use(errorHandler);

// ================= API ROUTES =================

app.use("/api/auth", authRoutes);

app.use("/api/complaints", complaintRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/subadmin", subAdminRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/geo", geoRoutes);
app.use("/api/notifications",notificationRoutes);

// ================= ROOT ROUTE =================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CivicLens API Running",
  });
});


// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {

  console.log(
    `Server running on port ${PORT}`
  );

  await setupDatabase();
});