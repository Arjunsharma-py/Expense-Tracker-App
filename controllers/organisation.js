const { Manager } = require("../models/Manager");
const { Org, validate } = require("../models/Organisation");
const { emailing } = require("../services/email");

exports.getOrg = async (req, res) => {
  const org = await Org.find();
  if (!org) return res.json({ message: "No Organisation Yet!" });
  return res.json({ results: org });
};

exports.searchOrg = async (req, res) => {
  const search = req.query.name;
  const data = await Org.find({
    name: { $regex: search, $options: "i" },
  }).select("name type email managers -_id");
  if (!data) return res.status(404).json({ error: "nothing found" });
  return res.status(200).json(data);
};

exports.getMyInfo = async (req, res) => {
  const manager = await Manager.findById({ _id: req.user._id });
  const org = await Org.findById({ _id: manager.org._id });
  return res.status(201).json({ results: org });
};

exports.getOrgById = async (req, res) => {
  const org = await Org.findById({ _id: req.params.id }).select(
    "name type email managers expenses assets -_id"
  );
  if (!org)
    return res
      .status(404)
      .json({ error: "No organisation found with this id" });
  return res.status(200).json({ results: org });
};

exports.postOrg = async (req, res) => {
  const { error } = validate(req.body);
  const manager = await Manager.findById({ _id: req.user._id });
  if (error) return res.status(404).json({ error: error.details[0].message });
  const org = await Org.create(req.body);
  if (org.email === manager.email) {
    org.isVerified = true;
    manager.org = {
      _id: org._id,
      name: org.name,
    };
    manager.isAdmin = true;
    await manager.save();
  }
  await org.save();

  return res.json({
    results: manager,
    message: "You are registered successfully",
  });
};

exports.joinOrg = async (req, res) => {
  const org = await Org.findById({ _id: req.params.id });
  const manager = await Manager.findById({ _id: req.user._id }).select(
    "_id name email"
  );
  const admins = await Manager.find({ isAdmin: true }).select("email -_id");

  if (!org || !manager || !admins)
    return res
      .status(404)
      .json({ error: "No manager or organisation found with this Id." });
  org.applicants.push(manager);
  org.save();

  const emails = [];
  for (let i = 0; i < admins.length; i++) emails.push(admins[i].email);

  if (emails.length) {
    emailing(
      emails,
      "New request for joining",
      `<h1>New joining request</h1> <p>A new request for joining ${
        org.name
      } is raised. The applicant name is ${
        manager.firstname + " " + manager.lastname
      }.</p><p>For more visit</p><button>Check</button>`
    );
  }

  emailing(
    manager.email,
    "Requested for joining",
    `<h1>Request for joining ${org.name}</h1><p>Your request is under Process. Once your application is approved by the admin you will be notified.</p>`
  );

  return res.status(200).json({ message: "Request send" });
};

exports.patchOrg = async (req, res) => {
  const org = await Org.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true }
  );
  if (!org)
    return res
      .status(404)
      .json({ error: "Organisation not found with provided id." });
  return res.status(200).json(org);
};

exports.deleteOrg = async (req, res) => {
  const org = await Org.findByIdAndDelete({ _id: req.params.id });
  if (!org)
    return res
      .status(404)
      .json({ error: "Organisation not found with provided id." });
  return res.status(200).json(org);
};
