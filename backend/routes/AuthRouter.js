import express from "express";

import {
  getMe,
  LogIn,
  SignOut,
  SignUp,
} from "../controller/Auth.Controller.js";
import { protectRoute } from "../middleware/ProtectRout.js";

const AuthRouter = express.Router();

AuthRouter.post("/signup", SignUp);
AuthRouter.post("/login", LogIn);
AuthRouter.delete("/logout", SignOut);
AuthRouter.get("/getme", protectRoute, getMe);

export default AuthRouter;
