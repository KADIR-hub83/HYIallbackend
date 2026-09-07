// const { UserBase } = require('../models/authModel');
// const { Company } = require('../models/companyModel'); // Correct import
// const {
//   loginUser,
//   signupUser,
//   forgetPassword,
//   resetPassword,
// } = require('../controller/authController');
// const mongoose = require('mongoose');
// const { uploadFileToS3, deleteFileFromS3 } = require('../utils/awsS3');

// // Add or Update Company Profile
// const addCompany = async (req, res) => {
//   try {
//     const {
//       companyName,
//       summary,
//       location,
//       phoneNumber,
//       businessType,
//       industryType,
//       timeZonePreferences,
//     } = req.body;

//     // Check if companyName is provided
//     if (!companyName) {
//       return res.status(400).json({ error: 'Company name is required' });
//     }

//     const userId = req.user._id; // Extract userId from token
//     const user = await UserBase.findById(userId); // Find user in UserBase

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     // Handle Company logo upload
//     let companylogoUrl = null;
//     if (req.files && req.files.companyLogo) {
//       companylogoUrl = await uploadFileToS3(
//         req.files.companyLogo[0],
//         'company-logo/',
//       );
//     }
//     // Check if user already has a company profile
//     let company = await Company.findOne({ user: userId });

//     if (!company) {
//       // Create a new Company profile if it doesn't exist
//       const newCompany = new Company({
//         user: userId,
//         email: user.email,
//         companyName,
//         summary,
//         location,
//         companyLogo: companylogoUrl,
//         phoneNumber,
//         businessType,
//         industryType,
//         timeZonePreferences,
//       });

//       await newCompany.save();
//       return res.status(201).json({
//         message: 'Company Profile created successfully',
//         user: newCompany,
//       });
//     } else {
//       // Update Company profile if it already exists
//       company.companyName = companyName;
//       company.email = user.email;
//       company.summary = summary || company.summary;
//       company.location = location || company.location;
//       if (companylogoUrl) {
//         company.companyLogo = companylogoUrl;
//       }
//       company.phoneNumber = phoneNumber || company.phoneNumber;
//       company.businessType = businessType || company.businessType;
//       company.industryType = industryType || company.industryType;
//       company.timeZonePreferences =
//         timeZonePreferences || company.timeZonePreferences;

//       await company.save();
//       return res.status(200).json({
//         message: 'Company Profile updated successfully',
//         user: company,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error', details: error.message });
//   }
// };

// // Get Company Profile by ID
// const getCompany = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const company = await Company.findOne({ user: userId });

//     if (!company) {
//       return res.status(404).json({ error: 'Company profile not found' });
//     }

//     return res.status(200).json({
//       message: 'Company Profile retrieved successfully',
//       company,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error', details: error.message });
//   }
// };

// // Delete Company Profile
// const deleteCompany = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const company = await Company.findOneAndDelete({ user: userId });

//     if (!company) {
//       return res.status(404).json({ error: 'Company profile not found' });
//     }

//     return res.status(200).json({
//       message: 'Company Profile deleted successfully',
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error', details: error.message });
//   }
// };

// // Get all Companies  with Pagination
// const getAllCompanies = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20; // Set default limit to 20

//     const skip = (page - 1) * limit;
//     const companies = await Company.find().skip(skip).limit(limit);

//     if (!companies || companies.length === 0) {
//       return res.status(404).json({ error: 'No companies found' });
//     }
//     const totalCount = await Company.countDocuments();

//     // Return paginated companies
//     return res.status(200).json({
//       message: 'Companies retrieved successfully',
//       companies,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalCount / limit),
//         totalCompanies: totalCount,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error', details: error.message });
//   }
// };

// //Update COmpnay By Id
// const updateCompany = async (req, res) => {
//   try {
//     const { companyId } = req.params; // Get companyId from the URL params
//     const {
//       companyName,
//       summary,
//       location,
//       phoneNumber,
//       businessType,
//       industryType,
//       timeZonePreferences,
//     } = req.body;

//     // Validate that companyId is a valid MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(companyId)) {
//       return res.status(400).json({ error: 'Invalid company ID' });
//     }

//     // Find the company by companyId
//     let company = await Company.findById(companyId);

//     if (!company) {
//       return res.status(404).json({ error: 'Company profile not found' });
//     }

//     let companylogoUrl = company.companyLogo;
//     if (req.files && req.files.companyLogo) {
//       // Delete the old profile picture from S3 if it exists
//       if (companylogoUrl) {
//         await deleteFileFromS3(companylogoUrl, 'company-logo/');
//       }
//       // Upload the new profile picture to the "jobseeker-profile/" folder in S3
//       companylogoUrl = await uploadFileToS3(
//         req.files.companyLogo[0],
//         'company-logo/',
//       );
//     }

//     // Update the company details
//     company.companyName = companyName || company.companyName;
//     company.summary = summary || company.summary;
//     company.location = location || company.location;
//     company.companyLogo = companylogoUrl || company.companyLogo;
//     company.phoneNumber = phoneNumber || company.phoneNumber;
//     company.businessType = businessType || company.businessType;
//     company.industryType = industryType || company.industryType;
//     company.timeZonePreferences =
//       timeZonePreferences || company.timeZonePreferences;

//     // Save the updated company profile
//     await company.save();

//     return res.status(200).json({
//       message: 'Company profile updated successfully',
//       company,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error', details: error.message });
//   }
// };

// module.exports = {
//   loginUser,
//   signupUser,
//   forgetPassword,
//   resetPassword,
//   addCompany,
//   getCompany,
//   deleteCompany,
//   getAllCompanies,
//   updateCompany,
// };













const mongoose = require('mongoose');

const { UserBase } = require('../models/authModel');
const { Company } = require('../models/companyModel');

const {
  loginUser,
  signupUser,
  forgetPassword,
  resetPassword,
} = require('../controller/authController');

const {
  uploadFileToS3,
  deleteFileFromS3,
} = require('../utils/awsS3');

const isProvided = value =>
  value !== undefined &&
  value !== null;

const toBoolean = value => {
  if (value === true || value === 'true') {
    return true;
  }

  if (value === false || value === 'false') {
    return false;
  }

  return Boolean(value);
};

/*
|--------------------------------------------------------------------------
| ADD / UPDATE COMPANY ONBOARDING
|--------------------------------------------------------------------------
*/

const normalizeString = value => {
  if (value === undefined || value === null) {
    return '';
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  return '';
};

const addCompany = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token',
      });
    }

    const user = await UserBase.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const {
      type,

      companyName,
      individualName,

      website,
      designation,
      projectScale,

      summary,
      location,
      phoneNumber,

      businessType,
      industryType,
      timeZonePreferences,

      country,
      companyType,
      tin,
      companyAcNumber,

      aadharCard,
      panCard,

      organizationFromIndex,
      organizationOnboadCompleted,
    } = req.body;

    const resolvedName =
      type === 'individual'
        ? individualName
        : companyName;

    if (!resolvedName) {
      return res.status(400).json({
        success: false,
        message:
          type === 'individual'
            ? 'Individual name is required'
            : 'Company name is required',
      });
    }

    let companyLogoUrl = null;

    if (
      req.files?.companyLogo?.length
    ) {
      companyLogoUrl =
        await uploadFileToS3(
          req.files.companyLogo[0],
          'company-logo/',
        );
    }

    let company =
      await Company.findOne({
        user: userId,
      });

    /*
    |--------------------------------------------------------------------------
    | CREATE
    |--------------------------------------------------------------------------
    */

    if (!company) {
      company = new Company({
        user: userId,

        email: user.email,

        type:
          type || 'company',

        companyName:
          type === 'company'
            ? companyName || ''
            : '',

        individualName:
          type === 'individual'
            ? individualName || ''
            : '',

        website:
          website || '',

        designation:
          designation || '',

        projectScale:
          projectScale || '',

        summary:
          summary || '',

location: normalizeString(location),

        phoneNumber:
          phoneNumber || '',

        businessType:
          businessType || '',

        industryType:
          industryType || '',

        timeZonePreferences:
          timeZonePreferences || '',

        country:
          country || '',

        companyType:
          companyType || '',

        tin:
          tin || '',

        companyAcNumber:
          companyAcNumber || '',

        aadharCard:
          aadharCard || '',

        panCard:
          panCard || '',

        companyLogo:
          companyLogoUrl,

        organizationFromIndex:
          organizationFromIndex || '1',

        organizationOnboadCompleted:
          toBoolean(
            organizationOnboadCompleted,
          ),
      });

      await company.save();

      return res.status(201).json({
        success: true,
        message:
          'Company profile created successfully',
        company,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE
    |--------------------------------------------------------------------------
    */

    company.email = user.email;

    if (isProvided(type)) {
      company.type = type;
    }

    if (
      type === 'company' &&
      isProvided(companyName)
    ) {
      company.companyName =
        companyName;
    }

    if (
      type === 'individual' &&
      isProvided(individualName)
    ) {
      company.individualName =
        individualName;
    }

    if (isProvided(website)) {
      company.website =
        website;
    }

    if (isProvided(designation)) {
      company.designation =
        designation;
    }

    if (isProvided(projectScale)) {
      company.projectScale =
        projectScale;
    }

    if (isProvided(summary)) {
      company.summary =
        summary;
    }

if (isProvided(location)) {
  company.location =
    normalizeString(location);
}

    if (isProvided(phoneNumber)) {
      company.phoneNumber =
        phoneNumber;
    }

    if (isProvided(businessType)) {
      company.businessType =
        businessType;
    }

    if (isProvided(industryType)) {
      company.industryType =
        industryType;
    }

    if (
      isProvided(
        timeZonePreferences,
      )
    ) {
      company.timeZonePreferences =
        timeZonePreferences;
    }

    if (isProvided(country)) {
      company.country =
        country;
    }

    if (isProvided(companyType)) {
      company.companyType =
        companyType;
    }

    if (isProvided(tin)) {
      company.tin =
        tin;
    }

    if (
      isProvided(
        companyAcNumber,
      )
    ) {
      company.companyAcNumber =
        companyAcNumber;
    }

    if (
      isProvided(aadharCard)
    ) {
      company.aadharCard =
        aadharCard;
    }

    if (isProvided(panCard)) {
      company.panCard =
        panCard;
    }

    if (companyLogoUrl) {
      company.companyLogo =
        companyLogoUrl;
    }

    if (
      isProvided(
        organizationFromIndex,
      )
    ) {
      company.organizationFromIndex =
        String(
          organizationFromIndex,
        );
    }

    if (
      isProvided(
        organizationOnboadCompleted,
      )
    ) {
      company.organizationOnboadCompleted =
        toBoolean(
          organizationOnboadCompleted,
        );
    }

    await company.save();

    return res.status(200).json({
      success: true,
      message:
        'Company profile updated successfully',
      company,
    });
  } catch (error) {
    console.error(
      'ADD COMPANY ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to save company profile',
      error:
        process.env.NODE_ENV ===
        'development'
          ? error.message
          : undefined,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET CURRENT COMPANY
|--------------------------------------------------------------------------
*/

const getCompany = async (
  req,
  res,
) => {
  try {
    const userId =
      req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          'User ID not found in token',
      });
    }

    const company =
      await Company.findOne({
        user: userId,
      }).lean();

    if (!company) {
      return res.status(404).json({
        success: false,
        message:
          'Company profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error(
      'GET COMPANY ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to get company profile',
      error:
        process.env.NODE_ENV ===
        'development'
          ? error.message
          : undefined,
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE CURRENT COMPANY
|--------------------------------------------------------------------------
*/

const deleteCompany = async (
  req,
  res,
) => {
  try {
    const userId =
      req.user?._id;

    const company =
      await Company.findOneAndDelete({
        user: userId,
      });

    if (!company) {
      return res.status(404).json({
        success: false,
        message:
          'Company profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      message:
        'Company profile deleted successfully',
    });
  } catch (error) {
    console.error(
      'DELETE COMPANY ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to delete company',
      error:
        process.env.NODE_ENV ===
        'development'
          ? error.message
          : undefined,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL COMPANIES
|--------------------------------------------------------------------------
*/

const getAllCompanies = async (
  req,
  res,
) => {
  try {
    const page =
      Math.max(
        parseInt(
          req.query.page,
          10,
        ) || 1,
        1,
      );

    const limit =
      Math.min(
        Math.max(
          parseInt(
            req.query.limit,
            10,
          ) || 20,
          1,
        ),
        100,
      );

    const skip =
      (page - 1) * limit;

    const [
      companies,
      totalCount,
    ] = await Promise.all([
      Company.find()
        .skip(skip)
        .limit(limit)
        .lean(),

      Company.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      companies,

      pagination: {
        currentPage: page,

        totalPages:
          Math.ceil(
            totalCount /
              limit,
          ),

        totalCompanies:
          totalCount,
      },
    });
  } catch (error) {
    console.error(
      'GET ALL COMPANIES ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to get companies',
      error:
        process.env.NODE_ENV ===
        'development'
          ? error.message
          : undefined,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE COMPANY BY ID
|--------------------------------------------------------------------------
*/

const updateCompany = async (
  req,
  res,
) => {
  try {
    const {
      companyId,
    } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        companyId,
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid company ID',
      });
    }

    const company =
      await Company.findById(
        companyId,
      );

    if (!company) {
      return res.status(404).json({
        success: false,
        message:
          'Company profile not found',
      });
    }

    /*
     * Security:
     * Only owner can update via this route
     * unless admin handling is added separately.
     */
    if (
      String(company.user) !==
      String(req.user?._id)
    ) {
      return res.status(403).json({
        success: false,
        message:
          'You are not allowed to update this company',
      });
    }

    let companyLogoUrl =
      company.companyLogo;

    if (
      req.files?.companyLogo?.length
    ) {
      if (companyLogoUrl) {
        try {
          await deleteFileFromS3(
            companyLogoUrl,
            'company-logo/',
          );
        } catch (error) {
          console.warn(
            'Unable to delete old company logo:',
            error.message,
          );
        }
      }

      companyLogoUrl =
        await uploadFileToS3(
          req.files.companyLogo[0],
          'company-logo/',
        );
    }

    Object.entries(
      req.body,
    ).forEach(
      ([key, value]) => {
        if (
          value !== undefined &&
          key in company
        ) {
          company[key] =
            value;
        }
      },
    );

    if (companyLogoUrl) {
      company.companyLogo =
        companyLogoUrl;
    }

    await company.save();

    return res.status(200).json({
      success: true,
      message:
        'Company profile updated successfully',
      company,
    });
  } catch (error) {
    console.error(
      'UPDATE COMPANY ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update company',
      error:
        process.env.NODE_ENV ===
        'development'
          ? error.message
          : undefined,
    });
  }
};
/*
|--------------------------------------------------------------------------
| COMPANY DASHBOARD STATUS
|--------------------------------------------------------------------------
*/

const getCompanyDashboardStatus = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token',
      });
    }

    const company = await Company.findOne({
      user: userId,
    }).lean();

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found',
      });
    }

    const completed =
      company.organizationOnboadCompleted === true ||
      company.organizationOnboardCompleted === true;

    return res.status(200).json({
      success: true,

      data: {
        profile: {
          _id: company._id,
          companyName: company.companyName || '',
          individualName: company.individualName || '',
          email: company.email || '',
          website: company.website || '',
          designation: company.designation || '',
          businessType: company.businessType || '',
          industryType: company.industryType || '',
          projectScale: company.projectScale || '',
          country: company.country || '',
          companyType: company.companyType || '',
          companyLogo: company.companyLogo || null,

          organizationFromIndex:
            company.organizationFromIndex || '1',

          organizationOnboadCompleted:
            completed,

          organizationOnboardCompleted:
            completed,
        },

        stats: {
          totalProjects: 0,
          ongoingProjects: 0,
          totalCandidates: 0,
          interviews: 0,
        },

        ongoingProjects: [],
      },
    });
  } catch (error) {
    console.error(
      'COMPANY DASHBOARD STATUS ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to load company dashboard',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : undefined,
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET PROJECTS BY CURRENT COMPANY
|--------------------------------------------------------------------------
*/

const getProjectsByCompany = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token',
      });
    }

    const company = await Company.findOne({
      user: userId,
    }).lean();

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found',
      });
    }

    /*
     * No project model is currently wired here.
     * Return production-safe empty data instead of 404.
     */

    return res.status(200).json({
      success: true,
      data: [],
      total: 0,
    });
  } catch (error) {
    console.error(
      'GET PROJECTS BY COMPANY ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to load company projects',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : undefined,
    });
  }
};

module.exports = {
  loginUser,
  signupUser,
  forgetPassword,
  resetPassword,

  addCompany,
  getCompany,
  deleteCompany,
  getAllCompanies,
  updateCompany,

  getCompanyDashboardStatus,
  getProjectsByCompany,
};