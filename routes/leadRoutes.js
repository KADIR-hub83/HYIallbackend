const express = require("express");

const {
  createLead,
} = require("../controller/leadController");

const router = express.Router();

router.post(
  "/va/lead-form",
  createLead
);

module.exports = router;