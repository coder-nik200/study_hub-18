const express = require("express");
// const getGeminiResponse = require("../controllers/openAiController");
const getGeminiResponse = require("../controllers/geminiController");

const router = express.Router();

// router.post("/chat", getMessage);
router.post("/chat", getGeminiResponse);

module.exports = router;
