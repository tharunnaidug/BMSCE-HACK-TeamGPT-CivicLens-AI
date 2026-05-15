import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  getLeaderboard,
  getMyGamificationStats,
} from "../controllers/gamificationController.js";

const router = express.Router();

router.get(
  "/leaderboard",
  getLeaderboard
);

router.get(
  "/me",
  protect,
  getMyGamificationStats
);

export default router;