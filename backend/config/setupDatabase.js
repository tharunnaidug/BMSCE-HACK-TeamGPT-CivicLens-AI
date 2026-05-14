import pool from "./db.js";

import { genSalt, hash } from "bcryptjs";

const setupDatabase = async () => {
  try {

    console.log("Setting up database...");

    // ================= ENABLE POSTGIS =================

    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS postgis;
    `);

    // ================= USERS TABLE =================

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (

        id SERIAL PRIMARY KEY,

        name VARCHAR(100),

        email VARCHAR(100) UNIQUE NOT NULL,

        password TEXT NOT NULL,

        photo_url TEXT,

        role VARCHAR(20) DEFAULT 'user',

        is_deleted BOOLEAN DEFAULT FALSE,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ================= SAFE COLUMN UPDATES =================

    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS photo_url TEXT;
    `);

    // ================= COMPLAINTS TABLE =================

    await pool.query(`
      CREATE TABLE IF NOT EXISTS complaints (

        id SERIAL PRIMARY KEY,

        user_id INTEGER REFERENCES users(id),

        title VARCHAR(255),

        description TEXT,

        ai_label VARCHAR(100),

        custom_label VARCHAR(100),

        image_url TEXT NOT NULL,

        latitude DOUBLE PRECISION NOT NULL,

        longitude DOUBLE PRECISION NOT NULL,

        location GEOGRAPHY(Point,4326),

        status VARCHAR(50) DEFAULT 'pending',

        severity VARCHAR(20) DEFAULT 'medium',

        complaint_count INTEGER DEFAULT 1,

        admin_response TEXT,

        resolved_image_url TEXT,

        assigned_to INTEGER REFERENCES users(id),

        is_duplicate BOOLEAN DEFAULT FALSE,

        is_deleted BOOLEAN DEFAULT FALSE,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ================= COMPLAINT UPDATES =================

    await pool.query(`
      CREATE TABLE IF NOT EXISTS complaint_updates (

        id SERIAL PRIMARY KEY,

        complaint_id INTEGER REFERENCES complaints(id),

        updated_by INTEGER REFERENCES users(id),

        old_status VARCHAR(50),

        new_status VARCHAR(50),

        remarks TEXT,

        proof_image TEXT,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Tables created successfully");


    // ================= CREATE SUB ADMINS =================

    const subAdmins = [
      {
        name: "Sub Admin 1",
        email: "subadmin1@civiclens.com",
        password: "123456",
      },
      {
        name: "Sub Admin 2",
        email: "subadmin2@civiclens.com",
        password: "123456",
      },
    ];

    for (const admin of subAdmins) {

      const existing = await pool.query(
        `
        SELECT * FROM users
        WHERE email=$1
        `,
        [admin.email]
      );

      if (existing.rows.length === 0) {

        const salt = await genSalt(10);

        const hashedPassword = await hash(
          admin.password,
          salt
        );

        await pool.query(
          `
          INSERT INTO users(
            name,
            email,
            password,
            role
          )

          VALUES($1,$2,$3,$4)
          `,
          [
            admin.name,
            admin.email,
            hashedPassword,
            "sub_admin",
          ]
        );

        console.log(
          `${admin.email} created`
        );

      } else {

        console.log(
          `${admin.email} already exists`
        );
      }
    }

    console.log("Database setup completed");

  } catch (error) {

    console.log(error);
  }
};

export default setupDatabase;