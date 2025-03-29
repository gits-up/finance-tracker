import React, { useState, useEffect } from "react";
import { auth } from "../firebase"; // Import Firebase Auth
import { signOut, onAuthStateChanged } from "firebase/auth"; // For authentication
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchGeminiResponse } from "../api/gemini";
import { fetchStockData, fetchCryptoData } from "../api/polygon";

const YOUTUBE_API_KEY = "AIzaSyC8TkP3BxYXr_fVGlmjGMFgarJoZLcxFoA"; // Replace with your actual key
const SEARCH_QUERY = "finance investing tips"; // Modify as needed
const MAX_RESULTS = 6;

const Home = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [stockData, setStockData] = useState(null);
  const [cryptoData, setCryptoData] = useState(null);
  const navigate = useNavigate();

  // Fetch user details
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || "User",
          email: currentUser.email,
          photo:
            currentUser.photoURL ||
            "https://as1.ftcdn.net/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg", // Default avatar
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  //Gemini
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = { sender: "user", text: inputMessage };
    setMessages((prev) => [...prev, newMessage]); // Add user message
    setInputMessage("");
    setIsTyping(true); // Show typing indicator

    // Get AI response
    const aiResponse = await fetchGeminiResponse(inputMessage);
    setMessages((prev) => [...prev, { sender: "bot", text: aiResponse }]);
    setIsTyping(false);
  };

  //Polygon
  useEffect(() => {
    const getMarketData = async () => {
      try {
        const stocks = await Promise.all([
          fetchStockData("AAPL"),
          fetchStockData("GOOGL"),
          fetchStockData("MSFT"),
          fetchStockData("TSLA"),
        ]);

        const cryptos = await Promise.all([
          fetchCryptoData("BTCUSD"),
          fetchCryptoData("ETHUSD"),
          fetchCryptoData("SOLUSD"),
        ]);

        // Filter out null/undefined values
        setStockData(stocks.filter((stock) => stock && stock.ticker));
        setCryptoData(cryptos.filter((crypto) => crypto && crypto.ticker));
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    getMarketData();
  }, []);

  // Fetch YouTube Videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${SEARCH_QUERY}&maxResults=${MAX_RESULTS}&key=${YOUTUBE_API_KEY}`
        );
        setVideos(response.data.items);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  // Logout Function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white flex-col md:flex-row relative">
      {/* Profile Button on Mobile */}
      {!showProfile && user && (
        <div className="md:hidden absolute top-4 left-4 z-10">
          <button onClick={() => setShowProfile(true)}>
            <img
              src={user.photo}
              alt="Avatar"
              className="w-12 h-12 rounded-full border-2 border-white"
            />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`w-full md:w-1/4 p-4 border-r border-gray-500 flex flex-col justify-between ${
          showProfile ? "block" : "hidden"
        } md:flex`}
      >
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">FINANCE Buddy.Ai</h1>
            {showProfile && (
              <button
                className="md:hidden bg-gray-700 px-4 py-2 rounded"
                onClick={() => setShowProfile(false)}
              >
                Back
              </button>
            )}
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <img
                src={user?.photo}
                alt="Avatar"
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <p className="font-bold">{user?.name}</p>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>
            </div>
            <p className="mt-2">
              Welcome {user?.name}, I am your personalized financial assistant.
            </p>
            <p>Fill your details to get accurate recommendations.</p>
            <button className="mt-3 bg-gray-700 px-4 py-2 rounded-md w-full">
              Click to add data
            </button>
          </div>
        </div>

        {/* Tools Section */}
        <div className="mt-6">
          <h2 className="mb-2 text-lg font-semibold border-t border-gray-500">
            Tools
          </h2>
          <button className="mt-2 bg-gray-700 px-4 py-2 rounded-md w-full">
            SIP calculator
          </button>
          <button className="mt-2 bg-gray-700 px-4 py-2 rounded-md w-full">
            Interest calculator
          </button>
          <button
            className="mt-2 bg-red-600 px-4 py-2 rounded-md w-full"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Chat Section */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center">Start a conversation...</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <p
                  className={`p-3 rounded-lg max-w-xs ${
                    msg.sender === "user" ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  {msg.text}
                </p>
              </div>
            ))
          )}
          {isTyping && (
            <p className="text-gray-400 text-sm">Finance Buddy is typing...</p>
          )}
        </div>

        {/* Input Bar */}
        <div className="w-full p-4 bg-gray-900 flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 bg-gray-700 p-2 rounded"
          >
            📨
          </button>
        </div>
      </div>

      {/* Suggested Content - Hidden on Mobile */}
      <div className="hidden md:flex w-1/4 p-4 border-l border-gray-500 flex-col justify-between">
        <div className="flex-1 flex flex-col">
          <h2 className="text-lg font-semibold pb-2">Suggested Content</h2>
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex-1 border-t border-gray-500">
              <p className="mt-1">Videos:</p>
              <div className="space-y-4">
                {videos.length > 0 ? (
                  videos.map((video) => (
                    <a
                      key={video.id.videoId}
                      href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded"
                    >
                      <img
                        src={video.snippet.thumbnails.default.url}
                        alt={video.snippet.title}
                        className="w-16 h-10 rounded-md"
                      />
                      <p className="text-sm">{video.snippet.title}</p>
                    </a>
                  ))
                ) : (
                  <p>Loading videos...</p>
                )}
              </div>
            </div>
            <div className="flex-1 border-t border-gray-500">
              <p className="mt-1 mb-2">Market Data:</p>
              {stockData && stockData.length > 0 ? (
                stockData.map((stock, index) =>
                  stock && stock.ticker ? ( // Ensure stock exists
                    <div
                      key={index}
                      className="p-2 bg-gray-800 rounded-md mt-2"
                    >
                      <p className="text-sm">
                        📈 <b>{stock.ticker}:</b> ${stock.c}
                      </p>
                    </div>
                  ) : null
                )
              ) : (
                <p>Loading stock data...</p>
              )}

              {cryptoData && cryptoData.length > 0 ? (
                cryptoData.map((crypto, index) =>
                  crypto && crypto.ticker ? ( // Ensure crypto exists
                    <div
                      key={index}
                      className="p-2 bg-gray-800 rounded-md mt-2"
                    >
                      <p className="text-sm">
                        💰 <b>{crypto.ticker}:</b> ${crypto.c}
                      </p>
                    </div>
                  ) : null
                )
              ) : (
                <p>Loading crypto data...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
