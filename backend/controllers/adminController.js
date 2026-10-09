const db = require("../config/db");


// =====================================================
// GET ALL USERS
// =====================================================

const getAllUsers = (req, res) => {

    const sql = `
        SELECT
            id,
            name,
            email,
            role,
            created_at
        FROM users
        ORDER BY id DESC
    `;


    db.query(sql, (err, results) => {

        if (err) {

            console.error(
                "Admin users error:",
                err
            );

            return res.status(500).json({

                success: false,

                message: "Unable to fetch users."

            });

        }


        res.json({

            success: true,

            users: results

        });

    });

};



// =====================================================
// GET ALL TOKENS
// =====================================================

const getAllTokens = (req, res) => {

    const sql = `
        SELECT
            t.id,
            t.token_number,
            s.service_name,
            u.name AS user_name,
            u.email AS user_email,
            DATE_FORMAT(t.token_date, '%d-%m-%Y') AS token_date,
            DATE_FORMAT(t.token_time, '%h:%i %p') AS token_time,
            t.status
        FROM tokens t

        INNER JOIN services s
            ON t.service_id = s.id

        LEFT JOIN users u
            ON t.user_id = u.id

        ORDER BY t.id DESC
    `;


    db.query(sql, (err, results) => {

        if (err) {

            console.error(
                "Admin tokens error:",
                err
            );

            return res.status(500).json({

                success: false,

                message: "Unable to fetch tokens."

            });

        }


        res.json({

            success: true,

            tokens: results

        });

    });

};



// =====================================================
// GET ALL SERVICES
// =====================================================

const getAllServices = (req, res) => {

    const sql = `
        SELECT
            id,
            service_name,
            prefix,
            estimated_time,
            status,
            created_at
        FROM services
        ORDER BY id ASC
    `;


    db.query(sql, (err, results) => {

        if (err) {

            console.error(
                "Admin services error:",
                err
            );

            return res.status(500).json({

                success: false,

                message: "Unable to fetch services."

            });

        }


        res.json({

            success: true,

            services: results

        });

    });

};



module.exports = {

    getAllUsers,
    getAllTokens,
    getAllServices

};