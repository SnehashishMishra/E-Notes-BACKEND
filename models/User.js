const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("user", UserSchema); // Creates a model named 'user' based on UserSchema
// The model name is used to create the collection in MongoDB, which will be 'users' (pluralized by Mongoose)
// The collection will store user documents with the defined schema
module.exports = User;
