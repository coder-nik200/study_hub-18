const express = require("express");
const { getMessage } = require("../controllers/chatController");
const router = express.Router();

router.post("/chat", getMessage);

module.exports = router;
