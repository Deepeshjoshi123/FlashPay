import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import axios from "axios";

const SendMoney = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const username = searchParams.get("username");

  const initialRecipient = id && username ? username : "";
  const [recipient, setRecipient] = useState(initialRecipient);

  const HandleSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/account/transfer",
        {
          amount,
          to: id,
        },
        {
          withCredentials: true,
        }
      );
      alert("Money Transfered");
      setAmount("");
      navigate("/dashboard");
    } catch (error) {
      console.log(`Error in money transfer : ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="font-semibold text-2xl text-blue-500">FlashPay</h1>
          <span className="ml-2 text-yellow-400 text-2xl animate-pulse">
            ⚡
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">{username}</span>
          <button
            onClick={async () => {
              try {
                await axios.delete("http://localhost:3000/api/auth/logout", {
                  withCredentials: true,
                });
                alert("Logged out");
                navigate("/");
              } catch (err) {
                console.error("Logout failed:", err);
              }
            }}
            className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="p-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Send Money
          </h2>

          <div className="bg-white rounded-xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
            <div className="space-y-5">
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Recipient Name or ID"
                readOnly={!!id && !!username}
                className={`w-full px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md focus:outline-none placeholder-gray-400 ${
                  id && username
                    ? "cursor-not-allowed"
                    : "focus:border-blue-400 hover:border-blue-400 hover:scale-[1.02] transition-all duration-200"
                }`}
              />
              <input
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                value={amount}
                type="number"
                placeholder="Amount (₹)"
                className="w-full px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 placeholder-gray-400 transition-all duration-200 hover:border-blue-400 hover:scale-[1.02]"
              />
              <button
                onClick={HandleSubmit}
                type="submit"
                className="w-full bg-blue-400 text-white py-2 rounded-md transition-all duration-200 hover:bg-blue-500 hover:scale-105 flex items-center justify-center"
              >
                Send Money <span className="ml-2 text-yellow-400">⚡</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;
