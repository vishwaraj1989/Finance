// server/api/signupRoute.js

const express = require("express");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../models/User");

const router = express.Router();

// POST endpoint for user signup
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username is already taken." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
