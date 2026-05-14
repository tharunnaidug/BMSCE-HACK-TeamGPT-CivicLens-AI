import pool from "../config/db.js";


// ================= CLUSTERS =================

const getClusters = async (req, res) => {
  try {

    const clusters = await pool.query(
      `
      SELECT
      ai_label,

      ROUND(latitude::numeric, 3) as lat_group,

      ROUND(longitude::numeric, 3) as lng_group,

      COUNT(*) as total_complaints,

      SUM(complaint_count) as total_reports

      FROM complaints

      WHERE is_deleted=FALSE

      GROUP BY
      ai_label,
      lat_group,
      lng_group

      HAVING COUNT(*) >= 1

      ORDER BY total_reports DESC
      `
    );

    res.status(200).json({
      success: true,
      clusters: clusters.rows,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= HEAT ZONES =================

const getHeatZones = async (req, res) => {
  try {

    const heatzones = await pool.query(
      `
      SELECT
      latitude,
      longitude,
      ai_label,
      severity,
      complaint_count

      FROM complaints

      WHERE is_deleted=FALSE
      `
    );

    res.status(200).json({
      success: true,
      heatzones: heatzones.rows,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= AREA STATS =================

const getAreaStats = async (req, res) => {
  try {

    const stats = await pool.query(
      `
      SELECT

      ROUND(latitude::numeric, 2) as lat_area,

      ROUND(longitude::numeric, 2) as lng_area,

      COUNT(*) as total_complaints,

      SUM(complaint_count) as total_reports

      FROM complaints

      WHERE is_deleted=FALSE

      GROUP BY
      lat_area,
      lng_area

      ORDER BY total_reports DESC

      LIMIT 10
      `
    );

    res.status(200).json({
      success: true,
      areas: stats.rows,
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
  getClusters,
  getHeatZones,
  getAreaStats,
};