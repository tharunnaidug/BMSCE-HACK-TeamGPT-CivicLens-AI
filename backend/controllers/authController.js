import pool from "../config/db.js";
import { genSalt, hash, compare } from "bcryptjs";
import generateToken from "../utils/generateToken.js";


// ================= REGISTER =================

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check existing user
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // hash password
    const salt = await genSalt(10);

    const hashedPassword = await hash(password, salt);

    // insert user
    const newUser = await pool.query(
      `
      INSERT INTO users(name,email,password)
      VALUES($1,$2,$3)
      RETURNING id,name,email,role
      `,
      [name, email, hashedPassword]
    );

    const user = newUser.rows[0];

    res.status(201).json({
      success: true,
      user,
      token: generateToken(user.id, user.role),
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

    const { email, password } = req.body;

    const userData = await pool.query(
      `
      SELECT * FROM users
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

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user.id, user.role),
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

    const { email, password } = req.body;

    // STATIC ADMIN
    if (
      email === "admin@civiclens.com" &&
      password === "admin123"
    ) {
      return res.status(200).json({
        success: true,
        admin: {
          id: 0,
          name: "Super Admin",
          email,
          role: "admin",
        },
        token: generateToken(0, "admin"),
      });
    }

    // SUB ADMINS FROM DB
    const subAdminData = await pool.query(
      `
      SELECT * FROM users
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

    res.status(200).json({
      success: true,
      admin: {
        id: subAdmin.id,
        name: subAdmin.name,
        email: subAdmin.email,
        role: subAdmin.role,
      },
      token: generateToken(
        subAdmin.id,
        subAdmin.role
      ),
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
      SELECT id,name,email,role
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


export {
  registerUser,
  loginUser,
  adminLogin,
  getMe,
};