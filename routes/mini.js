const express = require("express");
const { getProfit, getExpAsset } = require("../controllers/miniData");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/", auth, getExpAsset);

router.get("/profit", auth, getProfit);

module.exports = router;
