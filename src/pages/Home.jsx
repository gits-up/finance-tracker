import React, { useState, useEffect } from "react";
import { auth } from "../firebase"; // Import Firebase Auth
import { signOut, onAuthStateChanged } from "firebase/auth"; // For authentication
import { useNavigate } from "react-router-dom";

// import axios from "axios";

// const YOUTUBE_API_KEY = "YOUR_YOUTUBE_API_KEY"; // Replace with your actual key
// const SEARCH_QUERY = "finance investing tips"; // Modify as needed
// const MAX_RESULTS = 6;

const Home = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  // const [videos, setVideos] = useState([]);
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex-1 flex justify-center items-center">
          <p className="text-gray-300">Chat content goes here...</p>
        </div>

        {/* Input Bar */}
        <div className="w-full p-4 bg-gray-900 flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none"
          />
          <button className="ml-2 bg-gray-700 p-2 rounded">📨</button>
        </div>
      </div>

      {/* Suggested Content - Hidden on Mobile */}
      <div className="hidden md:flex w-1/4 p-4 border-l border-gray-500 flex-col justify-between">
        <div className="flex-1 flex flex-col">
          <h2 className="text-lg font-semibold pb-2">Suggested Content</h2>
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex-1 border-t border-gray-500">
              <p className="mt-1">Videos:</p>
            </div>
            {/* <div className="space-y-4">
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
            </div> */}
            <div className="flex-1 border-t border-gray-500">
              <p className="mt-1">Vlogs:</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
