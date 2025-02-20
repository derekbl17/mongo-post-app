const express = require("express");
const router = express.Router();
const { recordAd, getAd } = require("../controllers/adController.js");
const { protect } = require("../middleware/authMiddleware.js");
router.route("/").post(protect, recordAd);
router.get("/",getAd)
module.exports = router;
