const { validate, Manager } = require("../models/Manager");
const { Org } = require("../models/Organisation");
const { emailing } = require("../services/email");
const { generatePassword } = require("../services/encryption");

exports.getManager = async (req, res) => {
  const manager = await Manager.find({ _id: req.user._id });
  const allmanager = await Manager.find({
    "org._id": manager[0].org._id,
  }).select("name _id");
  if (!manager) return res.status(500).json({ error: "No manager found!" });
  return res.json({ results: allmanager });
};

exports.getManagerInfo = async (req, res) => {
  const manager = await Manager.findById({ _id: req.user._id }).select(
    "-_id -password -org._id"
  );
  if (!manager) return res.status(404).json({ error: "Manager not found!" });
  return res.status(200).json({ results: manager });
};

exports.getManagerFromId = async (req, res) => {
  const manager = await Manager.findById({ _id: req.params.id }).select(
    "name email isAdmin _id"
  );
  if (!manager)
    return res.status(404).json({ message: "something went wrong" });
  return res.status(200).json({ results: manager });
};

exports.postManager = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  let name = req.body.firstname;
  if (req.body.lastname) name = name + " " + req.body.lastname;

  const manager = await Manager.create({
    name: name,
    email: req.body.email,
    password: await generatePassword(req.body.password),
    address: req.body.address,
    phone: req.body.phone,
  });

  // Need to use transaction here
  await manager.save();

  return res
    .status(200)
    .json({ message: "You are registered. Verify your email" });
};

exports.addManager = async (req, res) => {
  const admin = await Manager.findById({ _id: req.user._id });
  const org = await Org.findById({ _id: admin.org._id });
  const manager = await Manager.findById({ _id: req.params.id });
  if (!manager || !admin || !org)
    return res.status(404).json({ error: "source not found!" });
  manager.org = {
    _id: org._id,
    name: org.name,
  };
  manager.save();
  org.managers++;
  org.applicants = org.applicants.filter((a) => a._id == manager._id);
  org.save();

  emailing(
    manager.email,
    `Welcome to ${org.name}`,
    `<h1>Thanks for joining</h1><br><p>Dear ${manager.name},</p><p>You are registered in ${org.name} as manager, we welcome you to our organisation. Now you can start working on the app. Thank you</p>
    <p>Regards,</p>
    <p>${admin.name}</p>
    <p>(Admin)</p>`
  );

  return res.status(200).json({ message: "New manager added" });
};

exports.removeManager = async (req, res) => {
  const admin = await Manager.findById({ _id: req.user._id });
  const org = await Org.findById({ _id: admin.org._id });
  const manager = await Manager.findByIdAndUpdate(
    { _id: req.params.id },
    { $unset: { org: "" } },
    { $set: { isAdmin: false } }
  );
  if (!manager || !admin || !org)
    return res.status(404).json({ error: "source not found!" });
  org.managers--;
  org.save();

  emailing(
    manager.email,
    "You are removed",
    `<h1>Removed from ${org.name}</h1><br><p>Dear ${manager.name},</p><p>You are Removed from ${org.name} as manager, Now you can work anymore for this organisation. Thank you</p>
    <p>Regards,</p>
    <p>${admin.name}</p>
    <p>(Admin)</p>`
  );

  return res.status(200).json({ message: "manager removed", results: manager });
};

exports.adminManager = async (req, res) => {
  const manager = await Manager.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { isAdmin: true } },
    { new: true }
  );
  if (!manager) return res.status(404).json({ error: "source not found!" });

  emailing(
    manager.email,
    "You are now a Admin",
    `<h1>You are a admin now</h1><br><p>Dear ${manager.name},</p><p>Now you are a admin in this organisation. Thank you</p>`
  );

  return res.status(200).json({ message: "added as admin", results: manager });
};

exports.removeAdmin = async (req, res) => {
  const manager = await Manager.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { isAdmin: false } },
    { new: true }
  );
  if (!manager) return res.status(404).json({ error: "source not found!" });

  emailing(
    manager.email,
    "You are now a Admin",
    `<h1>You are a admin now</h1><br><p>Dear ${manager.name},</p><p>Now you are a admin in this organisation. Thank you</p>`
  );

  return res.status(200).json({ message: "added as admin", results: manager });
};

exports.patchManager = async (req, res) => {
  const manager = await Manager.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true }
  );
  if (!manager) return res.status.json({ error: "Not updated!" });
  return res.status(200).json({ results: manager });
};

exports.deleteManager = async (req, res) => {
  const manager = await Manager.findByIdAndDelete({ _id: req.params.id });
  if (!manager)
    return res.status(404).json({ error: "Didn't find any manager" });
  if (manager.hasOwnProperty("org")) {
    const org = await Org.findById({ _id: manager.org._id });
    org.managers--;
    await org.save();
  }
  return res.status(200).json({ results: manager });
};
