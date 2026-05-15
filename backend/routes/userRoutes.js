import express from "express";

import protect from "../middleware/authMiddleware.js";

import isAdmin from "../middleware/adminMiddleware.js";

import {
  getAllUsers,
  createSubAdmin,
  updateSubAdmin,
} from "../controllers/userController.js";

const router = express.Router();

router.get(
  "/",
  protect,
  isAdmin,
  getAllUsers
);

router.post(
  "/subadmin/create",
  protect,
  isAdmin,
  createSubAdmin
);

router.post(
  "/subadmin/update",
  protect,
  isAdmin,
  updateSubAdmin
);

export default router;