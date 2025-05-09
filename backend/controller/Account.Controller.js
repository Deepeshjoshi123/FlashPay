import mongoose from "mongoose";
import Account from "../models/Account.Schema.js";

export const userBalance = async (req, res) => {
  try {
    const account = await Account.findOne({
      userId: req.user._id,
    });

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    return res
      .status(200)
      .json({ Balance: account.balance, Username: req.user.username });
  } catch (error) {
    console.log(`Error in the userBalance Controller ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const userTransaction = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const { amount, to } = req.body;

    const account = await Account.findOne({ userId: req.user._id }).session(
      session
    );

    if (!account || account.balance < amount) {
      session.abortTransaction();
      return res
        .status(404)
        .json({ error: "Insuffecient Balance or Account Invalid" });
    }

    const AccountTo = await Account.findOne({ userId: to }).session(session);

    if (!AccountTo) {
      session.abortTransaction();
      return res.status(404).json({ error: "Account Invalid" });
    }

    await Account.findOneAndUpdate(
      { userId: req.user._id },
      { $inc: { balance: -amount } }
    ).session(session);
    await Account.findOneAndUpdate(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    session.commitTransaction();

    return res.status(200).json({ message: "Transfer Successful" });
  } catch (error) {
    console.log(`Error in the userTransaction Controller : ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};
