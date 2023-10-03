const express = require("express");
const router = express.Router();
const { login, logout } = require("../controllers/auth");
const auth = require("../middlewares/auth");

router.post("/login", login);

router.post("/logout", auth, logout);

module.exports = router;
