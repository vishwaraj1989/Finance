
// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User'); // Ensure this is the correct path to your User model

// const router = express.Router();

// router.post("/", async (req, res) => {
//     const { username, password } = req.body;  // Changed from email to username

//     try {
//         // Find the user by username
//         const user = await User.findOne({ username });
//         if (!user) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         // Check if the password matches
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         // Generate a JWT token
//         const token = jwt.sign(
//             { userId: user._id, username: user.username },  // Include username in the token payload
//             process.env.JWT_SECRET,
//             { expiresIn: "1h" }
//         );

//         // Return the token
//         res.json({ token });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// module.exports = router;


const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this is the correct path to your User model

const router = express.Router();

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
