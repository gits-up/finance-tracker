import axios from "axios";

const GEMINI_API_KEY = "AIzaSyCpdEo2SdkU4Lju5P98oJNb346tmomXY1I"; // Replace with your actual key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

export const fetchGeminiResponse = async (message) => {
  try {
    const response = await axios.post(GEMINI_API_URL, {
      prompt: {
        text: message,
      },
    });

    return response.data.candidates?.[0]?.output || "Sorry, I couldn't process that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while fetching the response.";
  }
};
