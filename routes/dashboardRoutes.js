const express = require("express");

const router = express.Router();

const {
  getSuperAdminDashboard,
  getSalesDashboard,
  getFinanceDashboard,
  getGrievanceDashboard,
  getOperationsDashboard,
} = require("../controller/dashboardController");

router.get(
  "/dashboard-matrix/super-admin",
  getSuperAdminDashboard
);

router.get(
  "/dashboard-matrix/sales",
  getSalesDashboard
);

router.get(
  "/dashboard-matrix/finance",
  getFinanceDashboard
);

router.get(
  "/dashboard-matrix/grievance",
  getGrievanceDashboard
);

router.get(
  "/dashboard-matrix/operations",
  getOperationsDashboard
);

module.exports = router;