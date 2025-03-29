import React, { useState } from "react";

const Home = () => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-white flex-col md:flex-row relative">
      {/* Profile Button on Mobile */}
      {!showProfile && (
        <div className="md:hidden absolute top-4 left-4 z-10">
          <button onClick={() => setShowProfile(true)}>
            <img
              src="https://as1.ftcdn.net/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"
              alt="Avatar"
              className="w-12 h-12 rounded-full border-2 border-white"
            />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`w-full md:w-1/4 p-4 border-r border-gray-500 flex flex-col justify-between ${showProfile ? "block" : "hidden"} md:flex`}
      >
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">FINANCEbuddy.Ai</h1>
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
                src="https://as1.ftcdn.net/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"
                alt="Avatar"
                className="w-12 h-12 rounded-full mr-3"
              />
            </div>
            <p className="mt-2">Welcome Ramesh, I am your personalized financial assistant.</p>
            <p>Fill your details to get accurate recommendations.</p>
            <button className="mt-3 bg-gray-700 px-4 py-2 rounded-md w-2/3">Click to add data</button>
          </div>
        </div>

        {/* Tools Section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold border-t border-gray-500">Tools</h2>
          <button className="mt-2 bg-gray-700 px-4 py-2 rounded-md w-2/3">SIP calculator</button>
          <button className="mt-2 bg-gray-700 px-4 py-2 rounded-md w-2/3">Interest calculator</button>
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