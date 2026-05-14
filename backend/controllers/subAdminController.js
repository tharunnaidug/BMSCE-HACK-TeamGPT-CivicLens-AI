import pool from "../config/db.js";


// ================= GET ACTIVE COMPLAINTS =================

const getActiveComplaints = async (req, res) => {
  try {

    const complaints = await pool.query(
      `
      SELECT *
      FROM complaints

      WHERE status != 'resolved'
      AND status != 'rejected'
      AND is_deleted=FALSE

      ORDER BY created_at DESC
      `
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


// ================= UPDATE COMPLAINT =================

const updateComplaint = async (req, res) => {
  try {

    const {
      status,
      remarks,
      resolved_image_url,
    } = req.body;

    const complaintData = await pool.query(
      `
      SELECT *
      FROM complaints
      WHERE id=$1
      `,
      [req.params.id]
    );

    if (complaintData.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    const complaint = complaintData.rows[0];

    // ================= UPDATE =================

    const updatedComplaint = await pool.query(
      `
      UPDATE complaints

      SET
      status=$1,
      admin_response=$2,
      resolved_image_url=$3,
      updated_at=NOW()

      WHERE id=$4

      RETURNING *
      `,
      [
        status,
        remarks,
        resolved_image_url,
        req.params.id,
      ]
    );

    // ================= HISTORY =================

    await pool.query(
      `
      INSERT INTO complaint_updates(
        complaint_id,
        updated_by,
        old_status,
        new_status,
        remarks,
        proof_image
      )

      VALUES($1,$2,$3,$4,$5,$6)
      `,
      [
        req.params.id,
        req.user.id,
        complaint.status,
        status,
        remarks,
        resolved_image_url,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Complaint updated",
      complaint: updatedComplaint.rows[0],
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
  getActiveComplaints,
  updateComplaint,
};