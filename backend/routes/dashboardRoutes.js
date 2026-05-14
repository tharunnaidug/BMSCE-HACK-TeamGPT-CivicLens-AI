import express from "express";

import protect from "../middleware/authMiddleware.js";

import isAdmin from "../middleware/adminMiddleware.js";

import {
  getDashboardStats,
  getAnalytics,
  getHeatmapData,
  getHotspots,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get(
  "/stats",
  protect,
  isAdmin,
  getDashboardStats
);

router.get(
  "/analytics",
  protect,
  isAdmin,
  getAnalytics
);

router.get(
  "/heatmap",
  protect,
  isAdmin,
  getHeatmapData
);

router.get(
  "/hotspots",
  protect,
  isAdmin,
  getHotspots
);

export default router;