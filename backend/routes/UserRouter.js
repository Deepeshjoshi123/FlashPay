import express from "express";

import { protectRoute } from "../middleware/ProtectRout.js";
import { BulkUsers, UpdateUserProfile } from "../controller/User.Controller.js";

const UserRouter = express.Router();

UserRouter.put("/update", protectRoute, UpdateUserProfile);
UserRouter.get("/bulk", protectRoute, BulkUsers);

export default UserRouter;
