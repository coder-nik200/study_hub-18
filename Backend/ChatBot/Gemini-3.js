// require("dotenv").config();
// const { GoogleGenAI } = require("@google/genai");

// // Initialize client
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// // Function to generate AI response
// const generate = async (prompt) => {
//   try {
//     // For free-tier model, use text-bison-001
//     const response = await ai.models.generateContent({
//       model: "gemini-3-flash-preview",
//       contents: prompt,
//     });

//     // Access the first candidate's text safely
//     const reply = response?.candidates?.[0]?.content?.[0]?.text;

//     if (!reply) return "Sorry, I couldn't generate a response 🤖";

//     return reply;
//   } catch (err) {
//     console.error("Gemini generate error:", err);
//     return "Gemini AI error 🤖";
//   }
// };

// // Express controller
// const getGeminiResponse = async (req, res) => {
//   try {
//     const userMessage = req.body.message;

//     if (!userMessage || userMessage.trim() === "") {
//       return res.json({ reply: "Please ask a question 🙂" });
//     }

//     const reply = await generate(userMessage);

//     res.json({ reply });
//   } catch (err) {
//     console.error("Controller error:", err);
//     res.status(500).json({ reply: "Server error 🤖" });
//   }
// };

// module.exports = getGeminiResponse;
