const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchUser"); // Middleware to fetch user details

// ROUTE 1: Get all the notes using: GET "/api/notes/fetchallnotes". Login required
// get("/") here is the endpoint for /api/notes/ as it is mounted in index.js
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the request object as fetchuser middleware attaches it in req.user
    const notes = await Note.find({ user: userId }); // Find all notes for the user
    res.json(notes); // Send the notes as a JSON response);
  } catch (error) {
    console.error("Error fetching notes:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Add the note using: POST "/api/notes/addnote". Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      // If there are errors, return a 400 status with the error messages
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user.id; // Get the user ID from the request object as fetchuser middleware attaches it in req.user
      const { title, description, tag } = req.body; // Destructure the request body to get title, description, and tag
      if (!title || !description) {
        return res
          .status(400)
          .json({ error: "Title and description are required" });
      }

      // Create a new note with the user ID and other details
      const note = new Note({
        user: userId, // Attach the user ID to the note
        title: title,
        description: description,
        tag: tag || "General", // Default tag is "General" if not provided
      });

      const savedNote = await note.save(); // Save the note to the database
      res.json(savedNote); // Send the notes as a JSON response);
    } catch (error) {
      console.error("Error adding note:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Update an existing note using: PUT "/api/notes/updatenote/:id". Login required
router.put(
  "/updatenote/:id",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      // If there are errors, return a 400 status with the error messages
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, tag } = req.body; // Destructure the request body to get title, description, and tag
      if (!title || !description) {
        return res
          .status(400)
          .json({ error: "Title and description are required" });
      }

      const newNote = {};
      // Find the note by ID and update it

      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }

      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      } // Check if the note is present in the database

      if (note.user.toString() !== req.user.id) {
        return res.status(401).json({ error: "Not allowed" });
      } // Check if the note belongs to the user making the request

      // Update the note with the new values
      note = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true } // Return the updated note
      );

      const updatedNote = await note.save(); // Save the updated note to the database
      res.json(updatedNote); // Send the updated note as a JSON response
    } catch (error) {
      console.error("Error updating note:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 4: Delete an existing note using: DELETE "/api/notes/deletenote/:id". Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    } // Check if the note is present in the database

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not allowed" });
    } // Check if the note belongs to the user making the request

    note = await Note.findByIdAndDelete(req.params.id); // Delete the note by ID
    res.json({ success: "Note has been deleted", note }); // Send a success message along with the deleted note
  } catch (error) {
    console.error("Error deleting note:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
