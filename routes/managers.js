const express = require("express");
const {
  getManager,
  postManager,
  patchManager,
  deleteManager,
  getManagerInfo,
  addManager,
  removeManager,
  adminManager,
  removeAdmin,
  getManagerFromId,
} = require("../controllers/manager");
const { sendMngOtp, verifyMngOtp } = require("../controllers/otpVerification");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/", auth, getManager);

router.get("/me", auth, getManagerInfo);

router.get("/mngId/:id", auth, getManagerFromId);

router.post("/", postManager);

router.post("/sendotp", sendMngOtp);

router.post("/resendotp", sendMngOtp);

router.post("/verifyotp", verifyMngOtp);

router.post("/addmng/:id", auth, addManager);

router.post("/addadmin/:id", adminManager);

router.post("/removeadmin/:id", removeAdmin);

router.post("/removemng/:id", auth, removeManager);

router.patch("/:id", auth, patchManager);

router.delete("/:id", auth, deleteManager);

module.exports = router;
