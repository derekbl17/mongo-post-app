const express = require("express");
const router = express.Router();
const { recordAd } = require("../controllers/adController.js");
const { protect } = require("../middleware/authMiddleware.js");
router.route("/").post(protect, recordAd);
module.exports = router;
