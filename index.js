const connectToMongo = require("./db");

connectToMongo();

const express = require("express");
const app = express();
const port = 5000;

app.use(express.json()); // Middleware to parse JSON bodies

// Available routes
app.use("/api/auth", require("./routes/auth")); // refer auth.js
app.use("/api/notes", require("./routes/notes")); // refer notes.js

app.listen(port, () => {
  console.log(`Example app listening on port ${"http://localhost:" + port}`);
});
