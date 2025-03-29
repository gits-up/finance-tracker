import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

// Chat history storage (in-memory for now)
let chatHistory = [];

// Function to fetch AI response
async function getGeminiResponse(userMessage) {
    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: userMessage }] }],
            }
        );

        return response.data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't process that.";
    } catch (error) {
        console.error("Error fetching Gemini API response:", error.message);
        return "An error occurred while processing your request.";
    }
}

// Chat route
router.post("/chat", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    // Save user message
    chatHistory.push({ role: "user", text: message });

    // Simulate typing delay
    setTimeout(async () => {
        const aiResponse = await getGeminiResponse(message);

        // Save AI response
        chatHistory.push({ role: "ai", text: aiResponse });

        // Send updated chat history
        res.json({ chatHistory });
    }, 1000);
});

export default router;
