const db = require("../config/db");
const bcrypt = require("bcrypt");

// =====================================================
// REGISTER USER
// =====================================================

const register = async (req, res) => {

    try {

        const {
            name,
            email,
            role,
            password
        } = req.body;


        // ---------------------------------------------
        // VALIDATION
        // ---------------------------------------------

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });

        }


        if (password.length < 8) {

            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters."
            });

        }


        // ---------------------------------------------
        // NORMALIZE EMAIL
        // ---------------------------------------------

        const normalizedEmail =
            email.trim().toLowerCase();


        // ---------------------------------------------
        // CHECK EXISTING USER
        // ---------------------------------------------

        const checkSql = `
            SELECT id
            FROM users
            WHERE email = ?
        `;


        db.query(
            checkSql,
            [normalizedEmail],
            async (err, results) => {

                if (err) {

                    console.error(
                        "Register check error:",
                        err
                    );

                    return res.status(500).json({
                        success: false,
                        message: "Database error."
                    });

                }


                if (results.length > 0) {

                    return res.status(409).json({
                        success: false,
                        message: "An account with this email already exists."
                    });

                }


                // ---------------------------------------------
                // PASSWORD HASH
                // ---------------------------------------------

                const hashedPassword =
                    await bcrypt.hash(password, 10);


                // ---------------------------------------------
                // ROLE
                // ---------------------------------------------

                // Normal registration creates USER accounts.
                // Admin accounts should be created separately.

                const userRole = "user";


                // ---------------------------------------------
                // INSERT USER
                // ---------------------------------------------

                const insertSql = `
                    INSERT INTO users
                    (name, email, password, role)
                    VALUES (?, ?, ?, ?)
                `;


                db.query(
                    insertSql,
                    [
                        name.trim(),
                        normalizedEmail,
                        hashedPassword,
                        userRole
                    ],
                    (insertErr, result) => {

                        if (insertErr) {

                            console.error(
                                "Register insert error:",
                                insertErr
                            );

                            return res.status(500).json({
                                success: false,
                                message: "Unable to create account."
                            });

                        }


                        res.status(201).json({

                            success: true,

                            message:
                                "TokenFlow account created successfully.",

                            user: {
                                id: result.insertId,
                                name: name.trim(),
                                email: normalizedEmail,
                                role: userRole
                            }

                        });

                    }
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Registration error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error during registration."
        });

    }

};



// =====================================================
// LOGIN
// =====================================================

const login = (req, res) => {

    const {
        email,
        password
    } = req.body;


    if (!email || !password) {

        return res.status(400).json({
            success: false,
            message: "Email and password are required."
        });

    }


    const normalizedEmail =
        email.trim().toLowerCase();


    const sql = `
        SELECT
            id,
            name,
            email,
            password,
            role
        FROM users
        WHERE email = ?
    `;


    db.query(
        sql,
        [normalizedEmail],
        async (err, results) => {

            if (err) {

                console.error(
                    "Login database error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Database error."
                });

            }


            if (results.length === 0) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password."
                });

            }


            const user = results[0];


            // ---------------------------------------------
            // CHECK PASSWORD
            // ---------------------------------------------

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );


            if (!passwordMatch) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password."
                });

            }


            // ---------------------------------------------
            // CREATE SESSION
            // ---------------------------------------------

            req.session.user = {

                id: user.id,

                name: user.name,

                email: user.email,

                role: user.role

            };


            res.json({

                success: true,

                message: "Login successful.",

                user: req.session.user

            });

        }
    );

};



// =====================================================
// LOGOUT
// =====================================================

const logout = (req, res) => {

    req.session.destroy((err) => {

        if (err) {

            console.error(
                "Logout error:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Unable to logout."
            });

        }


        res.clearCookie("connect.sid");


        res.json({

            success: true,

            message: "Logged out successfully."

        });

    });

};



// =====================================================
// CURRENT USER
// =====================================================

const getCurrentUser = (req, res) => {

    if (!req.session.user) {

        return res.status(401).json({

            success: false,

            message: "Not logged in."

        });

    }


    res.json({

        success: true,

        user: req.session.user

    });

};



module.exports = {

    register,
    login,
    logout,
    getCurrentUser

};