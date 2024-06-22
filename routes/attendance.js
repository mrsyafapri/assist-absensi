const express = require("express");

const {
    markAttendance,
    requestLeave,
    statusLeave,
    generateReport,
} = require("../controllers/attendance");
const auth = require("../middlewares/auth");
const requireAdmin = require('../middlewares/requireAdmin');

const router = express.Router();

router.post("/mark", auth, markAttendance);
router.post("/leave", auth, requestLeave);
router.put("/leave/:id/status", auth, requireAdmin, statusLeave);
router.get("/report", auth, generateReport);

module.exports = router;
