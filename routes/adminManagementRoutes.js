const express = require('express');

const verifyToken =
  require('../middleware/tokenMiddleware');

const {
  getUserTypes,
  createUserType,
  getUserTypeById,
  updateUserType,
  deleteUserType,

  getAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,

  getRegions,
} = require(
  '../controller/adminManagementController',
);

const router = express.Router();


// ============================================================
// ROLES / USER TYPES
// ============================================================

router.get(
  '/get-user-types',
  verifyToken,
  getUserTypes,
);

router.post(
  '/create-user-type',
  verifyToken,
  createUserType,
);

router.get(
  '/get-user-type/:userId',
  verifyToken,
  getUserTypeById,
);

router.put(
  '/update-user-type/:userId',
  verifyToken,
  updateUserType,
);

router.delete(
  '/delete-user-type/:userId',
  verifyToken,
  deleteUserType,
);


// ============================================================
// ADMIN / MANAGEMENT USERS
// ============================================================

router.post(
  '/create/role',
  verifyToken,
  createAdmin,
);

router.get(
  '/userTypes',
  verifyToken,
  getAdmins,
);

router.get(
  '/userType/:userId',
  verifyToken,
  getAdminById,
);

router.post(
  '/userType/:userId',
  verifyToken,
  updateAdmin,
);

router.delete(
  '/userType/:userId',
  verifyToken,
  deleteAdmin,
);


// ============================================================
// REGIONS
// ============================================================

router.get(
  '/region',
  verifyToken,
  getRegions,
);


module.exports = router;