const express = require("express");

const {
  getAllIndustryTargets,
  getIndustryTargetBySlug,
} = require("../controller/industryTargetController");

const router = express.Router();

/**
 * ============================================================
 * INDUSTRY ROUTES
 * ============================================================
 */

/**
 * Navbar industries
 *
 * GET:
 * /api/get-all-industry-targets
 */
router.get(
  "/get-all-industry-targets",
  getAllIndustryTargets,
);

/**
 * Individual industry page
 *
 * Examples:
 *
 * /api/get-industry-target-by-slug/fintech
 * /api/get-industry-target-by-slug/ecommerce
 * /api/get-industry-target-by-slug/healthcare
 */
router.get(
  "/get-industry-target-by-slug/:slug",
  getIndustryTargetBySlug,
);

module.exports = router;