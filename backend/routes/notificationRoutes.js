import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  getNotifications,
  markNotificationRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get(
  "/",
  protect,
  getNotifications
);

router.post(
  "/read",
  protect,
  markNotificationRead
);

export default router;