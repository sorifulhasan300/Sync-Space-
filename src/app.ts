import express, { Application, Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Test Route to check Server & DB Status
app.get("/test", async (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is running and Database connection is verified!",
    timestamp: new Date(),
  });
});

export default app;
