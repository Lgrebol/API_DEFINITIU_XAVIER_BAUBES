const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

function authenticate(req, res, next) {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
}

module.exports = { authenticate };
