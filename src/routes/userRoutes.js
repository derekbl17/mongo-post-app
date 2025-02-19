const express = require("express");
const router = express.Router();
const { registerUser, loginUser,verifyUser,logoutUser,getUsers,deleteUser,toggleBlockUser } = require("../controllers/userController.js");
router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/verify",verifyUser)
router.post("/logout",logoutUser)
router.get("/",getUsers)
router.delete("/:id", deleteUser);
router.put("/:id/toggle-block", toggleBlockUser);
module.exports = router;
