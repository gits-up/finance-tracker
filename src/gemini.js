const API_KEY = "AIzaSyCsth8ttMOudFSqX1WAaNjjaN-ONtMoqNY";

export const sendMessageToGemini = async (message) => {
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: { text: message },
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    return data.candidates?.[0]?.output || "Sorry, I couldn't process that.";
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    return "Error fetching AI response.";
  }
};
