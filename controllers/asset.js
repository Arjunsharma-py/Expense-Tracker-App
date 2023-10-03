const { Manager } = require("../models/Manager");
const { validate, Asset } = require("../models/Asset");
const { Org } = require("../models/Organisation");

exports.getAsset = async (req, res) => {
  const { mng, ordering } = req.query;
  const manager = await Manager.findById({ _id: req.user._id });
  let page = req.query.page || 1;

  let filter = { orgId: manager.org._id };

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

  const asset = await Asset.find(filter)
    .skip((page - 1) * 20)
    .limit(500)
    .sort(ordering);

  if (!asset) return res.status(500).json({ error: "No asset data found!" });

  return res.json({ results: asset });
};

exports.postAsset = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const manager = await Manager.findById({ _id: req.body.mngId });
  const org = await Org.findById({ _id: manager.org._id });

  if (!manager || !org)
    return res.status(404).json({ error: "No manager found with this id." });

  const asset = await Asset.create({
    manager: {
      _id: manager._id,
      isVerified: manager.isVerified,
      name: manager.name,
    },
    orgId: manager.org._id.toString(),
    amount: req.body.amount,
    source: req.body.source,
  });

  // Need to use transaction here
  await asset.save();
  org.assets = org.assets + asset.amount;
  await org.save();

  return res.json({ results: asset });
};

exports.patchAsset = async (req, res) => {
  const manager = await Manager.findById({ _id: req.body.mngId });
  const org = await Org.findById({ _id: manager.org._id });

  if (!manager || !org)
    return res.status(404).json({ error: "No manager found with this id." });

  const asset = await Asset.findById({ _id: req.params.id });

  org.assets -= asset.amount;

  asset.manager = {
    _id: manager._id,
    isVerified: manager.isVerified,
    name: manager.name,
  };
  asset.orgId = manager.org._id.toString();
  asset.amount = req.body.amount;
  if (req.body.source) asset.source = req.body.source;

  org.assets = org.assets + asset.amount;

  await asset.save();
  await org.save();

  if (!asset) return res.status(404).json({ error: "Not updated!" });
  return res.json({ results: asset });
};

exports.deleteAsset = async (req, res) => {
  const asset = await Asset.findByIdAndDelete({ _id: req.params.id });
  const manager = await Manager.findById({ _id: asset.manager._id });
  const org = await Org.findById({ _id: manager.org._id });

  if (!asset || !org)
    return res.status(404).json({ error: "Didn't find any asset" });
  org.assets = org.assets - asset.amount;
  await org.save();
  return res.json({ results: asset });
};
