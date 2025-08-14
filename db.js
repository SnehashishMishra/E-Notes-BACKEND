const mongoose = require("mongoose");

const connectToMongo = async () => {
  // Function to connect to MongoDB
  try {
    await mongoose.connect("mongodb://localhost:27017/iNotebook");
    console.log("Connected to Mongo Successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

module.exports = connectToMongo;
