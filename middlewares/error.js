module.exports = function (err, req, res, next) {
  // console.log(err.name);
  if (err.name === "MongoServerError" && err.code === 11000)
    return res.status(409).json({ error: "Email already exists" });
  return res.status(500).json({ error: err.message });
};
