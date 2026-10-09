const db = require("../config/db");

// Generate Token
const generateToken = (req, res) => {

    const { service_id } = req.body;

    if (!service_id) {
        return res.status(400).json({
            success: false,
            message: "Service ID is required."
        });
    }

    const today = new Date();

    const tokenDate = today.toISOString().split("T")[0];

    const tokenTime = today.toTimeString().split(" ")[0];

    // Get service prefix
    const serviceQuery = `
        SELECT prefix
        FROM services
        WHERE id = ?
    `;

    db.query(serviceQuery, [service_id], (err, serviceResult) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Database error."
            });
        }

        if (serviceResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Service not found."
            });
        }

        const prefix = serviceResult[0].prefix;

        // Get today's last token for this service
        const tokenQuery = `
            SELECT token_number
            FROM tokens
            WHERE service_id = ?
            AND token_date = ?
            ORDER BY id DESC
            LIMIT 1
        `;

        db.query(
            tokenQuery,
            [service_id, tokenDate],
            (err, tokenResult) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        success: false,
                        message: "Database error."
                    });
                }

                let nextNumber = 101;

                if (tokenResult.length > 0) {

                    const lastToken = tokenResult[0].token_number;

                    const lastNumber = parseInt(
                        lastToken.replace(prefix, "")
                    );

                    nextNumber = lastNumber + 1;
                }

                const tokenNumber = prefix + nextNumber;

                // Insert token
                const insertQuery = `
                    INSERT INTO tokens
                    (token_number, service_id, token_date, token_time)
                    VALUES (?, ?, ?, ?)
                `;

                db.query(
                    insertQuery,
                    [
                        tokenNumber,
                        service_id,
                        tokenDate,
                        tokenTime
                    ],
                    (err, result) => {

                        if (err) {
                            console.error(err);

                            return res.status(500).json({
                                success: false,
                                message: "Failed to generate token."
                            });
                        }

                        res.status(201).json({
                            success: true,
                            message: "Token generated successfully.",
                            token: {
                                id: result.insertId,
                                token_number: tokenNumber,
                                service_id: service_id,
                                token_date: tokenDate,
                                token_time: tokenTime,
                                status: "waiting"
                            }
                        });
                    }
                );
            }
        );
    });
};


// Get Token History
const getTokenHistory = (req, res) => {

    const query = `
        SELECT
            t.id,
            t.token_number,
            s.service_name,
            DATE_FORMAT(t.token_date, '%d-%m-%Y') AS token_date,
            DATE_FORMAT(t.token_time, '%h:%i %p') AS token_time,
            t.status
        FROM tokens t
        JOIN services s
            ON t.service_id = s.id
        ORDER BY t.id DESC
    `;

    db.query(query, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch token history."
            });
        }

        res.json({
            success: true,
            tokens: results
        });
    });
};


module.exports = {
    generateToken,
    getTokenHistory
};