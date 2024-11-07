const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path to the users data file
const usersFilePath = path.join(__dirname, '../data/users.json');

// Utility to read the users data from the JSON file
const readUsersData = () => {
  const data = fs.readFileSync(usersFilePath);
  return JSON.parse(data);
};

// Utility to save the users data back to the JSON file
const saveUsersData = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Registration route (user creation)
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Read the existing users
  const users = readUsersData();

  // Check if the user already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists." });
  }

  // Encrypt password before saving (use bcrypt for hashing)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Add the new user
  const newUser = { username, password: hashedPassword, updatedAt: new Date().toISOString() };
  users.push(newUser);

  // Save the updated users list
  saveUsersData(users);

  // Respond with a success message
  res.status(201).json({ message: "User registered successfully" });
});

// Login route (JWT generation)
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Read the users data
  const users = readUsersData();

  // Find the user
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ message: "Invalid username or password." });
  }

  // Compare the hashed password using bcrypt
  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    // Generate a JWT token (ensure your JWT_SECRET is set in .env)
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token in the response
    res.json({ token });
  });
});

module.exports = router;
