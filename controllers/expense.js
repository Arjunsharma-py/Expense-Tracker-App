const { Emp } = require("../models/Employee");
const { Manager } = require("../models/Manager");
const { Org } = require("../models/Organisation");
const { validate, Exp } = require("../models/Expense");

exports.getExp = async (req, res) => {
  const { emp, mng, ordering } = req.query;

  const manager = await Manager.findById({ _id: req.user._id });

  let filter = { orgId: manager.org._id };

  let page = req.query.page || 1;

  if (req.query.from) {
    let thisDate = new Date(req.query.from);
    let end;
    let start = new Date(
      thisDate.getFullYear(),
      thisDate.getMonth(),
      thisDate.getDate(),
      0,
      0,
      0
    );
    if (req.query.to) {
      let nextDate = new Date(req.query.to);
      end = new Date(
        nextDate.getFullYear(),
        nextDate.getMonth(),
        nextDate.getDate(),
        23,
        59,
        59
      );
    } else {
      end = new Date(
        thisDate.getFullYear(),
        thisDate.getMonth(),
        thisDate.getDate(),
        23,
        59,
        59
      );
    }
    filter.date = { $gte: start, $lte: end };
  }

  if (mng) filter["manager._id"] = mng;
  if (emp) filter["emp._id"] = emp;

  const exp = await Exp.find(filter)
    .skip((page - 1) * 15)
    .limit(500)
    .sort(ordering);

  if (!exp) return res.status(500).json({ error: "No expense data found!" });

  res.json({ results: exp });
};

exports.postExp = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const emp = await Emp.findById({ _id: req.body.empId });
  const manager = await Manager.findById({ _id: req.body.mngId });
  const org = await Org.findById({ _id: manager.org._id });
  if (!emp || !manager || !org)
    return res
      .status(404)
      .json({ error: "No manager or employee found with this id." });

  const exp = await Exp.create({
    manager: {
      _id: manager._id,
      name: manager.name,
      isVerified: manager.isVerified,
    },
    emp: {
      _id: emp._id,
      name: emp.name,
      isVerified: emp.isVerified,
    },
    orgId: manager.org._id.toString(),
    amount: req.body.amount,
    purpose: req.body.purpose,
  });

  // Need to use transaction here
  await exp.save();
  org.expenses = org.expenses + exp.amount;
  await org.save();

  return res.json({ results: exp });
};

exports.patchExp = async (req, res) => {
  const emp = await Emp.findById({ _id: req.body.empId });
  const manager = await Manager.findById({ _id: req.body.mngId });
  const org = await Org.findById({ _id: manager.org._id });

  if (!emp || !manager || !org)
    return res
      .status(404)
      .json({ error: "No manager or employee found with this id." });

  const exp = await Exp.findById({ _id: req.params.id });

  exp.manager = {
    _id: manager._id,
    name: manager.name,
    isVerified: manager.isVerified,
  };
  exp.emp = {
    id: emp._id,
    name: emp.name,
    isVerified: emp.isVerified,
  };
  exp.orgId = manager.org._id.toString();
  org.expenses = org.expenses - exp.amount;

  exp.amount = req.body.amount;
  if (req.body.purpose) exp.purpose = req.body.purpose;

  org.expenses = org.expenses + exp.amount;

  await exp.save();
  await org.save();

  if (!exp) return res.status(404).json({ error: "Not updated!" });

  return res.json({ results: exp });
};

exports.deleteExp = async (req, res) => {
  const exp = await Exp.findByIdAndDelete({ _id: req.params.id });
  const manager = await Manager.findById({ _id: exp.manager._id });
  const org = await Org.findById({ _id: manager.org._id });
  if (!exp || !org)
    return res.status(404).json({ error: "Didn't find any Exp" });
  org.expenses = org.expenses - exp.amount;
  await org.save();
  return res.status(200).json(exp);
};
