import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

// 1. Set API Keys
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY ;
const POLYGON_API_KEY = process.env.POLYGON_API_KEY ;

// 2. Define Polygon API Wrapper
const fetchPolygonData = async (endpoint, params = {}) => {
    try {
        const response = await axios.get(`https://api.polygon.io/v2/${endpoint}`, {
            params: { ...params, apiKey: POLYGON_API_KEY },
        });
        return response.data;
    } catch (error) {
        console.error("Polygon API Error:", error.response?.data || error.message);
        return null;
    }
};

// 3. Call Gemini 1.5 Pro API
const callGeminiAPI = async (userInput, agentScratchpad) => {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GOOGLE_API_KEY}`,
            {
                contents: [{ role: "user", parts: [{ text: `User query: ${userInput}\nPrevious steps:\n${agentScratchpad}` }] }],
            }
        );

        return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response available.";
    } catch (error) {
        console.error("Google Gemini API Error:", error.response?.data || error.message);
        return "Error fetching response from LLM.";
    }
};

// 4. Define Financial Agent Logic
const financialAgent = async (query) => {
    let agentScratchpad = "";
    let intermediateSteps = [];

    while (true) {
        const agentResponse = await callGeminiAPI(query, agentScratchpad);
        if (agentResponse.toLowerCase().includes("final answer")) break;

        // Check for stock data requests
        if (agentResponse.includes("ABNB")) {
            const polygonData = await fetchPolygonData(`aggs/ticker/ABNB/range/1/day/2024-03-07/2024-03-14`);
            intermediateSteps.push({ query: agentResponse, response: polygonData });
            agentScratchpad += `\nAgent Action: Fetch stock data\nResult: ${JSON.stringify(polygonData)}`;
        } else {
            break;
        }
    }

    return intermediateSteps.length > 0 ? intermediateSteps[intermediateSteps.length - 1].response : "No data found.";
};

// 5. Run Financial Agent
(async () => {
    const query = "What has been ABNB's daily closing price between March 7, 2024 and March 14, 2024?";
    const result = await financialAgent(query);
    console.log("Final Result:", result);
})();