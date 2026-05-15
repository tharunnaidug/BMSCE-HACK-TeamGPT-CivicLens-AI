import pool from "../config/db.js";
import {
    addPoints,
  } from "../utils/gamification.js";

// ================= GET ALL COMPLAINTS =================

const getAllComplaints = async (req, res) => {
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

      WHERE complaints.is_deleted=FALSE
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


// ================= UPDATE STATUS =================

const updateComplaintStatus = async (req, res) => {
    try {

        const {
            complaint_id,
            status,
            remarks,
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
        updated_at=NOW()

        WHERE id=$3

        RETURNING *
        `,
                [
                    status,
                    remarks,
                    complaint_id,
                ]
            );

            if (status === "verified") {

                await addPoints(
                  complaint.user_id,
                  20
                );
              }

        // ================= HISTORY =================

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
                complaint_id,
                req.user.id,
                complaint.status,
                status,
                remarks,
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
                "Complaint Status Updated",
                `Your complaint status changed from ${complaint.status} to ${status}`,
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


// ================= SOFT DELETE =================

const deleteComplaint = async (req, res) => {
    try {

        const { complaint_id } = req.body;

        await pool.query(
            `
      UPDATE complaints

      SET is_deleted=TRUE

      WHERE id=$1
      `,
            [complaint_id]
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