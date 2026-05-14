import express from "express";

import protect from "../middleware/authMiddleware.js";

import isAdmin from "../middleware/adminMiddleware.js";

import {
  getClusters,
  getHeatZones,
  getAreaStats,
} from "../controllers/geoController.js";

const router = express.Router();

router.get(
  "/clusters",
  protect,
  isAdmin,
  getClusters
);

router.get(
  "/heatzones",
  protect,
  isAdmin,
  getHeatZones
);

router.get(
  "/area-stats",
  protect,
  isAdmin,
  getAreaStats
);

export default router;