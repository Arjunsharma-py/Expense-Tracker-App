const { Manager } = require("../models/Manager");
const { comparePassword } = require("../services/encryption");

exports.login = async (req, res) => {
  const manager = await Manager.findOne({ email: req.body.email });
  if (!manager)
    return res
      .status(404)
      .json({ error: "No manager found with the email id" });

  const validPassword = await comparePassword(
    req.body.password,
    manager.password
  );

  if (!validPassword) return res.status(401).json({ error: "Wrong Password!" });

  if (!manager.isVerified)
    return res.status(403).json({ error: "You are not verified" });

  const token = manager.generateAuthToken();
  res.cookie("x-auth-token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "None",
  });

  return res
    .status(200)
    .json({ message: "You are Authenticated!", results: manager });
};

exports.logout = async (req, res) => {
  const manager = await Manager.findById({ _id: req.user._id });
  if (!manager)
    return res
      .status(404)
      .json({ error: "No manager found with the email id" });

  res.clearCookie("x-auth-token");
  res.json({ message: "Logout Successful" });
};
