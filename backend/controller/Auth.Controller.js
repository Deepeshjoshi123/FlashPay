import bcrypt from "bcryptjs";

import User from "../models/User.Schema.js";
import { generateTokenAndSetCookie } from "../utils/GenerateCookies.js";
import Account from "../models/Account.Schema.js";

export const SignUp = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    if (!username || !email || !password || !fullname) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Email must be valid" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      fullname,
      email,
      password: hashPassword,
    });

    const userId = user._id;

    await Account.create({
      userId,
      balance: 1 + Math.random() * 1000,
    });

    await user.save();
    const token = generateTokenAndSetCookie(user._id, res);

    return res.status(201).json({ success: "User Signed Up", token: token });
  } catch (error) {
    console.error("Error in the SignUp Controller", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const LogIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Inputs Missing" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const isPassValid = await bcrypt.compare(password, user.password || "");

    if (!user || !isPassValid) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = generateTokenAndSetCookie(user._id, res);

    return res.status(200).json({ message: "User LoggedIn", token });
  } catch (error) {
    console.error(`Error in the SignIn controller ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const SignOut = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ message: "User Logged Out" });
  } catch (error) {
    console.error(`Error in the SignOut controller ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    console.error(`Error in the getMe controller ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
