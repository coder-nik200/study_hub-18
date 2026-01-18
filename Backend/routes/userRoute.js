const express = require("express");
const {
  getSignup,
  getLogin,
  logout,
  getMe,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", getSignup);
router.post("/login", getLogin);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);

module.exports = router;
