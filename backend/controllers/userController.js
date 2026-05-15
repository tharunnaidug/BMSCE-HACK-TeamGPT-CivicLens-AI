import pool from "../config/db.js";

import {
  genSalt,
  hash,
} from "bcryptjs";


// ================= GET ALL USERS =================

const getAllUsers = async (
  req,
  res
) => {
  try {

    const users = await pool.query(
      `
      SELECT
      id,
      name,
      email,
      photo_url,
      role,
      region,
      points,
      level,
      created_at

      FROM users

      WHERE is_deleted=FALSE

      ORDER BY created_at DESC
      `
    );

    res.status(200).json({
      success: true,
      users: users.rows,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= CREATE SUBADMIN =================

const createSubAdmin = async (
  req,
  res
) => {
  try {

    const {
      name,
      email,
      password,
      region,
      photo_url,
    } = req.body;

    // ================= CHECK EXISTING =================

    const existingUser =
      await pool.query(
        `
        SELECT *
        FROM users
        WHERE email=$1
        `,
        [email]
      );

    if (existingUser.rows.length > 0) {
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

    // ================= CREATE =================

    const newSubAdmin =
      await pool.query(
        `
        INSERT INTO users(
          name,
          email,
          password,
          role,
          region,
          photo_url
        )

        VALUES($1,$2,$3,$4,$5,$6)

        RETURNING
        id,
        name,
        email,
        role,
        region,
        photo_url
        `,
        [
          name,
          email,
          hashedPassword,
          "sub_admin",
          region,
          photo_url,
        ]
      );

    res.status(201).json({
      success: true,
      message:
        "Sub Admin created successfully",

      sub_admin:
        newSubAdmin.rows[0],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= UPDATE SUBADMIN =================

const updateSubAdmin = async (
  req,
  res
) => {
  try {

    const {
      sub_admin_id,
      name,
      region,
      photo_url,
    } = req.body;

    const updatedUser =
      await pool.query(
        `
        UPDATE users

        SET
        name=$1,
        region=$2,
        photo_url=$3

        WHERE id=$4
        AND role='sub_admin'

        RETURNING
        id,
        name,
        email,
        role,
        region,
        photo_url
        `,
        [
          name,
          region,
          photo_url,
          sub_admin_id,
        ]
      );

    if (
      updatedUser.rows.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Sub Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Sub Admin updated successfully",

      sub_admin:
        updatedUser.rows[0],
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
  getAllUsers,
  createSubAdmin,
  updateSubAdmin,
};