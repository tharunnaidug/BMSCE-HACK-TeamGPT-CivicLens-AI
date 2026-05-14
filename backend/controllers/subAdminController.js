import pool from "../config/db.js";


// ================= GET ACTIVE COMPLAINTS =================

const getActiveComplaints = async (req, res) => {
    try {

        const {
            page = 1,
            limit = 10,
            status,
            severity,
            label,
            search,
        } = req.query;

        const offset =
            (page - 1) * limit;

        let query = `
      SELECT
      complaints.*,
      users.name,
      users.email,
      users.photo_url

      FROM complaints

      LEFT JOIN users
      ON complaints.user_id = users.id

      WHERE complaints.status != 'resolved'

      AND complaints.status != 'rejected'

      AND complaints.is_deleted=FALSE
    `;

        const values = [];

        let index = 1;

        // ================= STATUS FILTER =================

        if (status) {
            query += `
        AND complaints.status=$${index}
      `;

            values.push(status);

            index++;
        }

        // ================= SEVERITY FILTER =================

        if (severity) {
            query += `
        AND complaints.severity=$${index}
      `;

            values.push(severity);

            index++;
        }

        // ================= LABEL FILTER =================

        if (label) {
            query += `
        AND complaints.ai_label=$${index}
      `;

            values.push(label);

            index++;
        }

        // ================= SEARCH =================

        if (search) {
            query += `
        AND (
          complaints.title ILIKE $${index}
          OR
          complaints.description ILIKE $${index}
        )
      `;

            values.push(`%${search}%`);

            index++;
        }

        // ================= PAGINATION =================

        query += `
      ORDER BY complaints.created_at DESC
      LIMIT $${index}
      OFFSET $${index + 1}
    `;

        values.push(limit);

        values.push(offset);

        const complaints =
            await pool.query(query, values);

        res.status(200).json({
            success: true,

            page: Number(page),

            limit: Number(limit),

            total: complaints.rows.length,

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
            complaint_id,
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
            [complaint_id]
        );

        if (complaintData.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found",
            });
        }

        const complaint =
            complaintData.rows[0];

        // ================= UPDATE =================

        const updatedComplaint =
            await pool.query(
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
                    complaint_id,
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
                complaint_id,
                req.user.id,
                complaint.status,
                status,
                remarks,
                resolved_image_url,
            ]
        );

        // ================= CREATE NOTIFICATION =================

        await pool.query(
            `
    INSERT INTO notifications(
      user_id,
      complaint_id,
      title,
      message
    )
  
    VALUES($1,$2,$3,$4)
    `,
            [
                complaint.user_id,
                complaint_id,
                "Complaint Updated",
                `Your complaint is now marked as ${status}`,
            ]
        );

        res.status(200).json({
            success: true,
            message: "Complaint updated",
            complaint:
                updatedComplaint.rows[0],
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