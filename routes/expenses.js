const express = require("express");
const {
  getExp,
  postExp,
  patchExp,
  deleteExp,
} = require("../controllers/expense");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/", auth, getExp);

router.post("/", postExp);

router.patch("/:id", patchExp);

router.delete("/:id", deleteExp);

module.exports = router;
