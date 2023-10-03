const mongoose = require("mongoose");
const Joi = require("joi");

const validateOrganisation = (organisation) => {
  const Schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    type: Joi.string(),
    address: Joi.string(),
  });
  return Schema.validate(organisation);
};

const organisationSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  type: {
    type: String,
    requied: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  address: {
    type: String,
  },
  managers: {
    type: Number,
    default: 1,
  },
  expenses: {
    type: Number,
    default: 0,
  },
  assets: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  // This is temprary
  applicants: {
    type: Array,
    default: [],
  },
});

const organisation = mongoose.model("organisation", organisationSchema);

module.exports = {
  Org: organisation,
  validate: validateOrganisation,
};
