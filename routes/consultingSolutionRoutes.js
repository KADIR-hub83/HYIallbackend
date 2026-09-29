const express = require("express");

const {
  getAllConsultingSolutions,
  getConsultingSolutionBySlug,
} = require("../controller/consultingSolutionController");

const router = express.Router();

/**
 * ============================================================
 * CONSULTING / TECHNOLOGY SOLUTION ROUTES
 * ============================================================
 */

/**
 * Navbar / menu routes
 *
 * GET:
 * /api/get-all-consulting-solutions
 */
router.get(
  "/get-all-consulting-solutions",
  getAllConsultingSolutions,
);

/**
 * Individual technology solution page
 *
 * Example:
 * /api/get-consulting-solution-by-slug/web-development
 */
router.get(
  "/get-consulting-solution-by-slug/:slug",
  getConsultingSolutionBySlug,
);

module.exports = router;