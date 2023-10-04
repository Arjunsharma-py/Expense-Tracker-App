const { Manager } = require("../models/Manager");
const { Org } = require("../models/Organisation");
const { emailing } = require("../services/email");
const { generateOTP, checkExp, verifyOTP } = require("../services/otpServices");

exports.sendMngOtp = async (req, res) => {
  emailing(
    req.body.email,
    "Email Verification",
    `<h1>OTP for Email Verification!</h1>
    <p>Dear Customer,</p>
    <p>Thank you for showing interest in opening account on Expense Tracker.</p>
    <p>${generateOTP(
      req.body.email
    )} is the OTP to verify your email address.</p>
    <button>Visit</botton>`
  );
  return res.status(200).json({ message: "OTP has been sent to your email!" });
};

exports.sendOrgOtp = async (req, res) => {
  emailing(
    req.body.email,
    "Email Verification",
    `<h1>OTP for Email Verification!</h1>
    <p>Dear Customer,</p>
    <p>Thank you for showing interest in registering your organisation on Expense Tracker.</p>
    <p>${generateOTP(
      req.body.email
    )} is the OTP to verify your email address.</p>
    <button>Visit</botton>`
  );
  return res.status(200).json({ message: "OTP has been sent to your email!" });
};

exports.verifyMngOtp = async (req, res) => {
  if (!checkExp(req.body.email))
    return res.status(403).json({ error: "OTP Expired!" });
  if (!verifyOTP(req.body.email, req.body.otp))
    return res.status(403).json({ error: "Wrong OTP!" });
  const manager = await Manager.findOneAndUpdate(
    { email: req.body.email },
    { isVerified: true },
    { new: true }
  );
  const token = manager.generateAuthToken();
  res.cookie("x-auth-token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 15 * 24 * 60 * 60,
    sameSite: "lax",
  });
  return res.status(201).json({ results: manager });
};

exports.verifyOrgOtp = async (req, res) => {
  if (!checkExp(req.body.email))
    return res.status(403).json({ error: "OTP expired!" });
  if (!verifyOTP(req.body.email, req.body.otp))
    return res.status(403).json({ error: "Wrong OTP!!" });
  const org = await Org.findOneAndUpdate(
    { email: req.body.email },
    { isVerified: true },
    { new: true }
  );
  const manager = await Manager.findByIdAndUpdate(
    { _id: req.user._id },
    {
      org: {
        _id: org._id,
        name: org.name,
      },
      isAdmin: true,
    },
    { new: true }
  );
  return res
    .status(202)
    .json({ message: "Email verification successful!", testInfo: manager });
};
