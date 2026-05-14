import express from "express";

import protect from "../middleware/authMiddleware.js";

import isAdmin from "../middleware/adminMiddleware.js";

import {
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint,
} from "../controllers/adminController.js";

const router = express.Router();

router.get(
  "/complaints",
  protect,
  isAdmin,
  getAllComplaints
);

router.post(
  "/complaints/:id/status",
  protect,
  isAdmin,
  updateComplaintStatus
);

router.post(
  "/complaints/:id",
  protect,
  isAdmin,
  deleteComplaint
);

export default router;