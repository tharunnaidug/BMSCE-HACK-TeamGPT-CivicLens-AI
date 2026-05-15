import express from "express";

import authController from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

import {
  validateAuth,
} from "../middleware/validateMiddleware.js";

const router = express.Router();


// ================= REGISTER =================

router.post(
  "/register",
  validateAuth,
  authController.registerUser
);


// ================= LOGIN =================

router.post(
  "/login",
  validateAuth,
  authController.loginUser
);


// ================= ADMIN LOGIN =================

router.post(
  "/admin/login",
  validateAuth,
  authController.adminLogin
);


// ================= GET ME =================

router.get(
  "/me",
  protect,
  authController.getMe
);


// ================= LOGOUT =================

router.post(
  "/logout",
  protect,
  authController.logoutUser
);

export default router;