import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          username: Username,
          password: Password,
        },
        {
          withCredentials: true,
        }
      );

      setUsername("");
      setPassword("");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error in LogIn : ", error.message);
    }
  };

  return (
    <div className="h-screen bg-gray-100 w-full flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center justify-center mb-4">
          <h3 className="font-semibold text-2xl text-blue-500">
            FlashPay LogIn
          </h3>
          <span className="ml-2 text-yellow-400 text-2xl animate-pulse">
            ⚡
          </span>
        </div>
        <p className="text-gray-600 text-center mb-6">LogIn to your account</p>
        <div className="space-y-5">
          <input
            value={Username}
            type="text"
            placeholder="Username"
            className="w-full px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 placeholder-gray-400 transition-all duration-200 hover:border-blue-400 hover:scale-[1.02]"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            value={Password}
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 placeholder-gray-400 transition-all duration-200 hover:border-blue-400 hover:scale-[1.02]"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            type="submit"
            className="w-full bg-blue-400 text-white py-2 rounded-md transition-all duration-200 hover:bg-blue-500 hover:scale-105 flex items-center justify-center"
            onClick={handleLogin}
          >
            Log In <span className="ml-2 text-yellow-400">⚡</span>
          </button>
        </div>
        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
