import jwt from "jsonwebtoken";
import User from "../models/User.Schema.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(404).json({ error: "Token Invalid" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(404).json({ error: "Unauthorized" });
    }

    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(`Error in ProtectedRoute ${error.message}`);
    res.status(500);
  }
};
