import pool from "../config/db.js";


// ================= DASHBOARD STATS =================

const getDashboardStats = async (req, res) => {
  try {

    const totalComplaints = await pool.query(
      `
      SELECT COUNT(*) FROM complaints
      WHERE is_deleted=FALSE
      `
    );

    const pendingComplaints = await pool.query(
      `
      SELECT COUNT(*) FROM complaints
      WHERE status='pending'
      AND is_deleted=FALSE
      `
    );

    const resolvedComplaints = await pool.query(
      `
      SELECT COUNT(*) FROM complaints
      WHERE status='resolved'
      AND is_deleted=FALSE
      `
    );

    const rejectedComplaints = await pool.query(
      `
      SELECT COUNT(*) FROM complaints
      WHERE status='rejected'
      AND is_deleted=FALSE
      `
    );

    const criticalComplaints = await pool.query(
      `
      SELECT COUNT(*) FROM complaints
      WHERE severity='critical'
      AND is_deleted=FALSE
      `
    );

    res.status(200).json({
      success: true,

      stats: {
        total_complaints:
          totalComplaints.rows[0].count,

        pending_complaints:
          pendingComplaints.rows[0].count,

        resolved_complaints:
          resolvedComplaints.rows[0].count,

        rejected_complaints:
          rejectedComplaints.rows[0].count,

        critical_complaints:
          criticalComplaints.rows[0].count,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= ANALYTICS =================

const getAnalytics = async (req, res) => {
  try {

    // ================= BY TYPE =================

    const byType = await pool.query(
      `
      SELECT
      ai_label,
      COUNT(*) as count

      FROM complaints

      WHERE is_deleted=FALSE

      GROUP BY ai_label

      ORDER BY count DESC
      `
    );

    // ================= BY STATUS =================

    const byStatus = await pool.query(
      `
      SELECT
      status,
      COUNT(*) as count

      FROM complaints

      WHERE is_deleted=FALSE

      GROUP BY status
      `
    );

    // ================= BY SEVERITY =================

    const bySeverity = await pool.query(
      `
      SELECT
      severity,
      COUNT(*) as count

      FROM complaints

      WHERE is_deleted=FALSE

      GROUP BY severity
      `
    );

    res.status(200).json({
      success: true,

      analytics: {
        by_type: byType.rows,
        by_status: byStatus.rows,
        by_severity: bySeverity.rows,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= HEATMAP =================

const getHeatmapData = async (req, res) => {
  try {

    const heatmap = await pool.query(
      `
      SELECT
      id,
      latitude,
      longitude,
      severity,
      ai_label,
      complaint_count

      FROM complaints

      WHERE is_deleted=FALSE
      `
    );

    res.status(200).json({
      success: true,
      heatmap: heatmap.rows,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= HOTSPOTS =================

const getHotspots = async (req, res) => {
  try {

    const hotspots = await pool.query(
      `
      SELECT
      ai_label,
      latitude,
      longitude,
      complaint_count

      FROM complaints

      WHERE complaint_count >= 2
      AND is_deleted=FALSE

      ORDER BY complaint_count DESC
      `
    );

    res.status(200).json({
      success: true,
      hotspots: hotspots.rows,
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
  getDashboardStats,
  getAnalytics,
  getHeatmapData,
  getHotspots,
};