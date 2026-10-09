const express = require("express");

const {
    getAllUsers,
    getAllTokens,
    getAllServices
} = require("../controllers/adminController");

const {
    requireAdmin
} = require("../middleware/authMiddleware");


const router = express.Router();


// =====================================================
// ALL ADMIN ROUTES REQUIRE ADMIN LOGIN
// =====================================================


// Get all users
router.get(
    "/users",
    requireAdmin,
    getAllUsers
);


// Get all tokens
router.get(
    "/tokens",
    requireAdmin,
    getAllTokens
);


// Get all services
router.get(
    "/services",
    requireAdmin,
    getAllServices
);


module.exports = router;