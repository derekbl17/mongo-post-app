const express = require("express");
const router = express.Router();
const { recordAd, getAd,updateAd, deleteAd } = require("../controllers/adController.js");
const { protect } = require("../middleware/authMiddleware.js");
router.route("/").post(protect, recordAd);
router.get("/",getAd)
router.put("/:id",protect,updateAd)
router.delete("/:id",deleteAd)
module.exports = router;
