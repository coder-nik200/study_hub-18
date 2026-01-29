require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Function to generate AI response
const generate = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    console.log("Raw Response:", JSON.stringify(response, null, 2));

    // Correctly extract the text from parts
    const reply = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    return reply || "Sorry, I couldn't generate a response 🤖";
  } catch (err) {
    console.error("Gemini generate error:", err);
    return "Gemini AI error 🤖";
  }
};

module.exports = generate;
