// const express = require('express');
// const verifyToken = require('../middleware/tokenMiddleware'); // Import the token verification middleware
// const {
//   home,
//   addUser,
//   getUsers,
//   getUserById,
//   deleteUser,
//   updateUser,
//   filterUsers,
// } = require('../controller/jobseekerController');
// const { upload } = require('../utils/awsS3');
// const router = express.Router();
// const { UserBase } = require('../models/authModel');
// const { Jobseeker } = require('../models/jobseekerModel');

// // Home API route (token in Authorization header)
// router.get('/home', verifyToken, home);


// // Add user details (with support for multiple files)
// router.post(
//   '/add-user',
//   upload.fields([
//     { name: 'profilePicture', maxCount: 1 },
//     { name: 'resume', maxCount: 1 },
//     { name: 'uploadCertificate', maxCount: 1 },
//   ]),
//   verifyToken,
//   addUser,
// );
// router.post(
//   '/add-talent',
//   upload.fields([
//     { name: 'profilePicture', maxCount: 1 },
//     { name: 'resume', maxCount: 1 },
//     { name: 'uploadCertificate', maxCount: 1 },
//   ]),
//   verifyToken,
//   addUser,
// );

// router.get('/get-user-data', verifyToken, async (req, res) => {
//   try {
//     const userId = req.user?._id;

//     if (!userId) {
//       return res.status(401).json({
//         message: 'User ID not found in token',
//       });
//     }

//     // Signup/account data
//     const authUser = await UserBase.findById(userId)
//       .select('-password')
//       .lean();

//     if (!authUser) {
//       return res.status(404).json({
//         message: 'Account not found',
//       });
//     }

//     // Talent profile data
//     const profile = await Jobseeker.findOne({
//       user: userId,
//     }).lean();

//     // ============================================
//     // NEW TALENT - Jobseeker profile not created
//     // ============================================
//     if (!profile) {
//       return res.status(200).json({
//         _id: authUser._id,

//         // Signup data
//         firstName: authUser.firstName || '',
//         middleName: authUser.middleName || '',
//         lastName: authUser.lastName || '',

//         email: authUser.email || '',
//         userType: authUser.userType,

//         profileExists: false,
//         onboardingCompleted: false,
//       });
//     }

//     // ============================================
//     // EXISTING TALENT
//     // ============================================
//     return res.status(200).json({
//       _id: authUser._id,

//       email: authUser.email || profile.email || '',
//       userType: authUser.userType,

//       profileExists: true,

//       onboardingCompleted:
//         profile.talentOnboadCompleted ??
//         profile.onboardingCompleted ??
//         false,

//       // Prefer Jobseeker data after onboarding starts,
//       // fallback to signup/account data.
//       firstName:
//         profile.firstName ||
//         authUser.firstName ||
//         '',

//       middleName:
//         profile.middleName ||
//         authUser.middleName ||
//         '',

//       lastName:
//         profile.lastName ||
//         authUser.lastName ||
//         '',

//       fullName:
//         profile.fullName ||
//         [
//           profile.firstName || authUser.firstName,
//           profile.middleName || authUser.middleName,
//           profile.lastName || authUser.lastName,
//         ]
//           .filter(Boolean)
//           .join(' '),

//       summary:
//         profile.profileSummary ||
//         profile.summary ||
//         '',

//       location: profile.location || '',
//       profilePicture: profile.profilePicture || null,
//       resume: profile.resume || null,

//       technicalSkills: profile.technicalSkills || [],
//       otherSkills: profile.otherSkills || [],
//       experience: profile.experience || [],
//       projects: profile.projects || [],
//       education: profile.education || [],

//       typeOfJob: profile.typeOfJob || '',
//       github: profile.github || '',
//       linkedin: profile.linkedin || '',
//       portfolio: profile.portfolio || '',
//       phoneNumber: profile.phoneNumber || '',

//       gender: profile.gender || '',
//       dateOfBirth: profile.dateOfBirth || '',
//       country: profile.country || '',
//       city: profile.city || '',
//     });
//   } catch (error) {
//     console.error('GET USER DATA ERROR:', error);

//     return res.status(500).json({
//       message: 'Failed to get user data',
//       error: error.message,
//     });
//   }
// });
 
// router.get('/get-talent', verifyToken, async (req, res) => {
//   try {
//     const userId = req.user?._id;

//     if (!userId) {
//       return res.status(401).json({
//         message: 'User ID not found in token',
//       });
//     }

//     const talent = await Jobseeker.findOne({
//       user: userId,
//     });

//     if (!talent) {
//       return res.status(404).json({
//         message: 'Talent profile not found',
//       });
//     }

//     return res.status(200).json({
//       userData: talent,
//     });
//   } catch (error) {
//     console.error('GET TALENT ERROR:', error);

//     return res.status(500).json({
//       message: 'Failed to get talent data',
//       error: error.message,
//     });
//   }
// });

// router.get('/talent-dashboard-overview', verifyToken, async (req, res) => {
//   try {
//     const userId = req.user?._id;

//     if (!userId) {
//       return res.status(401).json({
//         message: 'User ID not found in token',
//       });
//     }

//     const talent = await Jobseeker.findOne({
//       user: userId,
//     });

//     if (!talent) {
//       return res.status(404).json({
//         message: 'Talent profile not found',
//       });
//     }

//     return res.status(200).json({
//       data: {
//         profile: talent,

//         stats: {
//           projects:
//             Array.isArray(talent.projects)
//               ? talent.projects.length
//               : 0,

//           experience:
//             Array.isArray(talent.experience)
//               ? talent.experience.length
//               : 0,

//           technicalSkills:
//             Array.isArray(talent.technicalSkills)
//               ? talent.technicalSkills.length
//               : 0,

//           education:
//             Array.isArray(talent.education)
//               ? talent.education.length
//               : 0,
//         },

//         ongoingProjects: [],
//       },
//     });
//   } catch (error) {
//     console.error('TALENT DASHBOARD ERROR:', error);

//     return res.status(500).json({
//       message: 'Failed to load talent dashboard',
//       error: error.message,
//     });
//   }
// });

// //get all users
// router.get('/get-users', verifyToken, getUsers);

// //get user by ID
// router.get('/get-user/:userId', verifyToken, getUserById);

// //deleteUser By ID
// router.post('/delete-user/:userId', verifyToken, deleteUser);

// // Update User By ID Route
// router.post(
//   '/update-user/:userId',
//   upload.fields([
//     { name: 'profilePicture', maxCount: 1 }, // Handle profile picture upload
//     { name: 'resume', maxCount: 1 }, // Handle resume upload
//   ]),
//   verifyToken,
//   updateUser,
// );

// //filter the user
// router.post('/filter-user', verifyToken, filterUsers);

// module.exports = router;
















const express = require('express');
const verifyToken = require('../middleware/tokenMiddleware');

const {
  home,
  addUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  filterUsers,
} = require('../controller/jobseekerController');

const { upload } = require('../utils/awsS3');
const { UserBase } = require('../models/authModel');
const { Jobseeker } = require('../models/jobseekerModel');
const { Company } = require('../models/companyModel');

const router = express.Router();

/*
|--------------------------------------------------------------------------
| HOME
|--------------------------------------------------------------------------
*/

router.get('/home', verifyToken, home);

/*
|--------------------------------------------------------------------------
| ADD / UPDATE TALENT
|--------------------------------------------------------------------------
*/

router.post(
  '/add-user',
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'uploadCertificate', maxCount: 1 },
  ]),
  verifyToken,
  addUser,
);

router.post(
  '/add-talent',
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'uploadCertificate', maxCount: 1 },
  ]),
  verifyToken,
  addUser,
);

/*
|--------------------------------------------------------------------------
| GET CURRENT USER DATA
|--------------------------------------------------------------------------
|
| Used by frontend AppContext.
|
| New Talent:
| profileExists: false
| onboardingCompleted: false
|
| Existing but incomplete Talent:
| profileExists: true
| onboardingCompleted: false
|
| Completed Talent:
| profileExists: true
| onboardingCompleted: true
|
*/

router.get('/get-user-data', verifyToken, async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | AUTH ACCOUNT
    |--------------------------------------------------------------------------
    */

    const authUser = await UserBase.findById(userId)
      .select('-password -otp -otpExpiration -jwtToken')
      .lean();

    if (!authUser) {
      return res.status(404).json({
        success: false,
        message: 'Account not found',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | COMPANY USER
    |--------------------------------------------------------------------------
    */

    if (authUser.userType === 'company') {
      const company = await Company.findOne({
        user: userId,
      }).lean();

      /*
       * Company account exists but onboarding
       * profile has not been created yet.
       */
      if (!company) {
        return res.status(200).json({
          success: true,

          userData: {
            _id: authUser._id,

            email: authUser.email || '',

            firstName:
              authUser.firstName || '',

            middleName:
              authUser.middleName || '',

            lastName:
              authUser.lastName || '',

            fullName:
              [
                authUser.firstName,
                authUser.middleName,
                authUser.lastName,
              ]
                .filter(Boolean)
                .join(' '),

            userType: 'company',

            profileExists: false,

            organizationFromIndex: '1',

            organizationOnboadCompleted: false,

            organizationOnboardCompleted: false,

            onboardingCompleted: false,
          },
        });
      }

      const companyCompleted =
        company.organizationOnboadCompleted === true ||
        company.organizationOnboardCompleted === true;

      return res.status(200).json({
        success: true,

        userData: {
          _id: authUser._id,

          email: authUser.email || '',

          firstName:
            authUser.firstName || '',

          middleName:
            authUser.middleName || '',

          lastName:
            authUser.lastName || '',

          fullName:
            [
              authUser.firstName,
              authUser.middleName,
              authUser.lastName,
            ]
              .filter(Boolean)
              .join(' '),

          userType: 'company',

          /*
          |--------------------------------------------------------------------------
          | Company profile
          |--------------------------------------------------------------------------
          */

          profileExists: true,

          companyProfileId:
            company._id,

          type:
            company.type || 'company',

          companyName:
            company.companyName || '',

          individualName:
            company.individualName || '',

          website:
            company.website || '',

          designation:
            company.designation || '',

          industryType:
            company.industryType || '',

          businessType:
            company.businessType || '',

          projectScale:
            company.projectScale || '',

          country:
            company.country || '',

          companyType:
            company.companyType || '',

          tin:
            company.tin || '',

          companyAcNumber:
            company.companyAcNumber || '',

          companyLogo:
            company.companyLogo || null,

          summary:
            company.summary || '',

          phoneNumber:
            company.phoneNumber || '',

          /*
          |--------------------------------------------------------------------------
          | Company onboarding state
          |--------------------------------------------------------------------------
          */

          organizationFromIndex:
            company.organizationFromIndex || '1',

          organizationOnboadCompleted:
            companyCompleted,

          organizationOnboardCompleted:
            companyCompleted,

          /*
           * Generic flag so global route guards
           * can also understand company completion.
           */
          onboardingCompleted:
            companyCompleted,
        },
      });
    }

    /*
    |--------------------------------------------------------------------------
    | TALENT USER
    |--------------------------------------------------------------------------
    */

    if (authUser.userType === 'talent') {
      const profile = await Jobseeker.findOne({
        user: userId,
      }).lean();

      if (!profile) {
        return res.status(200).json({
          success: true,

          userData: {
            _id: authUser._id,

            email: authUser.email || '',

            firstName:
              authUser.firstName || '',

            middleName:
              authUser.middleName || '',

            lastName:
              authUser.lastName || '',

            userType: 'talent',

            profileExists: false,

            talentFormIndex: '1',

            talentOnboadCompleted: false,

            onboardingCompleted: false,
          },
        });
      }

      const talentCompleted =
        profile.talentOnboadCompleted === true ||
        profile.onboardingCompleted === true;

      return res.status(200).json({
        success: true,

        userData: {
          _id: authUser._id,

          email:
            authUser.email ||
            profile.email ||
            '',

          userType: 'talent',

          profileExists: true,

          firstName:
            profile.firstName ||
            authUser.firstName ||
            '',

          middleName:
            profile.middleName ||
            authUser.middleName ||
            '',

          lastName:
            profile.lastName ||
            authUser.lastName ||
            '',

          fullName:
            profile.fullName ||
            [
              profile.firstName ||
                authUser.firstName,

              profile.middleName ||
                authUser.middleName,

              profile.lastName ||
                authUser.lastName,
            ]
              .filter(Boolean)
              .join(' '),

          summary:
            profile.profileSummary ||
            profile.summary ||
            '',

          country:
            profile.country || '',

          city:
            profile.city || '',

          gender:
            profile.gender || '',

          dateOfBirth:
            profile.dateOfBirth || null,

          profilePicture:
            profile.profilePicture || null,

          resume:
            profile.resume || null,

          phoneNumber:
            profile.phoneNumber || '',

          technicalSkills:
            profile.technicalSkills || [],

          otherSkills:
            profile.otherSkills || [],

          experience:
            profile.experience || [],

          projects:
            profile.projects || [],

          education:
            profile.education || [],

          certification:
            profile.certification || [],

          languages:
            profile.languages || [],

          preference:
            profile.preference || {},

          github:
            profile.github || '',

          linkedin:
            profile.linkedin || '',

          portfolio:
            profile.portfolio || '',

          talentFormIndex:
            profile.talentFormIndex || '1',

          talentOnboadCompleted:
            talentCompleted,

          onboardingCompleted:
            talentCompleted,
        },
      });
    }

    /*
    |--------------------------------------------------------------------------
    | OTHER USERS
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      userData: {
        _id: authUser._id,

        email: authUser.email || '',

        userType:
          authUser.userType,

        profileExists: true,

        onboardingCompleted: true,
      },
    });
  } catch (error) {
    console.error(
      'GET USER DATA ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,

      message:
        'Failed to get user data',

      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : undefined,
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET TALENT ONBOARDING DATA
|--------------------------------------------------------------------------
*/

router.get('/get-talent', verifyToken, async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token',
      });
    }

    const talent = await Jobseeker.findOne({
      user: userId,
    });

    if (!talent) {
      return res.status(404).json({
        success: false,
        message: 'Talent profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      userData: talent,
    });
  } catch (error) {
    console.error('GET TALENT ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to get talent data',
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| TALENT DASHBOARD OVERVIEW
|--------------------------------------------------------------------------
*/

router.get(
  '/talent-dashboard-overview',
  verifyToken,
  async (req, res) => {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in token',
        });
      }

      const talent = await Jobseeker.findOne({
        user: userId,
      });

      if (!talent) {
        return res.status(404).json({
          success: false,
          message: 'Talent profile not found',
        });
      }

      return res.status(200).json({
        success: true,

        data: {
          profile: talent,

          stats: {
            projects: Array.isArray(talent.projects)
              ? talent.projects.length
              : 0,

            experience: Array.isArray(talent.experience)
              ? talent.experience.length
              : 0,

            technicalSkills: Array.isArray(
              talent.technicalSkills,
            )
              ? talent.technicalSkills.length
              : 0,

            education: Array.isArray(talent.education)
              ? talent.education.length
              : 0,
          },

          ongoingProjects: [],
        },
      });
    } catch (error) {
      console.error(
        'TALENT DASHBOARD ERROR:',
        error,
      );

      return res.status(500).json({
        success: false,
        message: 'Failed to load talent dashboard',
        error: error.message,
      });
    }
  },
);


router.get('/talent-dashboard-get-projects', verifyToken, async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token',
      });
    }

    const talent = await Jobseeker.findOne({
      user: userId,
    }).lean();

    if (!talent) {
      return res.status(404).json({
        success: false,
        message: 'Talent profile not found',
      });
    }

    const projects = Array.isArray(talent.projects)
      ? talent.projects
      : [];

    return res.status(200).json({
      success: true,
      data: projects,
      projects,
      count: projects.length,
    });
  } catch (error) {
    console.error('TALENT PROJECTS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load talent projects',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : undefined,
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET ALL USERS
|--------------------------------------------------------------------------
*/

router.get(
  '/get-users',
  verifyToken,
  getUsers,
);

/*
|--------------------------------------------------------------------------
| GET USER BY ID
|--------------------------------------------------------------------------
*/

router.get(
  '/get-user/:userId',
  verifyToken,
  getUserById,
);

/*
|--------------------------------------------------------------------------
| DELETE USER
|--------------------------------------------------------------------------
*/

router.post(
  '/delete-user/:userId',
  verifyToken,
  deleteUser,
);

/*
|--------------------------------------------------------------------------
| UPDATE USER
|--------------------------------------------------------------------------
*/

router.post(
  '/update-user/:userId',
  upload.fields([
    {
      name: 'profilePicture',
      maxCount: 1,
    },
    {
      name: 'resume',
      maxCount: 1,
    },
  ]),
  verifyToken,
  updateUser,
);

/*
|--------------------------------------------------------------------------
| FILTER USERS
|--------------------------------------------------------------------------
*/

router.post(
  '/filter-user',
  verifyToken,
  filterUsers,
);

module.exports = router;