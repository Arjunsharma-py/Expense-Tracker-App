const cache = require("node-cache");

const otpCache = new cache({ stdTTL: 15 * 60 });

const generateOTP = (userId) => {
  if (otpCache.has(userId)) otpCache.del(userId);
  const otp = Math.floor(Math.random() * 1000000);
  otpCache.set(userId, otp);
  return otp;
};

const checkExp = (userId) => {
  if (otpCache.has(userId)) return true;
  return false;
};

const verifyOTP = (userId, otp) => {
  const storedotp = otpCache.get(userId);
  if (storedotp === otp) {
    otpCache.del(userId);
    return true;
  } else return false;
};

module.exports = {
  generateOTP,
  checkExp,
  verifyOTP,
};
