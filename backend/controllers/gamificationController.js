import pool from "../config/db.js";


// ================= LEADERBOARD =================

const getLeaderboard = async (
  req,
  res
) => {
  try {

    const leaderboard =
      await pool.query(
        `
        SELECT
        id,
        name,
        photo_url,
        points,
        level

        FROM users

        WHERE role='user'

        ORDER BY points DESC

        LIMIT 10
        `
      );

    res.status(200).json({
      success: true,
      leaderboard:
        leaderboard.rows,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= MY STATS =================

const getMyGamificationStats =
  async (req, res) => {
    try {

      const userData =
        await pool.query(
          `
          SELECT
          id,
          name,
          photo_url,
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
        message: "Server Error",
      });
    }
  };


export {
  getLeaderboard,
  getMyGamificationStats,
};