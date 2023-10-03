const bcrypt = require("bcrypt");

const generatePassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

const comparePassword = async (password, userPassword) => {
  const compare = await bcrypt.compare(password, userPassword);
  return compare;
};

module.exports = {
  generatePassword,
  comparePassword,
};
