const express = require("express");
const {
  getOrg,
  postOrg,
  patchOrg,
  deleteOrg,
  getMyInfo,
  joinOrg,
  getOrgById,
  searchOrg,
} = require("../controllers/organisation");
const { sendOrgOtp, verifyOrgOtp } = require("../controllers/otpVerification");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/", getOrg);

router.get("/me", auth, getMyInfo);

router.get("/orgId/:id", getOrgById);

router.get("/search", searchOrg);

router.post("/", auth, postOrg);

router.post("/sendOtp", sendOrgOtp);

router.post("/resendOtp", sendOrgOtp);

router.post("/verifyotp", auth, verifyOrgOtp);

router.post("/join/:id", auth, joinOrg);

router.patch("/:id", auth, patchOrg);

router.delete("/:id", auth, deleteOrg);

module.exports = router;
