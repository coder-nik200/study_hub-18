const generate = require("../ChatBot/Gemini-2.5");

// Express controller
const getGeminiResponse = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.json({ reply: "Please ask something 🙂" });
    }

    const reply = await generate(message);
    res.json({ reply });
  } catch (err) {
    console.error("Controller error:", err);
    res.status(500).json({ reply: "Server error 🤖" });
  }
};

module.exports = getGeminiResponse;
