const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getProfile,
  updateProfile,
  upload,
} = require("../controllers/profileController");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put(
  "/profile",
  authMiddleware,
  upload.single("avatar"),
  updateProfile,
);

module.exports = router;

