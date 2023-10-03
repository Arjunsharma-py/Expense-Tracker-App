module.exports = function (err, req, res, next) {
  console.log(err);
  return res.status(500).json({ error: err.message });
};
