import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Chat from "./Chat";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const YOUTUBE_API_KEY = "AIzaSyC8TkP3BxYXr_fVGlmjGMFgarJoZLcxFoA";
const SEARCH_QUERY = "finance investing tips";
const MAX_RESULTS = 6;

const NEWS_API_KEY = "8eb5d663ed9c47209c3058f06b694a46";
const INDIAN_MARKET_NEWS_QUERY = "indian stock market";

const Home = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [marketNews, setMarketNews] = useState([]);
  const navigate = useNavigate();
  const navigateToUpdateProfile = () => navigate("/update");
  const navigateToSipCal = () => navigate("/sip");
  const navigateToIntCal = () => navigate("/intcal");
  const navigateToLumpSumCal = () => navigate("/lumpsum");
  const navigateToRetirementCal = () => navigate("/retirement");
  const navigateToAssetAllocation = () => navigate("/asset-allocation");
  const navigateToAdvancedGoal = () => navigate("/advanced-goal");
  const navigateToPPFCalculator = () => navigate("/ppf-calculator");
  const navigateToGstCalculator = () => navigate("/gst-calculator");

  // Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser({
            name: userSnap.data().name || currentUser.displayName || "User",
            email: currentUser.email,
            photo:
              userSnap.data().profileImageUrl ||
              currentUser.photoURL ||
              "https://as1.ftcdn.net/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg",
          });
        } else {
          setUser({
            name: currentUser.displayName || "User",
            email: currentUser.email,
            photo:
              currentUser.photoURL ||
              "https://as1.ftcdn.net/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg",
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
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

  // Fetch Indian Market News
  useEffect(() => {
    const fetchMarketNews = async () => {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/everything?q=${INDIAN_MARKET_NEWS_QUERY}&apiKey=${NEWS_API_KEY}&language=en&sortBy=publishedAt&pageSize=6`
        );
        setMarketNews(response.data.articles);
      } catch (error) {
        console.error("Error fetching market news:", error);
      }
    };
    fetchMarketNews();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white flex-col md:flex-row relative">
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
        <div className="flex flex-col h-full justify-between">
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
                Welcome {user?.name}, I am your personalized financial
                assistant.
              </p>
              <p>Fill your details to get accurate recommendations.</p>
              <button
                className="mt-3 bg-gray-700 px-4 py-2 rounded-md w-full"
                onClick={navigateToUpdateProfile}
              >
                Click to update data
              </button>
            </div>
          </div>

          {/* Logout Button at Bottom */}
          <button
            className="mt-4 bg-red-600 px-4 py-2 rounded-md w-full"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="mt-6">
          <h2 className="mb-2 text-lg font-semibold border-t border-gray-500">
            Financial Calculators
          </h2>
          <button
            className="mt-2 bg-gray-700 px-4 py-2 rounded-md w-full"
            onClick={navigateToAdvancedGoal}
          >
            Goal Planner
          </button>
          <button
            className="mt-2 bg-gray-700 px-4 py-2 rounded-md w-full"
            onClick={navigateToSipCal}
          >
            SIP calculator
          </button>
          <button
            className="mt-2 bg-gray-700 px-4 py-2 rounded-md w-full"
            onClick={navigateToIntCal}
          >
            Tax Return calculator
          </button>
          <button
            className="mt-2 bg-gray-700 px-4 py-2 rounded-md w-full"
            onClick={navigateToLumpSumCal}
          >
            Lumpsum Calculator
          </button>
          <button
            className="mt-2 bg-gray-700 px-4 py-2 rounded-md w-full"
            onClick={navigateToRetirementCal}
          >
            Retirement Planner
          </button>
          <button
            className="mt-2 bg-gray-700 px-4 py-2 rounded-md w-full"
            onClick={navigateToAssetAllocation}
          >
            Asset Allocation Calculator
          </button>
          <button
            className="mt-2 bg-gray-700 px-4 py-2 rounded-md w-full"
            onClick={navigateToPPFCalculator}
          >
            PPF Calculator
          </button>
          <button
            className="mt-2 bg-gray-700 px-4 py-2 rounded-md w-full"
            onClick={navigateToGstCalculator} 
          >
            GST Calculator
          </button>
        </div>
      </div>

      {/* Chat Component */}
      <Chat />

      {/* Suggested Content */}
      <div className="hidden md:flex w-1/4 p-4 border-l border-gray-500 flex-col">
        <h2 className="text-lg font-semibold pb-2">Suggested Content</h2>

        {/* Market News Section - 50% Height */}
        <div className="h-1/2 border-t border-gray-500 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent pr-2">
          <p className="mt-1 mb-2">Indian Market News:</p>
          {marketNews.length > 0 ? (
            marketNews.map((article, index) => (
              <a
                key={index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gray-800 p-2 rounded-md mt-2 hover:bg-gray-700"
              >
                <p className="text-sm font-semibold">{article.title}</p>
                <p className="text-xs text-gray-400">
                  {new Date(article.publishedAt).toLocaleString()}
                </p>
              </a>
            ))
          ) : (
            <p>Loading market news...</p>
          )}
        </div>

        {/* Video Section - 50% Height */}
        <div className="h-1/2 border-t border-gray-500 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent pr-2">
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
      </div>
    </div>
  );
};

export default Home;
