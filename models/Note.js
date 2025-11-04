const mongoose = require("mongoose");

const { Schema } = mongoose;

const NotesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // ObjectId type for referencing the User model
    ref: "user", // Reference to the User model
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: { type: String, default: "General" },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Note = mongoose.model("notes", NotesSchema); // Creates a model named 'notes' based on NotesSchema
// The model name is used to create the collection in MongoDB, which will be 'notess' (pluralized by Mongoose)
// The collection will store note documents with the defined schema
module.exports = Note;
