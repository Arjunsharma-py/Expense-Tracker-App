const { validate, Emp } = require("../models/Employee");
const { emailing } = require("../services/email");

exports.getEmp = async (req, res) => {
  const emp = await Emp.find().select("name email type phone isVerified");
  if (!emp) return res.status(500).json({ error: "No employee found!" });
  return res.json({ results: emp });
};

exports.getEmpId = async (req, res) => {
  const emp = await Emp.find({ _id: req.params.id }).select(
    "name email type phone isVerified"
  );
  if (!emp) return res.status(500).json({ error: "No employee found!" });
  return res.json({ results: emp[0] });
};

exports.getMyInfo = async (req, res) => {
  const emp = await Emp.findById({ _id: req.user.id }).select(
    "name address type email phone isVerified -_id"
  );
  return res.json({ results: emp });
};

//unverified Employee
exports.addEmp = async (req, res) => {
  const emp = await Emp.create(req.body);
  emp.save();
  return res.json({ results: emp });
};

exports.sendEmail = async (req, res) => {
  emailing(
    req.body.email,
    "Email Verification",
    `<h1>Email Verification!</h1>
    <p>Dear Customer,</p>
    <p>Thank you for showing interest in opening account on Expense Tracker.</p>
    <p>Click the link below to verify your email address.</p>
    <a href='http://localhost:3000/api/emp/verifyemail?email=${req.body.email}'>Click Here</a>`
  );
  res.status(200).json({ message: "Mail send successfully." });
};

exports.verifyEmail = async (req, res) => {
  const emp = await Emp.findOneAndUpdate(
    { email: req.query.email },
    { isVerified: true },
    { new: true }
  );
  if (!emp)
    return res.status(404).send("<h1>Something gone wrong try again!</h1>");
  return res
    .status(200)
    .send(
      "<h1>You are now verified<h1><p>Now you can continue to the site.</p>"
    );
};

exports.postEmp = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const emp = await Emp.create(req.body);

  await emp.save();
  return res
    .status(200)
    .json({ message: "Registration successful!", results: emp });
};

exports.patchEmp = async (req, res) => {
  const emp = await Emp.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true }
  );
  if (!emp) return res.status.json({ error: "Not updated!" });
  return res.json({ results: emp });
};

exports.deleteEmp = async (req, res) => {
  const emp = await Emp.findByIdAndDelete({ _id: req.params.id });
  if (!emp) return res.status(404).json({ error: "Didn't find any Emp" });
  return res.json({ results: emp });
};
