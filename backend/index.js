import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import UserRouter from "./routes/UserRouter.js";
import AccountRouter from "./routes/AccountRouter.js";
import AuthRouter from "./routes/AuthRouter.js";
import { ConnectDb } from "./db/ConnectDb.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));

app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/account", AccountRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
  ConnectDb();
});
