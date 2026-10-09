const express = require("express");
const cors = require("cors");
const session = require("express-session");

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const tokenRoutes = require("./routes/tokenRoutes");

const app = express();
const PORT = 5000;


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors({
    origin: [
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ],
    credentials: true
}));

app.use(express.json());

app.use(
    session({
        secret: "tokenflow-secret-key-2026",
        resave: false,
        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 2
        }
    })
);


// =====================================================
// API ROUTES
// =====================================================

// Authentication routes
app.use("/api/auth", authRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// Token routes
app.use("/api/tokens", tokenRoutes);


// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "TokenFlow Backend is running successfully!"
    });

});


// =====================================================
// DATABASE TEST ROUTE
// =====================================================

app.get("/api/test-db", (req, res) => {

    db.query(
        "SELECT 1 AS result",

        (err, results) => {

            if (err) {

                console.error(
                    "Database query error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Database connection failed",
                    error: err.message
                });

            }


            res.json({

                success: true,

                message:
                    "TokenFlow Database is connected successfully!",

                data: results

            });

        }
    );

});


// =====================================================
// GET ALL SERVICES
// =====================================================

app.get("/api/services", (req, res) => {

    const sql = `
        SELECT
            id,
            service_name,
            prefix,
            estimated_time,
            status
        FROM services
        WHERE status = 'active'
        ORDER BY id
    `;


    db.query(
        sql,

        (err, results) => {

            if (err) {

                console.error(
                    "Error fetching services:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Failed to fetch services",

                    error:
                        err.message

                });

            }


            res.json({

                success: true,

                services: results

            });

        }
    );

});


// =====================================================
// TEST AUTH ROUTE
// =====================================================

app.get("/api/auth/test", (req, res) => {

    res.json({

        success: true,

        message:
            "Authentication API is working!"

    });

});


// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message:
            `Route not found: ${req.method} ${req.originalUrl}`

    });

});


// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {

    console.log("");
    console.log("======================================");
    console.log("   TOKENFLOW BACKEND STARTED");
    console.log("======================================");

    console.log(
        `Server running at: http://localhost:${PORT}`
    );

    console.log(
        `Auth API: http://localhost:${PORT}/api/auth/test`
    );

    console.log(
        `Token API: http://localhost:${PORT}/api/tokens`
    );

    console.log(
        `Admin API: http://localhost:${PORT}/api/admin`
    );

    console.log("======================================");
    console.log("");

});