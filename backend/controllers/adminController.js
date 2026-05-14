import pool from "../config/db.js";


// ================= GET ALL COMPLAINTS =================

const getAllComplaints = async (req, res) => {
  try {

    const complaints = await pool.query(
      `
      SELECT
      complaints.*,
      users.name,
      users.email

      FROM complaints

      LEFT JOIN users
      ON complaints.user_id = users.id

      WHERE complaints.is_deleted=FALSE

      ORDER BY complaints.created_at DESC
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


// ================= UPDATE STATUS =================

const updateComplaintStatus = async (req, res) => {
  try {

    const { status, remarks } = req.body;

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

    // ================= UPDATE COMPLAINT =================

    const updatedComplaint = await pool.query(
      `
      UPDATE complaints

      SET
      status=$1,
      admin_response=$2,
      updated_at=NOW()

      WHERE id=$3

      RETURNING *
      `,
      [
        status,
        remarks,
        req.params.id,
      ]
    );

    // ================= HISTORY ENTRY =================

    await pool.query(
      `
      INSERT INTO complaint_updates(
        complaint_id,
        updated_by,
        old_status,
        new_status,
        remarks
      )

      VALUES($1,$2,$3,$4,$5)
      `,
      [
        req.params.id,
        req.user.id,
        complaint.status,
        status,
        remarks,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Complaint status updated",
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

// ================= SOFT DELETE =================

const deleteComplaint = async (req, res) => {
  try {

    await pool.query(
      `
      UPDATE complaints

      SET is_deleted=TRUE

      WHERE id=$1
      `,
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      message: "Complaint deleted",
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
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint,
};