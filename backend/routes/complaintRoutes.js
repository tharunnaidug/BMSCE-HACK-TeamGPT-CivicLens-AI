import express from "express";

import protect from "../middleware/authMiddleware.js";

import complaintLimiter from "../middleware/rateLimitMiddleware.js";

import {
  createComplaint,
  getMyComplaints,
  getSingleComplaint,
  getNearbyComplaints,
  getGeoJSONComplaints,
  getComplaintHistory,
} from "../controllers/complaintController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  complaintLimiter,
  createComplaint
);

router.get(
  "/my",
  protect,
  getMyComplaints
);

router.get(
  "/nearby",
  getNearbyComplaints
);

router.get(
  "/geojson",
  getGeoJSONComplaints
);

router.get(
  "/:id",
  protect,
  getSingleComplaint
);
router.get(
  "/:id/history",
  protect,
  getComplaintHistory
);

export default router;