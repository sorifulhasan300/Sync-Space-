import app from "./app";
import { env } from "./config/env.config";

// Start the server and listen for connections
app.listen(env.PORT, () => {
  console.log(`Server is running at http://localhost:${env.PORT}`);
});
