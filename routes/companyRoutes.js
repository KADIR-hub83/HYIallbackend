// const express = require('express');
// const verifyToken = require('../middleware/tokenMiddleware'); // Import the token verification middleware
// const {
//   addCompany,
//   getCompany,
//   deleteCompany,
//   getAllCompanies,
//   updateCompany,
// } = require('../controller/companyController');
// const { upload } = require('../utils/awsS3');
// const router = express.Router();

// //Add company
// router.post(
//   '/add-company',
//   upload.fields([{ name: 'companyLogo', maxCount: 1 }]),
//   verifyToken,
//   addCompany,
// );

// //get company
// router.get('/get-all-comapies', verifyToken, getAllCompanies);

// //delete Companies
// router.post('/delete-company/:companyId', verifyToken, deleteCompany);

// //get Company by ID
// router.get('/get-company/:companyId', verifyToken, getCompany);

// //Update company
// router.post(
//   '/update-company/:companyId',
//   upload.fields([{ name: 'companyLogo', maxCount: 1 }]),
//   verifyToken,
//   updateCompany,
// );
// module.exports = router;












const express = require('express');

const verifyToken = require('../middleware/tokenMiddleware');

const {
  addCompany,
  getCompany,
  deleteCompany,
  getAllCompanies,
  updateCompany,
  getCompanyDashboardStatus,
  getProjectsByCompany,
} = require('../controller/companyController');

const { upload } = require('../utils/awsS3');

const router = express.Router();

/*
|--------------------------------------------------------------------------
| CREATE / UPDATE COMPANY PROFILE
|--------------------------------------------------------------------------
*/

router.post(
  '/add-company',
  upload.fields([
    {
      name: 'companyLogo',
      maxCount: 1,
    },
  ]),
  verifyToken,
  addCompany,
);

/*
|--------------------------------------------------------------------------
| GET CURRENT COMPANY PROFILE
|--------------------------------------------------------------------------
*/

router.get(
  '/get-company',
  verifyToken,
  getCompany,
);

/*
|--------------------------------------------------------------------------
| DASHBOARD STATUS
|--------------------------------------------------------------------------
*/

router.get(
  '/company-dashboard-status',
  verifyToken,
  getCompanyDashboardStatus,
);

/*
|--------------------------------------------------------------------------
| COMPANY PROJECTS
|--------------------------------------------------------------------------
*/

router.get(
  '/get-projects-by-company',
  verifyToken,
  getProjectsByCompany,
);

/*
|--------------------------------------------------------------------------
| GET ALL COMPANIES
|--------------------------------------------------------------------------
*/

router.get(
  '/get-all-companies',
  verifyToken,
  getAllCompanies,
);

/*
|--------------------------------------------------------------------------
| DELETE COMPANY
|--------------------------------------------------------------------------
*/

router.delete(
  '/delete-company',
  verifyToken,
  deleteCompany,
);

/*
|--------------------------------------------------------------------------
| UPDATE COMPANY
|--------------------------------------------------------------------------
*/

router.post(
  '/update-company/:companyId',
  upload.fields([
    {
      name: 'companyLogo',
      maxCount: 1,
    },
  ]),
  verifyToken,
  updateCompany,
);

module.exports = router;