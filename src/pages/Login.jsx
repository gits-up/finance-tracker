import React, { useState } from "react";
import { loginUser, loginWithGoogle } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       console.log("✅ User logged in:", user);
  //       navigate("/home"); // Navigate after login
  //     } else {
  //       console.log("❌ No user detected");
  //     }
  //   });
  
  //   return () => unsubscribe();
  // }, [navigate]);

  const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        await loginUser(email, password);
        navigate("/home"); // Redirect after login
      } catch (err) {
        setError(err.message);
      }
    };
  

    const handleGoogleLogin = async () => {
      try {
        await loginWithGoogle();
        navigate("/home"); // Redirect after login
      } catch (err) {
        setError(err.message);
      }
    };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   // Implement email/password authentication logic here
  //   try {
  //     await signInWithEmailAndPassword(auth, email, password);
  //     navigate("/home");
  //   } catch (error) {
  //     setError("⚠️ Invalid email or password. Please try again.");
  //   }
  // };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative flex flex-col m-6 space-y-8 bg-gray-800 shadow-2xl rounded-2xl md:flex-row md:space-y-0 text-white">
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mb-3 text-4xl font-bold text-gray-100">Welcome to FinAI</span>
          <span className="font-light text-gray-400 mb-8">
            Your AI-powered financial advisor. Please sign in to continue.
          </span>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="py-4">
              <span className="mb-2 text-md text-gray-300">Email</span>
              <input
                type="email"
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="py-4">
              <span className="mb-2 text-md text-gray-300">Password</span>
              <input
                type="password"
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-700 text-white p-2 rounded-lg mb-6 hover:bg-purple-900 transition"
            >
              Sign in
            </button>
          </form>

          <button
            onClick={handleGoogleLogin}
            className="w-full border border-gray-600 text-md p-2 rounded-lg mb-6 flex justify-center items-center bg-gray-700 text-white hover:bg-purple-700 transition"
          >
            <img
              src="https://static.vecteezy.com/system/resources/previews/010/353/285/non_2x/colourful-google-logo-on-white-background-free-vector.jpg"
              alt="Google Logo"
              className="w-6 h-6 mr-2"
            />
            Sign in with Google
          </button>

          <div className="text-center text-gray-400">
            Don't have an account? <span className="font-bold text-purple-500 cursor-pointer" onClick={() => navigate("/")}>Sign up</span>
          </div>
        </div>

        <div className="relative hidden md:block">
          <img
            src="https://plus.unsplash.com/premium_photo-1681487769650-a0c3fbaed85a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmluYW5jZXxlbnwwfHwwfHx8MA%3D%3D"
            alt="Financial AI Visual"
            className="w-[400px] h-full rounded-r-2xl object-cover opacity-80"
          />
          <div className="absolute bottom-10 right-6 p-6 bg-black bg-opacity-50 backdrop-blur-sm rounded drop-shadow-lg">
            <span className="text-white text-xl">
              "Empower your financial future with AI-driven insights."
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
