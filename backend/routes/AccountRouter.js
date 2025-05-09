import express from "express";

import { protectRoute } from "../middleware/ProtectRout.js";
import {
  userBalance,
  userTransaction,
} from "../controller/Account.Controller.js";

const AccountRouter = express.Router();

AccountRouter.get("/balance", protectRoute, userBalance);
AccountRouter.post("/transfer", protectRoute, userTransaction);

export default AccountRouter;
