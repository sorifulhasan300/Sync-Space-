import express, { Application, Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { StatusCodes } from "http-status-codes";
import { BaseRouter } from "./router/router";
import { globalErrorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import { globalLimiter } from "./middleware/rateLimiter.middleware";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

//rate limiter
app.use(globalLimiter);

//Routes
app.use("/api/v1", BaseRouter);

// Not Found Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(globalErrorHandler);

// Test Route to check Server & DB Status
app.get("/test", async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Server is running and Database connection is verified!",
    timestamp: new Date(),
  });
});

export default app;
