const express = require("express");
const {
  getAsset,
  postAsset,
  patchAsset,
  deleteAsset,
} = require("../controllers/asset");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/", auth, getAsset);

router.post("/", postAsset);

router.patch("/:id", patchAsset);

router.delete("/:id", deleteAsset);

module.exports = router;
