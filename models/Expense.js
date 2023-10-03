const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const validateExpense = (expense) => {
  const Schema = Joi.object({
    mngId: Joi.objectId().required(),
    empId: Joi.objectId().required(),
    amount: Joi.number().required(),
    purpose: Joi.string().max(255),
  });
  return Schema.validate(expense);
};

const expSchema = new mongoose.Schema({
  manager: {
    type: new mongoose.Schema({
      name: String,
      isVerified: Boolean,
    }),
    required: true,
  },
  emp: {
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
    min: 1,
    required: true,
  },
  purpose: {
    type: String,
    maxlenght: 255,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Exp = mongoose.model("expense", expSchema);

module.exports = {
  validate: validateExpense,
  Exp: Exp,
};
