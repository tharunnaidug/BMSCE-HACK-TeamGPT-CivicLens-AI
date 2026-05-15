import pool from "../config/db.js";


// ================= GET USER LEVEL =================

const getUserLevel = (points) => {

  if (points >= 300) {
    return "Civic Hero";
  }

  if (points >= 151) {
    return "Civic Guardian";
  }

  if (points >= 51) {
    return "Civic Reporter";
  }

  return "Beginner";
};


// ================= ADD USER POINTS =================

const addPoints = async (
  userId,
  points
) => {

  // ================= CURRENT USER =================

  const userData = await pool.query(
    `
    SELECT *
    FROM users
    WHERE id=$1
    `,
    [userId]
  );

  if (userData.rows.length === 0) {
    return;
  }

  const user = userData.rows[0];

  const updatedPoints =
    user.points + points;

  const updatedLevel =
    getUserLevel(updatedPoints);

  // ================= UPDATE USER =================

  await pool.query(
    `
    UPDATE users

    SET
    points=$1,
    level=$2

    WHERE id=$3
    `,
    [
      updatedPoints,
      updatedLevel,
      userId,
    ]
  );
};


export {
  addPoints,
  getUserLevel,
};