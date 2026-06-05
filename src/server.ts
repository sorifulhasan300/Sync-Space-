import express from "express";
const app = express();
const PORT = 3000;

// Define a simple root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server and listen for connections
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
