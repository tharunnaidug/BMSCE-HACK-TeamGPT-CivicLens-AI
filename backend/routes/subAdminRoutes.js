import express from "express";

import protect from "../middleware/authMiddleware.js";

import isSubAdmin from "../middleware/subAdminMiddleware.js";

import {
  getActiveComplaints,
  updateComplaint,
} from "../controllers/subAdminController.js";

const router = express.Router();

router.get(
  "/complaints",
  protect,
  isSubAdmin,
  getActiveComplaints
);

router.post(
  "/complaints/:id/update",
  protect,
  isSubAdmin,
  updateComplaint
);

export default router;