const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

const usersFile = path.join(__dirname, "../data/users.json");

async function registerUser(req, res) {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const users = JSON.parse(await fs.readFile(usersFile, "utf-8"));
  users.push({ id: uuidv4(), username, password: hashedPassword });
  await fs.writeFile(usersFile, JSON.stringify(users));
  res.json({ message: "User registered successfully" });
}

async function loginUser(req, res) {
  const { username, password } = req.body;
  const users = JSON.parse(await fs.readFile(usersFile, "utf-8"));
  const user = users.find((u) => u.username === username);
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
}

module.exports = { registerUser, loginUser };
