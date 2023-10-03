const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const validateAsset = (asset) => {
  const Schema = Joi.object({
    mngId: Joi.objectId().required(),
    amount: Joi.number().min(1).required(),
    source: Joi.string(),
  });
  return Schema.validate(asset);
};

const assetSchema = new mongoose.Schema({
  manager: {
    type: new mongoose.Schema({
      name: String,
      isVerified: Boolean,
    }),
    required: true,
  },
  orgId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Asset = mongoose.model("asset", assetSchema);

module.exports = {
  validate: validateAsset,
  Asset: Asset,
};
