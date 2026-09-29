const express = require("express");

const {
  getTotalTalentRegistrations,
  getTalentPublicProfile,
} = require("../controller/talentAdminController");

const router = express.Router();

router.get(
  "/total/talent-registrations",
  getTotalTalentRegistrations
);
router.get(
  "/get-talent-public-profile/:userId",
  getTalentPublicProfile
);

module.exports = router;