import pool from "../config/db.js";

import {
  genSalt,
  hash,
  compare,
} from "bcryptjs";

import generateToken from "../utils/generateToken.js";


// ================= COOKIE OPTIONS =================

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};


// ================= REGISTER =================

const registerUser = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      photo_url,
    } = req.body;

    console.log(req.body);

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ================= CHECK EXISTING USER =================

    const existingUser = await pool.query(
      `
      SELECT * FROM users
      WHERE email=$1
      `,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // ================= HASH PASSWORD =================

    const salt = await genSalt(10);

    const hashedPassword = await hash(
      password,
      salt
    );

    // ================= CREATE USER =================

    const newUser = await pool.query(
      `
      INSERT INTO users(
        name,
        email,
        password,
        photo_url
      )

      VALUES($1,$2,$3,$4)

      RETURNING
      id,
      name,
      email,
      photo_url,
      role
      `,
      [
        name,
        email,
        hashedPassword,
        photo_url,
      ]
    );

    const user = newUser.rows[0];

    // ================= GENERATE TOKEN =================

    const token = generateToken(
      user.id,
      user.role
    );

    // ================= SET COOKIE =================

    res.cookie(
      "token",
      token,
      cookieOptions
    );

    res.status(201).json({
      success: true,
      user,
      token,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= LOGIN =================

const loginUser = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;

    const userData = await pool.query(
      `
      SELECT *
      FROM users

      WHERE email=$1
      AND is_deleted=FALSE
      `,
      [email]
    );

    if (userData.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = userData.rows[0];

    const isMatch = await compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ================= GENERATE TOKEN =================

    const token = generateToken(
      user.id,
      user.role
    );

    // ================= SET COOKIE =================

    res.cookie(
      "token",
      token,
      cookieOptions
    );

    res.status(200).json({
      success: true,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        photo_url: user.photo_url,
        role: user.role,
      },

      token,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= ADMIN LOGIN =================

const adminLogin = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;

    // ================= STATIC ADMIN =================

    if (
      email === "admin@civiclens.com" &&
      password === "admin123"
    ) {

      const token = generateToken(
        0,
        "admin"
      );

      res.cookie(
        "token",
        token,
        cookieOptions
      );

      return res.status(200).json({
        success: true,

        admin: {
          id: 0,
          name: "Super Admin",
          email,
          role: "admin",
        },

        token,
      });
    }

    // ================= SUB ADMINS =================

    const subAdminData = await pool.query(
      `
      SELECT *
      FROM users

      WHERE email=$1
      AND role='sub_admin'
      AND is_deleted=FALSE
      `,
      [email]
    );

    if (subAdminData.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const subAdmin = subAdminData.rows[0];

    const isMatch = await compare(
      password,
      subAdmin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ================= GENERATE TOKEN =================

    const token = generateToken(
      subAdmin.id,
      subAdmin.role
    );

    // ================= SET COOKIE =================

    res.cookie(
      "token",
      token,
      cookieOptions
    );

    res.status(200).json({
      success: true,

      admin: {
        id: subAdmin.id,
        name: subAdmin.name,
        email: subAdmin.email,
        photo_url: subAdmin.photo_url,
        role: subAdmin.role,
      },

      token,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= GET ME =================

const getMe = async (req, res) => {
  try {

    const userData = await pool.query(
      `
      SELECT
      id,
      name,
      email,
      photo_url,
      role

      FROM users

      WHERE id=$1
      `,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      user: userData.rows[0],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= LOGOUT =================

const logoutUser = async (req, res) => {
  try {

    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export {
  registerUser,
  loginUser,
  adminLogin,
  getMe,
  logoutUser,
};