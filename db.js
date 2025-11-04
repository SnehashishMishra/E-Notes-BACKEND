const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const connectToMongo = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  // Function to connect to MongoDB
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to Mongo Successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

module.exports = connectToMongo;
