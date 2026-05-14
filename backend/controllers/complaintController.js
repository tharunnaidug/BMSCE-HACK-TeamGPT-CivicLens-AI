import pool from "../config/db.js";


// ================= CREATE COMPLAINT =================

const createComplaint = async (req, res) => {
  try {

    const {
      title,
      description,
      ai_label,
      custom_label,
      image_url,
      latitude,
      longitude,
      severity,
    } = req.body;

    // validation
    if (!image_url || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ================= DUPLICATE CHECK =================

    const duplicateCheck = await pool.query(
      `
      SELECT *
      FROM complaints
      WHERE ai_label=$1
      AND ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint($2,$3),4326)::geography,
        15
      )
      AND is_deleted=FALSE
      `,
      [
        ai_label,
        longitude,
        latitude,
      ]
    );

    // ================= IF DUPLICATE =================

    if (duplicateCheck.rows.length > 0) {

      const existingComplaint = duplicateCheck.rows[0];

      await pool.query(
        `
        UPDATE complaints
        SET complaint_count = complaint_count + 1
        WHERE id=$1
        `,
        [existingComplaint.id]
      );

      return res.status(200).json({
        success: true,
        duplicate: true,
        message:
          "Complaint already exists nearby. Complaint count updated.",
        complaint: existingComplaint,
      });
    }

    // ================= CREATE NEW =================

    const newComplaint = await pool.query(
      `
      INSERT INTO complaints(
        user_id,
        title,
        description,
        ai_label,
        custom_label,
        image_url,
        latitude,
        longitude,
        location,
        severity
      )

      VALUES(
        $1,$2,$3,$4,$5,$6,$7,$8,
        ST_SetSRID(ST_MakePoint($8,$7),4326)::geography,
        $9
      )

      RETURNING *
      `,
      [
        req.user.id,
        title,
        description,
        ai_label,
        custom_label,
        image_url,
        latitude,
        longitude,
        severity || "medium",
      ]
    );

    res.status(201).json({
      success: true,
      duplicate: false,
      message: "Complaint created successfully",
      complaint: newComplaint.rows[0],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= GET MY COMPLAINTS =================

const getMyComplaints = async (req, res) => {
  try {

    const complaints = await pool.query(
      `
      SELECT *
      FROM complaints
      WHERE user_id=$1
      AND is_deleted=FALSE
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      complaints: complaints.rows,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= GET SINGLE COMPLAINT =================

const getSingleComplaint = async (req, res) => {
  try {

    const complaint = await pool.query(
      `
      SELECT *
      FROM complaints
      WHERE id=$1
      AND is_deleted=FALSE
      `,
      [req.params.id]
    );

    if (complaint.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      complaint: complaint.rows[0],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= NEARBY COMPLAINTS =================

const getNearbyComplaints = async (req, res) => {
  try {

    const { latitude, longitude, radius } = req.query;

    const complaints = await pool.query(
      `
      SELECT *,
      ST_Distance(
        location,
        ST_SetSRID(ST_MakePoint($1,$2),4326)::geography
      ) AS distance

      FROM complaints

      WHERE ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint($1,$2),4326)::geography,
        $3
      )

      AND is_deleted=FALSE
      `,
      [
        longitude,
        latitude,
        radius || 1000,
      ]
    );

    res.status(200).json({
      success: true,
      complaints: complaints.rows,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= GEOJSON API =================

const getGeoJSONComplaints = async (req, res) => {
  try {

    const complaints = await pool.query(
      `
      SELECT
        id,
        ai_label,
        status,
        severity,
        complaint_count,
        latitude,
        longitude

      FROM complaints

      WHERE is_deleted=FALSE
      `
    );

    const geojson = {
      type: "FeatureCollection",

      features: complaints.rows.map((item) => ({
        type: "Feature",

        geometry: {
          type: "Point",
          coordinates: [
            item.longitude,
            item.latitude,
          ],
        },

        properties: {
          id: item.id,
          ai_label: item.ai_label,
          status: item.status,
          severity: item.severity,
          complaint_count: item.complaint_count,
        },
      })),
    };

    res.status(200).json({
      success: true,
      geojson,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getComplaintHistory = async (req, res) => {
  try {

    const complaintId = req.params.id;

    // ================= CHECK COMPLAINT =================

    const complaintData = await pool.query(
      `
      SELECT *
      FROM complaints
      WHERE id=$1
      AND is_deleted=FALSE
      `,
      [complaintId]
    );

    if (complaintData.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // ================= GET HISTORY =================

    const history = await pool.query(
      `
      SELECT
      complaint_updates.*,
      users.name,
      users.email,
      users.photo_url

      FROM complaint_updates

      LEFT JOIN users
      ON complaint_updates.updated_by = users.id

      WHERE complaint_updates.complaint_id=$1

      ORDER BY complaint_updates.created_at ASC
      `,
      [complaintId]
    );

    res.status(200).json({
      success: true,

      complaint: complaintData.rows[0],

      history: history.rows,
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
  createComplaint,
  getMyComplaints,
  getSingleComplaint,
  getNearbyComplaints,
  getGeoJSONComplaints,
  getComplaintHistory
};