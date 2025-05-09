import Account from "../models/Account.Schema.js";
import User from "../models/User.Schema.js";
import bcrypt from "bcryptjs";

export const UpdateUserProfile = async (req, res) => {
  try {
    const { fullname, email, username, currentPassword, newPassword } =
      req.body;
    const userId = req.user._id;

    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      (!currentPassword && !newPassword) ||
      (!currentPassword && newPassword) ||
      (currentPassword && !newPassword)
    ) {
      return res.status(404).json({ error: "All feilds required" });
    }

    if (currentPassword && newPassword) {
      const isMatch = bcrypt.compare(currentPassword, process.env.JWT_SECRET);
      if (!isMatch) {
        return res
          .status(400)
          .json({ error: "Current password is incorrrect" });
      }

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be atleast 6 digits" });
      }

      const Salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, Salt);
      user.password = hashPassword;
    }

    user.email = email || user.email;
    user.username = username || user.username;
    user.fullname = fullname || user.fullname;

    user = await user.save();
    user.password = undefined;
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in UpdateUserProfile:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const BulkUsers = async (req, res) => {
  try {
    const filter = req.query.filter || "";

    const users = await User.find({
      $or: [
        { username: { $regex: filter, $options: "i" } },
        { email: { $regex: filter, $options: "i" } },
      ],
    });

    const usersWithBalance = await Promise.all(
      users.map(async (user) => {
        const account = await Account.findOne({ userId: user._id });
        return {
          id: user._id,
          username: user.username,
          email: user.email,
          balance: account?.balance || 0,
        };
      })
    );

    return res.status(200).json({ users: usersWithBalance });
  } catch (error) {
    console.log("Error in the BulkUsers:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
