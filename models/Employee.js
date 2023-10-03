const mongoose = require("mongoose");
const Joi = require("joi");

const validateEmployee = (employee) => {
  const Schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required(),
    type: Joi.string(),
    address: Joi.string(),
    phone: Joi.number(),
  });
  return Schema.validate(employee);
};

const empSchema = new mongoose.Schema({
  name: {
    type: String,
    requied: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    default: "other",
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
    minlength: 10,
    maxlength: 13,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const Emp = mongoose.model("employee", empSchema);

module.exports = {
  validate: validateEmployee,
  Emp: Emp,
};
