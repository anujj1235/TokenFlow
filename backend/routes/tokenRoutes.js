const express = require("express");

const {
    generateToken,
    getTokenHistory
} = require("../controllers/tokenController");

const router = express.Router();

// Generate new token
router.post("/", generateToken);

// Get token history
router.get("/", getTokenHistory);

module.exports = router;