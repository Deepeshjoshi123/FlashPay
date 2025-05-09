import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [Filter, setFilter] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/bulk?filter=" + Filter,
          {
            withCredentials: true,
          }
        );
        setUsers(response.data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [Filter]);

  const handleNavigation = () => {
    navigate("/send");
  };

  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/account/balance",
          {
            withCredentials: true,
          }
        );
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
    };
    fetchBalance();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-50 shadow-lg p-5 flex items-center justify-between">
        <div className="flex items-center transition-all duration-300 hover:scale-105">
          <h1 className="font-bold text-3xl text-blue-500">FlashPay</h1>
          <span className="ml-3 text-yellow-400 text-3xl animate-pulse">
            ⚡
          </span>
        </div>
        <div className="flex items-center space-x-5">
          <span className="text-gray-700 font-medium">
            {user?.Username || "User"}
          </span>
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
            className="text-blue-500 font-medium hover:text-blue-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            Welcome back, {user?.Username || "User"}!
          </h2>
          <p className="text-gray-600 mt-2">Here’s your FlashPay overview.</p>
        </div>

        <div className="grid grid-cols-1  gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent bg-gradient-to-r from-blue-100 to-yellow-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Your Balance
            </h3>
            <p className="text-4xl font-extrabold text-blue-600">
              ₹{user?.Balance?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            All Users
          </h3>
          <div className="mb-4">
            <input
              onChange={(e) => {
                setFilter(e.target.value);
              }}
              type="text"
              placeholder="Search for a user..."
              className="w-full px-4 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 placeholder-gray-400 transition-all duration-200 hover:border-blue-400 hover:scale-[1.02]"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left rounded-lg">
              <thead>
                <tr className="text-gray-600 bg-gray-50">
                  <th className="py-3 px-4 rounded-tl-lg">Username</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Balance</th>
                  <th className="py-3 px-4 rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user.email}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition-colors duration-200`}
                  >
                    <td className="py-3 px-4 text-gray-800">{user.username}</td>
                    <td className="py-3 px-4 text-gray-800">{user.email}</td>
                    <td className="py-3 px-4 text-gray-800">
                      ₹{user.balance?.toFixed(2) || "0.00"}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className="bg-blue-400 text-white px-3 py-1 rounded-lg transition-all duration-200 hover:bg-blue-500 hover:scale-105 hover:shadow-md flex items-center"
                        onClick={(e) => {
                          navigate(
                            `/send?id=${user.id}&username=${user.username}`
                          );
                        }}
                      >
                        <span className="mr-2">💸</span> Send Money
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
