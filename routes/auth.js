const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchUser"); // Middleware to fetch user details

const JWT_SECRET = "JWT$ecret$ignature"; // Secret key for JWT, should be stored in environment variables

// get("/createuser") here is the endpoint for /api/auth/createuser as it is mounted in index.js
// ROUTE 1: Create a user using: POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // If there are errors, return a 400 status with the error messages
    // ValidationResult is used to check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if a user with the same email already exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }
      // Hash the password before saving the user
      const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
      const secPass = await bcrypt.hash(req.body.password, salt); // Hash the password

      // Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id, // Use user._id or user.id to get the user's unique identifier
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({ authToken }); // Send the JWT token as a response
    } catch (error) {
      console.error("Error creating user:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 2: Authenticate a user using: POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    // If there are errors, return a 400 status with the error messages
    // ValidationResult is used to check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body; // Destructure email and password from the request body
    try {
      // Find the user by email
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      // Compare the provided password with the hashed password in the database
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const payload = {
        user: {
          id: user.id, // Use user._id or user.id to get the user's unique identifier
        },
      };
      const authToken = jwt.sign(payload, JWT_SECRET); // Generate a JWT token
      res.json({ authToken }); // Send the JWT token as a response
    } catch (error) {
      console.error("Error during login:", error.message);
      return res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Get the user detail using: POST "/api/auth/getuser". Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the request object (assumed to be set by authentication middleware)
    const user = await User.findById(userId).select("-password"); // Find the user by ID and exclude the password field
    res.send(user); // Send the user details as a response
  } catch (error) {
    console.error("Error getting user details:", error.message);
    return res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
