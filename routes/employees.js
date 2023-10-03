const express = require("express");
const {
  getEmp,
  postEmp,
  patchEmp,
  deleteEmp,
  sendEmail,
  verifyEmail,
  addEmp,
  getMyInfo,
  getEmpId,
} = require("../controllers/employee");
const router = express.Router();

router.get("/", getEmp);

router.get("/empId/:id", getEmpId);

router.get("/verifyemail", verifyEmail);

router.get("/me", getMyInfo);

router.post("/add", addEmp);

router.post("/", postEmp);

router.post("/sendemail", sendEmail);

router.patch("/:id", patchEmp);

router.delete("/:id", deleteEmp);

module.exports = router;
