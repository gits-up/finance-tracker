import axios from "axios";

const POLYGON_API_KEY = import.meta.env.VITE_POLGON_API_KEY; // Replace with your actual key
const POLYGON_API_URL = "https://api.polygon.io/v2";

export const fetchStockData = async (ticker) => {
  try {
    const response = await axios.get(
      `${POLYGON_API_URL}/aggs/ticker/${ticker}/prev?apiKey=${POLYGON_API_KEY}`
    );
    return response.data.results[0]; // Returns latest stock price data
  } catch (error) {
    console.error("Polygon API Stock Error:", error);
    return null;
  }
};

export const fetchCryptoData = async (pair) => {
  try {
    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/X:${pair}/prev?apiKey=${POLYGON_API_KEY}`
    );
    return response.data.results[0]; // Returns latest crypto price data
  } catch (error) {
    console.error("Polygon API Crypto Error:", error);
    return null;
  }
};
