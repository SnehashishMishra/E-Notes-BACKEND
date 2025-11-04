const connectToMongo = require("./db");
const cors = require("cors");
const dotenv = require("dotenv");

connectToMongo();

const express = require("express");
dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // To allow cross-origin requests

// Available routes
app.use("/api/auth", require("./routes/auth")); // refer auth.js
app.use("/api/notes", require("./routes/notes")); // refer notes.js

app.listen(PORT, () => {
  console.log(`E-Notes backend listening on port http://localhost:${PORT}`);
});
