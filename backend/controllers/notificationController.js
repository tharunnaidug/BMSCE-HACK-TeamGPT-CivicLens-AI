import pool from "../config/db.js";


// ================= GET NOTIFICATIONS =================

const getNotifications = async (req, res) => {
  try {

    const notifications = await pool.query(
      `
      SELECT *
      FROM notifications

      WHERE user_id=$1

      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      notifications: notifications.rows,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= MARK AS READ =================

const markNotificationRead = async (req, res) => {
  try {

    const { notification_id } = req.body;

    await pool.query(
      `
      UPDATE notifications

      SET is_read=TRUE

      WHERE id=$1
      `,
      [notification_id]
    );

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
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
  getNotifications,
  markNotificationRead,
};