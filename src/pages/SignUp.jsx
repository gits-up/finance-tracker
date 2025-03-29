import React, { useState } from "react";
import { registerUser, loginWithGoogle } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
// import { auth, googleProvider, signInWithPopup } from "../firebase";

const Signup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await registerUser(email, password, fullName); // Pass full name too
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await loginWithGoogle(); // Google sign-in
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="relative flex flex-col md:flex-row bg-gray-800 shadow-2xl rounded-2xl w-full max-w-4xl overflow-hidden">
        {/* Form Section */}
        <div className="flex flex-col justify-center p-8 md:p-14 w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-white">Welcome to FinAI</h2>
          <p className="text-gray-400 mb-6">
            Your AI-powered financial advisor. Please sign up to continue.
          </p>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSignUp}>
            <div className="mb-4">
              <label className="block text-gray-300">Full Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300">Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300">Confirm Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-700 text-white p-2 rounded-lg hover:bg-purple-900 transition"
            >
              Sign Up
            </button>
          </form>

          {/* Google Signup Button */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center border border-gray-600 text-md p-2 rounded-lg bg-gray-700 text-white hover:bg-purple-700 transition"
            >
              <img
                src="https://static.vecteezy.com/system/resources/previews/010/353/285/non_2x/colourful-google-logo-on-white-background-free-vector.jpg"
                alt="Google Logo"
                className="w-5 h-5 mr-2"
              />
              Sign up with Google
            </button>
          </div>

          <p className="text-gray-400 text-center mt-4">
            Already have an account?{" "}
            <span
              className="text-purple-500 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Log in
            </span>
          </p>
        </div>

        {/* Image Section (Hidden on Mobile) */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src="https://www.shutterstock.com/shutterstock/videos/1085850863/thumb/1.jpg?ip=x480"
            alt="Financial AI Visual"
            className="w-full h-full object-cover rounded-r-2xl"
          />
          <div className="absolute bottom-6 right-6 p-4 bg-black bg-opacity-50 backdrop-blur-sm rounded">
            <span className="text-white text-lg">
              "Empower your financial future with AI-driven insights."
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
