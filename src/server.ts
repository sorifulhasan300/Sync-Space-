import express from "express";
import { env } from "./config/env.config";
const app = express();

// Define a simple root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server and listen for connections
app.listen(env.PORT, () => {
  console.log(`Server is running at http://localhost:${env.PORT}`);
});
