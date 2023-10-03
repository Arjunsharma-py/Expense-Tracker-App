const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.cookies["x-auth-token"];
  if (!token) return res.status(401).json({ error: "Token not provided" });

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid token!" });
  }
};
