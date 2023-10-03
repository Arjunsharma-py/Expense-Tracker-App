const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const passwordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");
const config = require("config");

const validateManager = (manager) => {
  const complexity = {
    min: 8,
    max: 26,
    upperCase: 1,
    lowerCase: 1,
    symbol: 1,
    numeric: 1,
    requirementCount: 4,
  };
  const Schema = Joi.object({
    firstname: Joi.string().min(3).max(100).required(),
    lastname: Joi.string(),
    email: Joi.string().email().required(),
    password: passwordComplexity(complexity),
    address: Joi.string(),
    phone: Joi.number(),
    orgId: Joi.objectId(),
  });
  return Schema.validate(manager);
};

const managerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
    minlength: 10,
    maxlength: 13,
  },
  org: {
    type: new mongoose.Schema({
      name: String,
    }),
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

managerSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id.toString(), isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const Manager = mongoose.model("manager", managerSchema);

module.exports = {
  validate: validateManager,
  Manager: Manager,
};
