import { Route, Routes } from "react-router-dom";

import Signup from "./Pages/Signup";
import Dashboard from "./Pages/dashboard";
import SendMoney from "./Pages/SendMoney";
import Login from "./Pages/Login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/send" element={<SendMoney />} />
      </Routes>
    </>
  );
}

export default App;
