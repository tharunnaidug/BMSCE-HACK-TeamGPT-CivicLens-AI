import pool from "../config/db.js";

import {
  genSalt,
  hash,
  compare,
} from "bcryptjs";

import generateToken from "../utils/generateToken.js";


// ================= REGISTER =================

const registerUser = async (
  req,
  res
) => {
  try {

    const {
      name,
      email,
      password,
      photo_url,
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required",
      });
    }

    // ================= CHECK USER =================

    const existingUser =
      await pool.query(
        `
        SELECT *
        FROM users
        WHERE email=$1
        `,
        [email]
      );

    if (
      existingUser.rows.length > 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists",
      });
    }

    // ================= HASH PASSWORD =================

    const salt =
      await genSalt(10);

    const hashedPassword =
      await hash(
        password,
        salt
      );

    // ================= CREATE USER =================

    const newUser =
      await pool.query(
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

    const user =
      newUser.rows[0];

    const token =
      generateToken(
        user.id,
        user.role
      );

    // ================= COOKIE =================

    res.cookie(
      "token",
      token,
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      }
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
      message:
        "Server Error",
    });
  }
};


// ================= LOGIN =================

const loginUser = async (
  req,
  res
) => {
  try {

    const {
      email,
      password,
    } = req.body;

    // ================= FIND USER =================

    const userData =
      await pool.query(
        `
        SELECT *
        FROM users

        WHERE email=$1

        AND is_deleted=FALSE
        `,
        [email]
      );

    if (
      userData.rows.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    const user =
      userData.rows[0];

    // ================= CHECK PASSWORD =================

    const isMatch =
      await compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    const token =
      generateToken(
        user.id,
        user.role
      );

    // ================= COOKIE =================

    res.cookie(
      "token",
      token,
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      }
    );

    res.status(200).json({
      success: true,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        photo_url:
          user.photo_url,
        role: user.role,
        region: user.region,
        points: user.points,
        level: user.level,
      },

      token,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Server Error",
    });
  }
};


// ================= ADMIN LOGIN =================

const adminLogin = async (
  req,
  res
) => {
  try {

    const {
      email,
      password,
    } = req.body;

    // ================= FIND ADMIN =================

    const adminData =
      await pool.query(
        `
        SELECT *
        FROM users

        WHERE email=$1

        AND (
          role='admin'
          OR role='sub_admin'
        )

        AND is_deleted=FALSE
        `,
        [email]
      );

    if (
      adminData.rows.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    const admin =
      adminData.rows[0];

    // ================= CHECK PASSWORD =================

    const isMatch =
      await compare(
        password,
        admin.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    const token =
      generateToken(
        admin.id,
        admin.role
      );

    // ================= COOKIE =================

    res.cookie(
      "token",
      token,
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      }
    );

    res.status(200).json({
      success: true,

      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        photo_url:
          admin.photo_url,
        role: admin.role,
        region:
          admin.region,
      },

      token,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Server Error",
    });
  }
};


// ================= GET ME =================

const getMe = async (
  req,
  res
) => {
  try {

    const userData =
      await pool.query(
        `
        SELECT
        id,
        name,
        email,
        photo_url,
        role,
        region,
        points,
        level

        FROM users

        WHERE id=$1
        `,
        [req.user.id]
      );

    res.status(200).json({
      success: true,
      user:
        userData.rows[0],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Server Error",
    });
  }
};


// ================= LOGOUT =================

const logoutUser = async (
  req,
  res
) => {
  try {

    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message:
        "Logged out successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Server Error",
    });
  }
};


export default {
  registerUser,
  loginUser,
  adminLogin,
  getMe,
  logoutUser,
};