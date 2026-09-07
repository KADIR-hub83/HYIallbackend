// const { UserBase } = require('../models/authModel');
// const { Jobseeker } = require('../models/jobseekerModel');
// const {
//   loginUser,
//   signupUser,
//   forgetPassword,
//   resetPassword,
// } = require('./authController');
// const {
//   uploadFileToS3,
//   deleteFileFromS3,
//   processAndUploadImage,
// } = require('../utils/awsS3');
// // Home API route
// const home = async (req, res) => {
//   try {
//     const { email } = req.user;
//     res.status(200).json({ message: `Welcome, ${email}` });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Add or Update User Profile
// const addUser = async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       summary,
//       phoneNumber,
//       location,
//       technicalSkills,
//       otherSkills,
//       experience,
//       roles,
//       projects,
//       education,
//       preference,
//       socialLinks,
//       expectedPrice,
//     } = req.body;

//     if (!firstName || !lastName) {
//       return res
//         .status(400)
//         .json({ error: 'First name and last name are required' });
//     }
//     // Concatenate fullName from firstName and lastName
//     const fullName = `${firstName} ${lastName}`;
//     // Handle profile picture upload
//     let profilePictureUrls = null;
//     if (req.files && req.files.profilePicture) {
//       profilePictureUrls = await processAndUploadImage(
//         req.files.profilePicture[0],
//         'jobseeker-profile/',
//         fullName,
//       );
//     }

//     // Handle resume upload
//     let resumeUrl = null;
//     if (req.files && req.files.resume) {
//       resumeUrl = await uploadFileToS3(
//         req.files.resume[0],
//         'jobseeker-resume/',
//       );
//     }

//     // Handle certification upload
//     let certificationUrl = null;
//     if (req.files && req.files.uploadCertificate) {
//       certificationUrl = await uploadFileToS3(
//         req.files.uploadCertificate[0],
//         'jobseeker-certification/',
//       );
//     }
//     const userId = req.user._id;

//     const user = await UserBase.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Find the user's existing Jobseeker profile (if any)
//     let jobseeker = await Jobseeker.findOne({ user: userId });

//     if (!jobseeker) {
//       // Create a new Jobseeker profile if it doesn't exist
//       const newJobseeker = new Jobseeker({
//         user: userId,
//         email: user.email,
//         firstName,
//         lastName,
//         fullName,
//         summary,
//         location,
//         phoneNumber,
//         profilePicture: profilePictureUrls?.[0],
//         resume: resumeUrl,
//         technicalSkills,
//         otherSkills,
//         experience,
//         expectedPrice,
//         roles,
//         projects,
//         education,
//         uploadCertificate: certificationUrl,
//         preference,
//         socialLinks,
//       });

//       await newJobseeker.save();
//       return res.status(200).json({
//         message: 'Profile created successfully',
//         jobseeker: newJobseeker,
//       });
//     } else {
//       // Update existing Jobseeker profile
//       jobseeker.firstName = firstName;
//       jobseeker.lastName = lastName;
//       jobseeker.fullName = fullName;
//       jobseeker.email = user.email;
//       jobseeker.summary = summary || jobseeker.summary;
//       jobseeker.phoneNumber = phoneNumber || jobseeker.phoneNumber;
//       jobseeker.location = location || jobseeker.location;
//       if (profilePictureUrls) {
//         jobseeker.profilePicture = profilePictureUrls[0];
//         jobseeker.profilePictureUrls = profilePictureUrls;
//       }
//       jobseeker.resume = resumeUrl || jobseeker.resume;
//       jobseeker.technicalSkills = technicalSkills || jobseeker.technicalSkills;
//       jobseeker.otherSkills = otherSkills || jobseeker.otherSkills;
//       jobseeker.experience = experience || jobseeker.experience;
//       jobseeker.expectedPrice = expectedPrice || jobseeker.expectedPrice;
//       jobseeker.roles = roles || jobseeker.roles;
//       jobseeker.projects = projects || jobseeker.projects;
//       jobseeker.education = education || jobseeker.education;
//       if (certificationUrl) jobseeker.uploadCertificate = certificationUrl;
//       jobseeker.preference = preference || jobseeker.preference;
//       jobseeker.socialLinks = socialLinks || jobseeker.socialLinks;
//       await jobseeker.save();
//       return res.status(200).json({
//         message: 'Profile updated successfully',
//         jobseeker,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error', details: error.message });
//   }
// };

// // Get all users with pagination
// const getUsers = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;

//     const users = await Jobseeker.find()
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const totalUsers = await Jobseeker.countDocuments();

//     res.status(200).json({
//       currentPage: page,
//       totalPages: Math.ceil(totalUsers / limit),
//       totalUsers: totalUsers,
//       users: users,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error', details: error.message });
//   }
// };

// // Get User By ID
// const getUserById = async (req, res) => {
//   try {
//     const { userId } = req.params;
// const user = await Jobseeker.findOne({
//   user: userId,
// });
//     const email = req.email;
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.status(200).json({
//       email: user.email,
//       userName: user.userName,
//       summary: user.summary,
//       location: user.location,
//       profilePicture: user.profilePicture,
//       resume: user.resume,
//       technicalSkills: user.technicalSkills,
//       otherSkills: user.otherSkills,
//       experience: user.experience,
//       projects: user.projects,
//       education: user.education,
//       typeOfJob: user.typeOfJob,
//       github: user.github,
//       linkedin: user.linkedin,
//       userType: user.userType,
//       phoneNumber: user.phoneNumber,
//     });
//   } catch (error) {
//     // Log error details and respond with 500
//     console.error('Error in getUsers:', error);
//     res.status(500).json({ error: 'Server error', details: error.message });
//   }
// };

// // Delete User by ID
// const deleteUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const user = await Jobseeker.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     await user.deleteOne();
//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error', details: error.message });
//   }
// };

// // Update User By ID
// const updateUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const {
//       firstName,
//       lastName,
//       fullName,
//       summary,
//       location,
//       technicalSkills,
//       otherSkills,
//       experience,
//       projects,
//       education,
//       typeOfJob,
//       github,
//       linkedin,
//       userType,
//       phoneNumber,
//       expectedPrice,
//     } = req.body;

//     const user = await Jobseeker.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     let profilePictureUrl = user.profilePicture || null;

//     // Handle profile picture upload
//     if (req.files && req.files.profilePicture) {
//       // Delete the old profile picture from S3 if it exists
//       if (profilePictureUrl) {
//         await deleteFileFromS3(profilePictureUrl, 'jobseeker-profile/');
//       }
//       // Construct full name for image naming
//       const fullName = `${user.firstName} ${user.lastName}`;
//       // Process and upload the new profile picture
//       profilePictureUrl = await processAndUploadImage(
//         req.files.profilePicture[0],
//         'jobseeker-profile/',
//         fullName,
//       );
//     }

//     let resumeUrl = user.resume;
//     if (req.files && req.files.resume) {
//       // Delete the old resume from S3 if it exists
//       if (resumeUrl) {
//         await deleteFileFromS3(resumeUrl, 'jobseeker-resume/');
//       }
//       // Upload the new resume to the "jobseeker-resume/" folder in S3
//       resumeUrl = await uploadFileToS3(
//         req.files.resume[0],
//         'jobseeker-resume/',
//       );
//     }

//     if (firstName) user.firstName = firstName;
//     if (lastName) user.lastName = lastName;
//     if (summary) user.summary = summary;
//     if (fullName) user.fullName = fullName;
//     if (technicalSkills && Array.isArray(technicalSkills))
//       user.technicalSkills = technicalSkills;
//     if (otherSkills && Array.isArray(otherSkills))
//       user.otherSkills = otherSkills;
//     if (experience && Array.isArray(experience)) user.experience = experience;
//     if (expectedPrice && Array.isArray(expectedPrice))
//       user.expectedPrice = expectedPrice;
//     if (projects && Array.isArray(projects)) user.projects = projects;
//     if (education && Array.isArray(education)) user.education = education;
//     if (typeOfJob) user.typeOfJob = typeOfJob;
//     if (github) user.github = github;
//     if (linkedin) user.linkedin = linkedin;
//     if (location) user.location = location;
//     if (profilePictureUrl.length > 0)
//       user.profilePicture = profilePictureUrl[0];
//     if (resumeUrl) user.resume = resumeUrl;
//     if (userType) user.userType = userType;
//     if (phoneNumber) user.phoneNumber = phoneNumber;
//     await user.save();

//     res.status(200).json({
//       message: 'User updated successfully',
//       user: {
//         _id: user._id,
//         email: user.email,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         fullName: user.fullName,
//         summary: user.summary,
//         location: user.location,
//         resume: user.resume,
//         technicalSkills: user.technicalSkills,
//         otherSkills: user.otherSkills,
//         experience: user.experience,
//         expectedPrice: user.expectedPrice,
//         projects: user.projects,
//         education: user.education,
//         typeOfJob: user.typeOfJob,
//         github: user.github,
//         linkedin: user.linkedin,
//         profilePicture: user.profilePicture,
//         userType: user.userType,
//         phoneNumber: user.phoneNumber,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error', details: error.message });
//   }
// };

// // Filter Users by Skills, Type of Job, and Date Range
// const filterUsers = async (req, res) => {
//   try {
//     const {
//       skills,
//       typeOfJob,
//       location,
//       createdAtFrom,
//       createdAtTo,
//       page = 1,
//     } = req.body;

//     const filter = {};

//     if (skills) {
//       const skillsArray = skills.split(',');
//       const skillFilters = skillsArray.map((skillExpPair) => {
//         const [skill, exp] = skillExpPair.split(':');
//         return {
//           skill: skill.trim(),
//           exp: { $gte: Number(exp) },
//         };
//       });

//       filter.technicalSkills = {
//         $elemMatch: {
//           $or: skillFilters,
//         },
//       };
//     }

//     if (typeOfJob) filter.typeOfJob = typeOfJob;
//     if (location) filter.location = location;

//     if (createdAtFrom && createdAtTo) {
//       const startDate = new Date(createdAtFrom);
//       const endDate = new Date(createdAtTo);
//       const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
//       const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));
//       filter.createdAt = { $gte: startOfDay, $lt: endOfDay };
//     }

//     const limit = 20;
//     const skip = (page - 1) * limit;

//     const users = await Jobseeker.find(filter)
//       .skip(skip)
//       .limit(limit)
//       .select('-password -otp -otpExpiration -__v');

//     if (users.length === 0) {
//       return res
//         .status(404)
//         .json({ message: 'No users found matching criteria' });
//     }

//     const totalCount = await Jobseeker.countDocuments(filter);

//     res.status(200).json({
//       message: 'Filtered users retrieved successfully',
//       users,
//       pagination: {
//         currentPage: Number(page),
//         totalPages: Math.ceil(totalCount / limit),
//         totalUsers: totalCount,
//       },
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
//   home,
//   addUser,
//   getUsers,
//   getUserById,
//   deleteUser,
//   updateUser,
//   filterUsers,
// };
















// const { UserBase } = require('../models/authModel');
// const { Jobseeker } = require('../models/jobseekerModel');

// const {
//   loginUser,
//   signupUser,
//   forgetPassword,
//   resetPassword,
// } = require('./authController');

// const {
//   uploadFileToS3,
//   deleteFileFromS3,
//   processAndUploadImage,
// } = require('../utils/awsS3');

// /*
// |--------------------------------------------------------------------------
// | HELPERS
// |--------------------------------------------------------------------------
// */

// const isProvided = (value) =>
//   value !== undefined && value !== null;

// const toBoolean = (value) => {
//   if (value === true || value === 'true') return true;
//   if (value === false || value === 'false') return false;

//   return Boolean(value);
// };

// const parseIfJson = (value) => {
//   if (typeof value !== 'string') return value;

//   const trimmed = value.trim();

//   if (
//     (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
//     (trimmed.startsWith('[') && trimmed.endsWith(']'))
//   ) {
//     try {
//       return JSON.parse(trimmed);
//     } catch (error) {
//       return value;
//     }
//   }

//   return value;
// };

// const makeFullName = (
//   firstName = '',
//   middleName = '',
//   lastName = '',
// ) => {
//   return [firstName, middleName, lastName]
//     .filter(Boolean)
//     .join(' ')
//     .trim();
// };

// /*
// |--------------------------------------------------------------------------
// | HOME
// |--------------------------------------------------------------------------
// */

// const home = async (req, res) => {
//   try {
//     const { email } = req.user;

//     return res.status(200).json({
//       message: `Welcome, ${email}`,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: 'Server error',
//       error: error.message,
//     });
//   }
// };

// /*
// |--------------------------------------------------------------------------
// | ADD / UPDATE TALENT PROFILE
// |--------------------------------------------------------------------------
// |
// | IMPORTANT:
// |
// | This endpoint is called for ALL onboarding steps.
// |
// | Step 1 = Basic Details
// | Step 2 = Work Experience
// | Step 3 = Education
// | Step 4 = Additional Details
// |
// | Therefore firstName / lastName must NOT be required on every request.
// |
// */

// const addUser = async (req, res) => {
//   try {
//     const userId = req.user?._id;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: 'User ID not found in token',
//       });
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | ACCOUNT
//     |--------------------------------------------------------------------------
//     */

//     const user = await UserBase.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found',
//       });
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | REQUEST BODY
//     |--------------------------------------------------------------------------
//     */

//     const {
//       firstName,
//       middleName,
//       lastName,

//       summary,
//       profileSummary,

//       phoneNumber,
//       location,
//       country,
//       city,
//       gender,
//       dateOfBirth,

//       technicalSkills,
//       otherSkills,
//       experience,
//       roles,
//       projects,
//       education,
//       certification,
//       languages,

//       preference,
//       socialLinks,
//       expectedPrice,

//       github,
//       linkedin,
//       portfolio,

//       talentFormIndex,

//       // Existing project uses this spelling
//       talentOnboadCompleted,

//       // Support corrected spelling too
//       onboardingCompleted,
//     } = req.body;

//     /*
//     |--------------------------------------------------------------------------
//     | EXISTING PROFILE
//     |--------------------------------------------------------------------------
//     */

//     let jobseeker = await Jobseeker.findOne({
//       user: userId,
//     });

//     /*
//     |--------------------------------------------------------------------------
//     | FILE UPLOADS
//     |--------------------------------------------------------------------------
//     */

//     let profilePictureUrl = null;
//     let resumeUrl = null;
//     let certificationUrl = null;

//     /*
//     |--------------------------------------------------------------------------
//     | PROFILE IMAGE
//     |--------------------------------------------------------------------------
//     */

//     if (
//       req.files &&
//       req.files.profilePicture &&
//       req.files.profilePicture.length > 0
//     ) {
//       const imageName = makeFullName(
//         firstName || jobseeker?.firstName || user.firstName,
//         middleName || jobseeker?.middleName || user.middleName,
//         lastName || jobseeker?.lastName || user.lastName,
//       );

//       const uploadedProfilePicture =
//         await processAndUploadImage(
//           req.files.profilePicture[0],
//           'jobseeker-profile/',
//           imageName || 'talent-profile',
//         );

//       /*
//        * Existing helper appears to return an array.
//        * Support both array and string.
//        */

//       if (Array.isArray(uploadedProfilePicture)) {
//         profilePictureUrl =
//           uploadedProfilePicture[0] || null;
//       } else {
//         profilePictureUrl =
//           uploadedProfilePicture || null;
//       }
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | RESUME
//     |--------------------------------------------------------------------------
//     */

//     if (
//       req.files &&
//       req.files.resume &&
//       req.files.resume.length > 0
//     ) {
//       resumeUrl = await uploadFileToS3(
//         req.files.resume[0],
//         'jobseeker-resume/',
//       );
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | CERTIFICATE
//     |--------------------------------------------------------------------------
//     */

//     if (
//       req.files &&
//       req.files.uploadCertificate &&
//       req.files.uploadCertificate.length > 0
//     ) {
//       certificationUrl = await uploadFileToS3(
//         req.files.uploadCertificate[0],
//         'jobseeker-certification/',
//       );
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | NORMALIZE BODY VALUES
//     |--------------------------------------------------------------------------
//     */

//     const parsedTechnicalSkills =
//       parseIfJson(technicalSkills);

//     const parsedOtherSkills =
//       parseIfJson(otherSkills);

//     const parsedExperience =
//       parseIfJson(experience);

//     const parsedRoles =
//       parseIfJson(roles);

//     const parsedProjects =
//       parseIfJson(projects);

//     const parsedEducation =
//       parseIfJson(education);

//     const parsedCertification =
//       parseIfJson(certification);

//     const parsedLanguages =
//       parseIfJson(languages);

//     const parsedPreference =
//       parseIfJson(preference);

//     const parsedSocialLinks =
//       parseIfJson(socialLinks);

//     const parsedExpectedPrice =
//       parseIfJson(expectedPrice);

//     /*
//     |--------------------------------------------------------------------------
//     | CREATE PROFILE
//     |--------------------------------------------------------------------------
//     */

//     if (!jobseeker) {
//       /*
//        * First onboarding request should normally be Basic Details,
//        * therefore names are required only while creating profile.
//        */

//       const finalFirstName =
//         firstName || user.firstName || '';

//       const finalMiddleName =
//         middleName || user.middleName || '';

//       const finalLastName =
//         lastName || user.lastName || '';

//       if (!finalFirstName || !finalLastName) {
//         return res.status(400).json({
//           success: false,
//           error:
//             'First name and last name are required to create talent profile',
//         });
//       }

//       const fullName = makeFullName(
//         finalFirstName,
//         finalMiddleName,
//         finalLastName,
//       );

//       const newJobseekerData = {
//         user: userId,

//         email: user.email,

//         firstName: finalFirstName,
//         middleName: finalMiddleName,
//         lastName: finalLastName,
//         fullName,

//         /*
//         |--------------------------------------------------------------------------
//         | BASIC DETAILS
//         |--------------------------------------------------------------------------
//         */

//         phoneNumber: isProvided(phoneNumber)
//           ? String(phoneNumber)
//           : '',

//         gender: gender || '',
//         dateOfBirth: dateOfBirth || null,
//         country: country || '',
//         city: city || '',

//         summary:
//           profileSummary ||
//           summary ||
//           '',

//         location: location || '',

//         /*
//         |--------------------------------------------------------------------------
//         | FILES
//         |--------------------------------------------------------------------------
//         */

//         profilePicture: profilePictureUrl,
//         resume: resumeUrl,

//         /*
//         |--------------------------------------------------------------------------
//         | SOCIAL
//         |--------------------------------------------------------------------------
//         */

//         github: github || '',
//         linkedin: linkedin || '',
//         portfolio: portfolio || '',

//         /*
//         |--------------------------------------------------------------------------
//         | ONBOARDING DATA
//         |--------------------------------------------------------------------------
//         */

//         talentFormIndex:
//           talentFormIndex !== undefined
//             ? String(talentFormIndex)
//             : '1',

//         talentOnboadCompleted:
//           isProvided(talentOnboadCompleted)
//             ? toBoolean(talentOnboadCompleted)
//             : isProvided(onboardingCompleted)
//               ? toBoolean(onboardingCompleted)
//               : false,
//       };

//       /*
//       |--------------------------------------------------------------------------
//       | OPTIONAL COLLECTION FIELDS
//       |--------------------------------------------------------------------------
//       */

//       if (isProvided(parsedTechnicalSkills)) {
//         newJobseekerData.technicalSkills =
//           parsedTechnicalSkills;
//       }

//       if (isProvided(parsedOtherSkills)) {
//         newJobseekerData.otherSkills =
//           parsedOtherSkills;
//       }

//       if (isProvided(parsedExperience)) {
//         newJobseekerData.experience =
//           parsedExperience;
//       }

//       if (isProvided(parsedRoles)) {
//         newJobseekerData.roles =
//           parsedRoles;
//       }

//       if (isProvided(parsedProjects)) {
//         newJobseekerData.projects =
//           parsedProjects;
//       }

//       if (isProvided(parsedEducation)) {
//         newJobseekerData.education =
//           parsedEducation;
//       }

//       if (isProvided(parsedCertification)) {
//         newJobseekerData.certification =
//           parsedCertification;
//       }

//       if (isProvided(parsedLanguages)) {
//         newJobseekerData.languages =
//           parsedLanguages;
//       }

//       if (isProvided(parsedPreference)) {
//         newJobseekerData.preference =
//           parsedPreference;
//       }

//       if (isProvided(parsedSocialLinks)) {
//         newJobseekerData.socialLinks =
//           parsedSocialLinks;
//       }

//       if (isProvided(parsedExpectedPrice)) {
//         newJobseekerData.expectedPrice =
//           parsedExpectedPrice;
//       }

//       if (certificationUrl) {
//         newJobseekerData.uploadCertificate =
//           certificationUrl;
//       }

//       jobseeker = new Jobseeker(
//         newJobseekerData,
//       );

//       await jobseeker.save();

//       console.log(
//         'TALENT PROFILE CREATED:',
//         {
//           id: jobseeker._id,
//           talentFormIndex:
//             jobseeker.talentFormIndex,
//           completed:
//             jobseeker.talentOnboadCompleted,
//         },
//       );

//       return res.status(200).json({
//         success: true,
//         message: 'Profile created successfully',
//         jobseeker,
//       });
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | UPDATE EXISTING PROFILE
//     |--------------------------------------------------------------------------
//     |
//     | Only update fields actually sent by current onboarding step.
//     |
//     */

//     if (isProvided(firstName)) {
//       jobseeker.firstName = firstName;
//     }

//     if (isProvided(middleName)) {
//       jobseeker.middleName =
//         middleName || '';
//     }

//     if (isProvided(lastName)) {
//       jobseeker.lastName = lastName;
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | UPDATE FULL NAME
//     |--------------------------------------------------------------------------
//     */

//     if (
//       isProvided(firstName) ||
//       isProvided(middleName) ||
//       isProvided(lastName)
//     ) {
//       jobseeker.fullName = makeFullName(
//         jobseeker.firstName,
//         jobseeker.middleName,
//         jobseeker.lastName,
//       );
//     }

//     jobseeker.email = user.email;

//     /*
//     |--------------------------------------------------------------------------
//     | BASIC DETAILS
//     |--------------------------------------------------------------------------
//     */

//     if (
//       isProvided(profileSummary) ||
//       isProvided(summary)
//     ) {
//       jobseeker.summary =
//         profileSummary ??
//         summary ??
//         '';
//     }

//     if (isProvided(phoneNumber)) {
//       jobseeker.phoneNumber =
//         phoneNumber === ''
//           ? ''
//           : String(phoneNumber);
//     }

//     if (isProvided(location)) {
//       jobseeker.location = location;
//     }

//     if (isProvided(country)) {
//       jobseeker.country = country;
//     }

//     if (isProvided(city)) {
//       jobseeker.city = city;
//     }

//     if (isProvided(gender)) {
//       jobseeker.gender = gender;
//     }

//     if (isProvided(dateOfBirth)) {
//       jobseeker.dateOfBirth =
//         dateOfBirth || null;
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | SOCIAL LINKS
//     |--------------------------------------------------------------------------
//     */

//     if (isProvided(github)) {
//       jobseeker.github = github;
//     }

//     if (isProvided(linkedin)) {
//       jobseeker.linkedin = linkedin;
//     }

//     if (isProvided(portfolio)) {
//       jobseeker.portfolio = portfolio;
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | FILES
//     |--------------------------------------------------------------------------
//     */

//     if (profilePictureUrl) {
//       jobseeker.profilePicture =
//         profilePictureUrl;
//     }

//     if (resumeUrl) {
//       jobseeker.resume = resumeUrl;
//     }

//     if (certificationUrl) {
//       jobseeker.uploadCertificate =
//         certificationUrl;
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | WORK EXPERIENCE
//     |--------------------------------------------------------------------------
//     */

//     if (isProvided(parsedTechnicalSkills)) {
//       jobseeker.technicalSkills =
//         parsedTechnicalSkills;
//     }

//     if (isProvided(parsedOtherSkills)) {
//       jobseeker.otherSkills =
//         parsedOtherSkills;
//     }

//     if (isProvided(parsedExperience)) {
//       jobseeker.experience =
//         parsedExperience;
//     }

//     if (isProvided(parsedRoles)) {
//       jobseeker.roles =
//         parsedRoles;
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | EDUCATION
//     |--------------------------------------------------------------------------
//     */

//     if (isProvided(parsedEducation)) {
//       jobseeker.education =
//         parsedEducation;
//     }

//     if (isProvided(parsedCertification)) {
//       jobseeker.certification =
//         parsedCertification;
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | PROJECTS / LANGUAGES
//     |--------------------------------------------------------------------------
//     */

//     if (isProvided(parsedProjects)) {
//       jobseeker.projects =
//         parsedProjects;
//     }

//     if (isProvided(parsedLanguages)) {
//       jobseeker.languages =
//         parsedLanguages;
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | PREFERENCE
//     |--------------------------------------------------------------------------
//     */

//     if (isProvided(parsedPreference)) {
//       jobseeker.preference =
//         parsedPreference;
//     }

//     if (isProvided(parsedSocialLinks)) {
//       jobseeker.socialLinks =
//         parsedSocialLinks;
//     }

//     if (isProvided(parsedExpectedPrice)) {
//       jobseeker.expectedPrice =
//         parsedExpectedPrice;
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | ONBOARDING STEP INDEX
//     |--------------------------------------------------------------------------
//     */

//     if (isProvided(talentFormIndex)) {
//       jobseeker.talentFormIndex =
//         String(talentFormIndex);
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | ONBOARDING COMPLETED
//     |--------------------------------------------------------------------------
//     |
//     | This is the most important fix for dashboard redirect.
//     |
//     */

//     if (isProvided(talentOnboadCompleted)) {
//       jobseeker.talentOnboadCompleted =
//         toBoolean(
//           talentOnboadCompleted,
//         );
//     } else if (
//       isProvided(onboardingCompleted)
//     ) {
//       jobseeker.talentOnboadCompleted =
//         toBoolean(
//           onboardingCompleted,
//         );
//     }

//     /*
//      * If your schema also contains the corrected
//      * onboardingCompleted field, keep it synchronized.
//      */
//     if (
//       Jobseeker.schema.path(
//         'onboardingCompleted',
//       )
//     ) {
//       if (
//         isProvided(talentOnboadCompleted)
//       ) {
//         jobseeker.onboardingCompleted =
//           toBoolean(
//             talentOnboadCompleted,
//           );
//       } else if (
//         isProvided(onboardingCompleted)
//       ) {
//         jobseeker.onboardingCompleted =
//           toBoolean(
//             onboardingCompleted,
//           );
//       }
//     }

//     await jobseeker.save();

//     console.log(
//       'TALENT PROFILE UPDATED:',
//       {
//         id: jobseeker._id,
//         talentFormIndex:
//           jobseeker.talentFormIndex,
//         talentOnboadCompleted:
//           jobseeker.talentOnboadCompleted,
//       },
//     );

//     return res.status(200).json({
//       success: true,
//       message: 'Profile updated successfully',
//       jobseeker,
//       onboardingCompleted:
//         jobseeker.talentOnboadCompleted ===
//         true,
//     });
//   } catch (error) {
//     console.error(
//       'ADD / UPDATE TALENT ERROR:',
//       error,
//     );

//     return res.status(500).json({
//       success: false,
//       error: 'Server error',
//       details: error.message,
//     });
//   }
// };

// /*
// |--------------------------------------------------------------------------
// | GET ALL USERS
// |--------------------------------------------------------------------------
// */

// const getUsers = async (req, res) => {
//   try {
//     const page =
//       parseInt(req.query.page, 10) || 1;

//     const limit =
//       parseInt(req.query.limit, 10) || 20;

//     const users = await Jobseeker.find()
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const totalUsers =
//       await Jobseeker.countDocuments();

//     return res.status(200).json({
//       currentPage: page,
//       totalPages: Math.ceil(
//         totalUsers / limit,
//       ),
//       totalUsers,
//       users,
//     });
//   } catch (error) {
//     console.error(
//       'GET USERS ERROR:',
//       error,
//     );

//     return res.status(500).json({
//       error: 'Server error',
//       details: error.message,
//     });
//   }
// };

// /*
// |--------------------------------------------------------------------------
// | GET USER BY ID
// |--------------------------------------------------------------------------
// */

// const getUserById = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const user = await Jobseeker.findOne({
//       user: userId,
//     });

//     if (!user) {
//       return res.status(404).json({
//         error: 'User not found',
//       });
//     }

//     return res.status(200).json({
//       email: user.email,

//       firstName: user.firstName,
//       middleName: user.middleName,
//       lastName: user.lastName,

//       fullName: user.fullName,

//       summary:
//         user.profileSummary ||
//         user.summary,

//       location: user.location,

//       country: user.country,
//       city: user.city,

//       gender: user.gender,
//       dateOfBirth: user.dateOfBirth,

//       profilePicture:
//         user.profilePicture,

//       resume: user.resume,

//       technicalSkills:
//         user.technicalSkills,

//       otherSkills:
//         user.otherSkills,

//       experience:
//         user.experience,

//       projects:
//         user.projects,

//       education:
//         user.education,

//       certification:
//         user.certification,

//       languages:
//         user.languages,

//       typeOfJob:
//         user.typeOfJob,

//       github: user.github,
//       linkedin: user.linkedin,
//       portfolio: user.portfolio,

//       userType:
//         user.userType,

//       phoneNumber:
//         isProvided(user.phoneNumber)
//           ? String(user.phoneNumber)
//           : '',

//       talentFormIndex:
//         user.talentFormIndex,

//       talentOnboadCompleted:
//         user.talentOnboadCompleted,
//     });
//   } catch (error) {
//     console.error(
//       'GET USER BY ID ERROR:',
//       error,
//     );

//     return res.status(500).json({
//       error: 'Server error',
//       details: error.message,
//     });
//   }
// };

// /*
// |--------------------------------------------------------------------------
// | DELETE USER
// |--------------------------------------------------------------------------
// */

// const deleteUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     /*
//      * Support both Jobseeker _id and
//      * auth user id where possible.
//      */

//     let user =
//       await Jobseeker.findById(
//         userId,
//       ).catch(() => null);

//     if (!user) {
//       user = await Jobseeker.findOne({
//         user: userId,
//       });
//     }

//     if (!user) {
//       return res.status(404).json({
//         error: 'User not found',
//       });
//     }

//     await user.deleteOne();

//     return res.status(200).json({
//       message: 'User deleted successfully',
//     });
//   } catch (error) {
//     console.error(
//       'DELETE USER ERROR:',
//       error,
//     );

//     return res.status(500).json({
//       error: 'Server error',
//       details: error.message,
//     });
//   }
// };

// /*
// |--------------------------------------------------------------------------
// | UPDATE USER
// |--------------------------------------------------------------------------
// */

// const updateUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const {
//       firstName,
//       middleName,
//       lastName,
//       fullName,

//       summary,
//       location,
//       country,
//       city,

//       technicalSkills,
//       otherSkills,
//       experience,
//       projects,
//       education,

//       typeOfJob,

//       github,
//       linkedin,
//       portfolio,

//       userType,
//       phoneNumber,
//       expectedPrice,

//       talentFormIndex,
//       talentOnboadCompleted,
//     } = req.body;

//     /*
//      * Existing route historically uses Jobseeker _id.
//      */

//     let user =
//       await Jobseeker.findById(
//         userId,
//       ).catch(() => null);

//     if (!user) {
//       user = await Jobseeker.findOne({
//         user: userId,
//       });
//     }

//     if (!user) {
//       return res.status(404).json({
//         error: 'User not found',
//       });
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | PROFILE PICTURE
//     |--------------------------------------------------------------------------
//     */

//     let profilePictureUrl =
//       user.profilePicture || null;

//     if (
//       req.files &&
//       req.files.profilePicture &&
//       req.files.profilePicture.length > 0
//     ) {
//       if (profilePictureUrl) {
//         try {
//           await deleteFileFromS3(
//             profilePictureUrl,
//             'jobseeker-profile/',
//           );
//         } catch (error) {
//           console.warn(
//             'Failed to delete old profile picture:',
//             error.message,
//           );
//         }
//       }

//       const imageFullName =
//         makeFullName(
//           firstName || user.firstName,
//           middleName ||
//             user.middleName,
//           lastName || user.lastName,
//         ) || 'talent-profile';

//       const uploaded =
//         await processAndUploadImage(
//           req.files.profilePicture[0],
//           'jobseeker-profile/',
//           imageFullName,
//         );

//       profilePictureUrl =
//         Array.isArray(uploaded)
//           ? uploaded[0]
//           : uploaded;
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | RESUME
//     |--------------------------------------------------------------------------
//     */

//     let resumeUrl =
//       user.resume || null;

//     if (
//       req.files &&
//       req.files.resume &&
//       req.files.resume.length > 0
//     ) {
//       if (resumeUrl) {
//         try {
//           await deleteFileFromS3(
//             resumeUrl,
//             'jobseeker-resume/',
//           );
//         } catch (error) {
//           console.warn(
//             'Failed to delete old resume:',
//             error.message,
//           );
//         }
//       }

//       resumeUrl =
//         await uploadFileToS3(
//           req.files.resume[0],
//           'jobseeker-resume/',
//         );
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | UPDATE FIELDS
//     |--------------------------------------------------------------------------
//     */

//     if (isProvided(firstName)) {
//       user.firstName = firstName;
//     }

//     if (isProvided(middleName)) {
//       user.middleName =
//         middleName || '';
//     }

//     if (isProvided(lastName)) {
//       user.lastName = lastName;
//     }

//     if (
//       isProvided(firstName) ||
//       isProvided(middleName) ||
//       isProvided(lastName)
//     ) {
//       user.fullName = makeFullName(
//         user.firstName,
//         user.middleName,
//         user.lastName,
//       );
//     } else if (isProvided(fullName)) {
//       user.fullName = fullName;
//     }

//     if (isProvided(summary)) {
//       user.summary = summary;
//     }

//     if (isProvided(location)) {
//       user.location = location;
//     }

//     if (isProvided(country)) {
//       user.country = country;
//     }

//     if (isProvided(city)) {
//       user.city = city;
//     }

//     if (isProvided(technicalSkills)) {
//       user.technicalSkills =
//         parseIfJson(technicalSkills);
//     }

//     if (isProvided(otherSkills)) {
//       user.otherSkills =
//         parseIfJson(otherSkills);
//     }

//     if (isProvided(experience)) {
//       user.experience =
//         parseIfJson(experience);
//     }

//     if (isProvided(projects)) {
//       user.projects =
//         parseIfJson(projects);
//     }

//     if (isProvided(education)) {
//       user.education =
//         parseIfJson(education);
//     }

//     if (isProvided(typeOfJob)) {
//       user.typeOfJob = typeOfJob;
//     }

//     if (isProvided(github)) {
//       user.github = github;
//     }

//     if (isProvided(linkedin)) {
//       user.linkedin = linkedin;
//     }

//     if (isProvided(portfolio)) {
//       user.portfolio = portfolio;
//     }

//     if (isProvided(userType)) {
//       user.userType = userType;
//     }

//     if (isProvided(phoneNumber)) {
//       user.phoneNumber =
//         phoneNumber === ''
//           ? ''
//           : String(phoneNumber);
//     }

//     if (isProvided(expectedPrice)) {
//       user.expectedPrice =
//         parseIfJson(expectedPrice);
//     }

//     if (isProvided(talentFormIndex)) {
//       user.talentFormIndex =
//         String(talentFormIndex);
//     }

//     if (
//       isProvided(
//         talentOnboadCompleted,
//       )
//     ) {
//       user.talentOnboadCompleted =
//         toBoolean(
//           talentOnboadCompleted,
//         );
//     }

//     if (profilePictureUrl) {
//       user.profilePicture =
//         profilePictureUrl;
//     }

//     if (resumeUrl) {
//       user.resume = resumeUrl;
//     }

//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message:
//         'User updated successfully',

//       user: {
//         _id: user._id,
//         email: user.email,

//         firstName:
//           user.firstName,

//         middleName:
//           user.middleName,

//         lastName:
//           user.lastName,

//         fullName:
//           user.fullName,

//         summary:
//           user.summary,

//         location:
//           user.location,

//         country:
//           user.country,

//         city:
//           user.city,

//         resume:
//           user.resume,

//         technicalSkills:
//           user.technicalSkills,

//         otherSkills:
//           user.otherSkills,

//         experience:
//           user.experience,

//         expectedPrice:
//           user.expectedPrice,

//         projects:
//           user.projects,

//         education:
//           user.education,

//         typeOfJob:
//           user.typeOfJob,

//         github:
//           user.github,

//         linkedin:
//           user.linkedin,

//         portfolio:
//           user.portfolio,

//         profilePicture:
//           user.profilePicture,

//         userType:
//           user.userType,

//         phoneNumber:
//           isProvided(
//             user.phoneNumber,
//           )
//             ? String(
//                 user.phoneNumber,
//               )
//             : '',

//         talentFormIndex:
//           user.talentFormIndex,

//         talentOnboadCompleted:
//           user.talentOnboadCompleted,
//       },
//     });
//   } catch (error) {
//     console.error(
//       'UPDATE USER ERROR:',
//       error,
//     );

//     return res.status(500).json({
//       error: 'Server error',
//       details: error.message,
//     });
//   }
// };

// /*
// |--------------------------------------------------------------------------
// | FILTER USERS
// |--------------------------------------------------------------------------
// */

// const filterUsers = async (
//   req,
//   res,
// ) => {
//   try {
//     const {
//       skills,
//       typeOfJob,
//       location,
//       createdAtFrom,
//       createdAtTo,
//       page = 1,
//     } = req.body;

//     const filter = {};

//     if (skills) {
//       const skillsArray =
//         skills.split(',');

//       const skillFilters =
//         skillsArray.map(
//           (skillExpPair) => {
//             const [skill, exp] =
//               skillExpPair.split(':');

//             return {
//               skill: skill.trim(),
//               exp: {
//                 $gte: Number(exp),
//               },
//             };
//           },
//         );

//       filter.technicalSkills = {
//         $elemMatch: {
//           $or: skillFilters,
//         },
//       };
//     }

//     if (typeOfJob) {
//       filter.typeOfJob =
//         typeOfJob;
//     }

//     if (location) {
//       filter.location =
//         location;
//     }

//     if (
//       createdAtFrom &&
//       createdAtTo
//     ) {
//       const startDate =
//         new Date(createdAtFrom);

//       const endDate =
//         new Date(createdAtTo);

//       const startOfDay =
//         new Date(
//           startDate.setHours(
//             0,
//             0,
//             0,
//             0,
//           ),
//         );

//       const endOfDay =
//         new Date(
//           endDate.setHours(
//             23,
//             59,
//             59,
//             999,
//           ),
//         );

//       filter.createdAt = {
//         $gte: startOfDay,
//         $lte: endOfDay,
//       };
//     }

//     const limit = 20;

//     const currentPage =
//       Number(page) || 1;

//     const skip =
//       (currentPage - 1) *
//       limit;

//     const users =
//       await Jobseeker.find(
//         filter,
//       )
//         .skip(skip)
//         .limit(limit)
//         .select(
//           '-password -otp -otpExpiration -__v',
//         );

//     const totalCount =
//       await Jobseeker.countDocuments(
//         filter,
//       );

//     return res.status(200).json({
//       message:
//         'Filtered users retrieved successfully',

//       users,

//       pagination: {
//         currentPage,
//         totalPages: Math.ceil(
//           totalCount / limit,
//         ),
//         totalUsers:
//           totalCount,
//       },
//     });
//   } catch (error) {
//     console.error(
//       'FILTER USERS ERROR:',
//       error,
//     );

//     return res.status(500).json({
//       error: 'Server error',
//       details: error.message,
//     });
//   }
// };

// /*
// |--------------------------------------------------------------------------
// | EXPORTS
// |--------------------------------------------------------------------------
// */

// module.exports = {
//   loginUser,
//   signupUser,
//   forgetPassword,
//   resetPassword,

//   home,
//   addUser,
//   getUsers,
//   getUserById,
//   deleteUser,
//   updateUser,
//   filterUsers,
// };













const { UserBase } = require('../models/authModel');
const { Jobseeker } = require('../models/jobseekerModel');

const {
  loginUser,
  signupUser,
  forgetPassword,
  resetPassword,
} = require('./authController');

const {
  uploadFileToS3,
  deleteFileFromS3,
  processAndUploadImage,
} = require('../utils/awsS3');

/*
|--------------------------------------------------------------------------
| COMMON HELPERS
|--------------------------------------------------------------------------
*/

const isProvided = value =>
  value !== undefined &&
  value !== null;

const toBoolean = value => {
  if (
    value === true ||
    value === 'true'
  ) {
    return true;
  }

  if (
    value === false ||
    value === 'false'
  ) {
    return false;
  }

  return Boolean(value);
};

const parseIfJson = value => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return value;
  }

  if (
    (
      trimmed.startsWith('{') &&
      trimmed.endsWith('}')
    ) ||
    (
      trimmed.startsWith('[') &&
      trimmed.endsWith(']')
    )
  ) {
    try {
      return JSON.parse(trimmed);
    } catch (error) {
      return value;
    }
  }

  return value;
};

const makeFullName = (
  firstName = '',
  middleName = '',
  lastName = '',
) =>
  [
    firstName,
    middleName,
    lastName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

/*
|--------------------------------------------------------------------------
| PARSE MULTIPART ARRAY FIELDS
|--------------------------------------------------------------------------
|
| Supports keys such as:
|
| education[0][university]
| education[0][degree]
|
| certification[0][title]
|
*/

const extractIndexedArray = (
  body,
  prefix,
) => {
  const result = [];

  const regex = new RegExp(
    `^${prefix}\\[(\\d+)\\]\\[([^\\]]+)\\]$`,
  );

  Object.entries(body || {}).forEach(
    ([key, value]) => {
      const match = key.match(regex);

      if (!match) {
        return;
      }

      const index =
        Number(match[1]);

      const property =
        match[2];

      if (!result[index]) {
        result[index] = {};
      }

      result[index][property] =
        value;
    },
  );

  return result.filter(Boolean);
};

/*
|--------------------------------------------------------------------------
| NORMALIZE TECHNICAL SKILLS
|--------------------------------------------------------------------------
*/

const normalizeTechnicalSkills = value => {
  const parsed =
    parseIfJson(value);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .filter(
      item =>
        item &&
        typeof item === 'object' &&
        item.skill,
    )
    .map(item => {
      const experience =
        item.experience !== undefined
          ? String(
              item.experience,
            )
          : item.exp !== undefined
            ? String(
                item.exp,
              )
            : '';

      const expNumber =
        item.exp !== undefined
          ? Number(item.exp)
          : item.experience !==
              undefined
            ? Number(
                item.experience,
              )
            : 0;

      return {
        skill:
          String(
            item.skill || '',
          ).trim(),

        experience,

        // Keep legacy field synchronized
        exp:
          Number.isFinite(
            expNumber,
          )
            ? expNumber
            : 0,
      };
    });
};

/*
|--------------------------------------------------------------------------
| NORMALIZE OTHER / SOFT SKILLS
|--------------------------------------------------------------------------
|
| Prevent complete talent object from accidentally
| being stored inside otherSkills.
|
*/

const normalizeOtherSkills = value => {
  const parsed =
    parseIfJson(value);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map(item => {
      if (
        typeof item === 'string'
      ) {
        return item.trim();
      }

      if (
        item &&
        typeof item === 'object'
      ) {
        if (
          typeof item.name ===
          'string'
        ) {
          return item.name.trim();
        }

        if (
          typeof item.skill ===
          'string'
        ) {
          return item.skill.trim();
        }
      }

      return '';
    })
    .filter(Boolean);
};

/*
|--------------------------------------------------------------------------
| NORMALIZE EXPERIENCE
|--------------------------------------------------------------------------
*/

const normalizeExperience = value => {
  const parsed =
    parseIfJson(value);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .filter(
      item =>
        item &&
        typeof item === 'object',
    )
    .map(item => ({
      companyName:
        String(
          item.companyName || '',
        ).trim(),

      designation:
        String(
          item.designation || '',
        ).trim(),

      workSince:
        item.workSince
          ? String(
              item.workSince,
            )
          : '',

      workTill:
        item.workTill
          ? String(
              item.workTill,
            )
          : '',

      currentlyWorking:
        toBoolean(
          item.currentlyWorking,
        ),

      description:
        item.description
          ? String(
              item.description,
            )
          : '',

      totalYearsOfExperience:
        Number(
          item.totalYearsOfExperience,
        ) || 0,

      // Legacy fields
      duration:
        item.duration || null,

      industry:
        Array.isArray(
          item.industry,
        )
          ? item.industry
          : [],
    }));
};

/*
|--------------------------------------------------------------------------
| NORMALIZE PROJECTS
|--------------------------------------------------------------------------
*/

const normalizeProjects = value => {
  const parsed =
    parseIfJson(value);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .filter(
      item =>
        item &&
        typeof item === 'object',
    )
    .map(item => ({
      // Current frontend
      projectTitle:
        String(
          item.projectTitle ||
            item.title ||
            '',
        ).trim(),

      year:
        item.year
          ? String(
              item.year,
            )
          : '',

      projectLink:
        String(
          item.projectLink ||
            '',
        ).trim(),

      technicalSkillUsed:
        Array.isArray(
          item.technicalSkillUsed,
        )
          ? item.technicalSkillUsed
          : [],

      projectDescription:
        String(
          item.projectDescription ||
            item.Projectdescription ||
            '',
        ),

      // Legacy fields
      title:
        String(
          item.title ||
            item.projectTitle ||
            '',
        ).trim(),

      date:
        item.date || null,

      Projectdescription:
        String(
          item.Projectdescription ||
            item.projectDescription ||
            '',
        ),
    }));
};

/*
|--------------------------------------------------------------------------
| NORMALIZE EDUCATION
|--------------------------------------------------------------------------
*/

const normalizeEducation = (
  value,
  body,
) => {
  let parsed =
    parseIfJson(value);

  if (!Array.isArray(parsed)) {
    parsed =
      extractIndexedArray(
        body,
        'education',
      );
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .filter(
      item =>
        item &&
        typeof item === 'object' &&
        item.university,
    )
    .map(item => ({
      university:
        String(
          item.university ||
            '',
        ).trim(),

      degree:
        String(
          item.degree || '',
        ),

      specialization:
        String(
          item.specialization ||
            item.Specialization ||
            '',
        ),

      passingOutYear:
        item.passingOutYear
          ? String(
              item.passingOutYear,
            )
          : '',

      // Legacy
      fieldOfStudy:
        String(
          item.fieldOfStudy ||
            '',
        ),

      Specialization:
        String(
          item.Specialization ||
            item.specialization ||
            '',
        ),

      startDate:
        item.startDate ||
        null,

      endDate:
        item.endDate ||
        null,

      description:
        String(
          item.description ||
            '',
        ),
    }));
};

/*
|--------------------------------------------------------------------------
| NORMALIZE CERTIFICATIONS
|--------------------------------------------------------------------------
*/

const normalizeCertifications = (
  value,
  body,
) => {
  let parsed =
    parseIfJson(value);

  if (!Array.isArray(parsed)) {
    parsed =
      extractIndexedArray(
        body,
        'certification',
      );
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .filter(
      item =>
        item &&
        typeof item === 'object',
    )
    .map(item => ({
      title:
        String(
          item.title || '',
        ),

      issuedBy:
        String(
          item.issuedBy || '',
        ),

      issuedDate:
        item.issuedDate ||
        null,

      website:
        String(
          item.website || '',
        ),

      uploadCertificate:
        typeof item.uploadCertificate ===
        'string'
          ? item.uploadCertificate
          : '',
    }));
};

/*
|--------------------------------------------------------------------------
| NORMALIZE LANGUAGES
|--------------------------------------------------------------------------
*/

const normalizeLanguages = value => {
  const parsed =
    parseIfJson(value);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .filter(
      item =>
        item &&
        typeof item === 'object',
    )
    .map(item => ({
      language:
        String(
          item.language || '',
        ),

      proficiency:
        String(
          item.proficiency || '',
        ),
    }));
};

/*
|--------------------------------------------------------------------------
| NORMALIZE PREFERENCE
|--------------------------------------------------------------------------
*/

const normalizePreference = value => {
  const parsed =
    parseIfJson(value);

  if (!parsed) {
    return null;
  }

  /*
   * Support legacy array preference
   */
  const data =
    Array.isArray(parsed)
      ? parsed[0]
      : parsed;

  if (
    !data ||
    typeof data !== 'object'
  ) {
    return null;
  }

  return {
    employmentPreference:
      data.employmentPreference ||
      '',

    hoursPerWeek:
      Number(
        data.hoursPerWeek,
      ) || 0,

    desiredSalary: {
      currency:
        data.desiredSalary
          ?.currency ||
        '',

      price:
        Number(
          data.desiredSalary
            ?.price,
        ) || 0,
    },

    availableHours: {
      from:
        data.availableHours
          ?.from ||
        '',

      to:
        data.availableHours
          ?.to ||
        '',
    },

    // Legacy values preserved
    typeOfJob:
      data.typeOfJob || '',

    availableToWork:
      data.availableToWork ||
      '',

    hourlyRate:
      data.hourlyRate || '',
  };
};

/*
|--------------------------------------------------------------------------
| HOME
|--------------------------------------------------------------------------
*/

const home = async (
  req,
  res,
) => {
  try {
    const { email } =
      req.user;

    return res
      .status(200)
      .json({
        message:
          `Welcome, ${email}`,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        message:
          'Server error',
        error:
          error.message,
      });
  }
};

/*
|--------------------------------------------------------------------------
| ADD / UPDATE TALENT
|--------------------------------------------------------------------------
*/

const addUser = async (
  req,
  res,
) => {
  try {
    const userId =
      req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            'User ID not found in token',
        });
    }

    const user =
      await UserBase.findById(
        userId,
      );

    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          error:
            'User not found',
        });
    }

    /*
    |--------------------------------------------------------------------------
    | BODY
    |--------------------------------------------------------------------------
    */

    const {
      firstName,
      middleName,
      lastName,

      summary,
      profileSummary,

      phoneNumber,
      location,
      country,
      city,
      gender,
      dateOfBirth,

      technicalSkills,
      otherSkills,
      experience,
      roles,

      projects,

      education,
      certification,

      languages,

      preference,
      socialLinks,
      expectedPrice,

      github,
      linkedin,
      portfolio,

      talentFormIndex,

      talentOnboadCompleted,
      onboardingCompleted,
    } = req.body;

    let jobseeker =
      await Jobseeker.findOne({
        user: userId,
      });

    /*
    |--------------------------------------------------------------------------
    | FILE UPLOADS
    |--------------------------------------------------------------------------
    */

    let profilePictureUrl =
      null;

    let resumeUrl =
      null;

    const certificationUrls =
      [];

    if (
      req.files
        ?.profilePicture
        ?.length
    ) {
      const imageName =
        makeFullName(
          firstName ||
            jobseeker
              ?.firstName ||
            user.firstName,

          middleName ||
            jobseeker
              ?.middleName ||
            user.middleName,

          lastName ||
            jobseeker
              ?.lastName ||
            user.lastName,
        ) ||
        'talent-profile';

      const uploaded =
        await processAndUploadImage(
          req.files
            .profilePicture[0],

          'jobseeker-profile/',

          imageName,
        );

      profilePictureUrl =
        Array.isArray(
          uploaded,
        )
          ? uploaded[0] ||
            null
          : uploaded ||
            null;
    }

    if (
      req.files
        ?.resume
        ?.length
    ) {
      resumeUrl =
        await uploadFileToS3(
          req.files
            .resume[0],

          'jobseeker-resume/',
        );
    }

    if (
      req.files
        ?.uploadCertificate
        ?.length
    ) {
      for (
        const file of
        req.files
          .uploadCertificate
      ) {
        const uploadedUrl =
          await uploadFileToS3(
            file,
            'jobseeker-certification/',
          );

        if (uploadedUrl) {
          certificationUrls.push(
            uploadedUrl,
          );
        }
      }
    }

    /*
    |--------------------------------------------------------------------------
    | NORMALIZATION
    |--------------------------------------------------------------------------
    */

    const normalizedTechnicalSkills =
      normalizeTechnicalSkills(
        technicalSkills,
      );

    const normalizedOtherSkills =
      normalizeOtherSkills(
        otherSkills,
      );

    const normalizedExperience =
      normalizeExperience(
        experience,
      );

    const normalizedProjects =
      normalizeProjects(
        projects,
      );

    const normalizedEducation =
      normalizeEducation(
        education,
        req.body,
      );

    const normalizedCertification =
      normalizeCertifications(
        certification,
        req.body,
      );

    const normalizedLanguages =
      normalizeLanguages(
        languages,
      );

    const normalizedPreference =
      normalizePreference(
        preference,
      );

    const parsedRoles =
      parseIfJson(roles);

    const parsedSocialLinks =
      parseIfJson(
        socialLinks,
      );

    const parsedExpectedPrice =
      parseIfJson(
        expectedPrice,
      );

    /*
    |--------------------------------------------------------------------------
    | Attach uploaded certificates to certifications
    |--------------------------------------------------------------------------
    */

    certificationUrls.forEach(
      (
        url,
        index,
      ) => {
        if (
          normalizedCertification[
            index
          ]
        ) {
          normalizedCertification[
            index
          ].uploadCertificate =
            url;
        }
      },
    );

    /*
    |--------------------------------------------------------------------------
    | CREATE PROFILE
    |--------------------------------------------------------------------------
    */

    if (!jobseeker) {
      const finalFirstName =
        firstName ||
        user.firstName ||
        '';

      const finalMiddleName =
        middleName ||
        user.middleName ||
        '';

      const finalLastName =
        lastName ||
        user.lastName ||
        '';

      if (
        !finalFirstName ||
        !finalLastName
      ) {
        return res
          .status(400)
          .json({
            success:
              false,

            error:
              'First name and last name are required to create talent profile',
          });
      }

      jobseeker =
        new Jobseeker({
          user: userId,

          email:
            user.email,

          firstName:
            finalFirstName,

          middleName:
            finalMiddleName,

          lastName:
            finalLastName,

          fullName:
            makeFullName(
              finalFirstName,
              finalMiddleName,
              finalLastName,
            ),

          phoneNumber:
            isProvided(
              phoneNumber,
            )
              ? String(
                  phoneNumber,
                )
              : '',

          gender:
            gender || '',

          dateOfBirth:
            dateOfBirth ||
            null,

          country:
            country || '',

          city:
            city || '',

          summary:
            profileSummary ||
            summary ||
            '',

          profileSummary:
            profileSummary ||
            summary ||
            '',

          profilePicture:
            profilePictureUrl,

          resume:
            resumeUrl,

          github:
            github || '',

          linkedin:
            linkedin ||
            '',

          portfolio:
            portfolio ||
            '',

          talentFormIndex:
            isProvided(
              talentFormIndex,
            )
              ? String(
                  talentFormIndex,
                )
              : '1',

          talentOnboadCompleted:
            isProvided(
              talentOnboadCompleted,
            )
              ? toBoolean(
                  talentOnboadCompleted,
                )
              : isProvided(
                    onboardingCompleted,
                  )
                ? toBoolean(
                    onboardingCompleted,
                  )
                : false,

          onboardingCompleted:
            isProvided(
              onboardingCompleted,
            )
              ? toBoolean(
                  onboardingCompleted,
                )
              : isProvided(
                    talentOnboadCompleted,
                  )
                ? toBoolean(
                    talentOnboadCompleted,
                  )
                : false,
        });

      if (
        isProvided(
          technicalSkills,
        )
      ) {
        jobseeker.technicalSkills =
          normalizedTechnicalSkills;
      }

      if (
        isProvided(
          otherSkills,
        )
      ) {
        jobseeker.otherSkills =
          normalizedOtherSkills;
      }

      if (
        isProvided(
          experience,
        )
      ) {
        jobseeker.experience =
          normalizedExperience;
      }

      if (
        isProvided(roles) &&
        Array.isArray(
          parsedRoles,
        )
      ) {
        jobseeker.roles =
          parsedRoles;
      }

      if (
        isProvided(projects)
      ) {
        jobseeker.projects =
          normalizedProjects;
      }

      if (
        isProvided(
          education,
        ) ||
        normalizedEducation
          .length
      ) {
        jobseeker.education =
          normalizedEducation;
      }

      if (
        isProvided(
          certification,
        ) ||
        normalizedCertification
          .length
      ) {
        jobseeker.certification =
          normalizedCertification;
      }

      if (
        isProvided(languages)
      ) {
        jobseeker.languages =
          normalizedLanguages;
      }

      if (
        normalizedPreference
      ) {
        jobseeker.preference =
          normalizedPreference;
      }

      if (
        Array.isArray(
          parsedSocialLinks,
        )
      ) {
        jobseeker.socialLinks =
          parsedSocialLinks;
      }

      if (
        Array.isArray(
          parsedExpectedPrice,
        )
      ) {
        jobseeker.expectedPrice =
          parsedExpectedPrice;
      }

      await jobseeker.save();

      console.log(
        'TALENT PROFILE CREATED:',
        {
          id:
            jobseeker._id,

          talentFormIndex:
            jobseeker
              .talentFormIndex,

          completed:
            jobseeker
              .talentOnboadCompleted,
        },
      );

      return res
        .status(200)
        .json({
          success: true,

          message:
            'Profile created successfully',

          jobseeker,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE EXISTING PROFILE
    |--------------------------------------------------------------------------
    */

    if (
      isProvided(
        firstName,
      )
    ) {
      jobseeker.firstName =
        firstName;
    }

    if (
      isProvided(
        middleName,
      )
    ) {
      jobseeker.middleName =
        middleName || '';
    }

    if (
      isProvided(
        lastName,
      )
    ) {
      jobseeker.lastName =
        lastName;
    }

    if (
      isProvided(
        firstName,
      ) ||
      isProvided(
        middleName,
      ) ||
      isProvided(
        lastName,
      )
    ) {
      jobseeker.fullName =
        makeFullName(
          jobseeker.firstName,
          jobseeker.middleName,
          jobseeker.lastName,
        );
    }

    jobseeker.email =
      user.email;

    /*
    |--------------------------------------------------------------------------
    | BASIC DETAILS
    |--------------------------------------------------------------------------
    */

    if (
      isProvided(
        profileSummary,
      ) ||
      isProvided(summary)
    ) {
      const finalSummary =
        profileSummary ??
        summary ??
        '';

      jobseeker.summary =
        finalSummary;

      jobseeker.profileSummary =
        finalSummary;
    }

    if (
      isProvided(
        phoneNumber,
      )
    ) {
      jobseeker.phoneNumber =
        phoneNumber === ''
          ? ''
          : String(
              phoneNumber,
            );
    }

    if (
      isProvided(country)
    ) {
      jobseeker.country =
        country;
    }

    if (
      isProvided(city)
    ) {
      jobseeker.city =
        city;
    }

    /*
     * Preserve old location structure only if valid.
     */
    if (
      isProvided(location)
    ) {
      const parsedLocation =
        parseIfJson(
          location,
        );

      if (
        Array.isArray(
          parsedLocation,
        )
      ) {
        jobseeker.location =
          parsedLocation;
      }
    }

    if (
      isProvided(gender)
    ) {
      jobseeker.gender =
        gender;
    }

    if (
      isProvided(
        dateOfBirth,
      )
    ) {
      jobseeker.dateOfBirth =
        dateOfBirth ||
        null;
    }

    /*
    |--------------------------------------------------------------------------
    | SOCIAL
    |--------------------------------------------------------------------------
    */

    if (
      isProvided(github)
    ) {
      jobseeker.github =
        github || '';
    }

    if (
      isProvided(linkedin)
    ) {
      jobseeker.linkedin =
        linkedin || '';
    }

    if (
      isProvided(portfolio)
    ) {
      jobseeker.portfolio =
        portfolio || '';
    }

    /*
    |--------------------------------------------------------------------------
    | FILES
    |--------------------------------------------------------------------------
    */

    if (
      profilePictureUrl
    ) {
      jobseeker.profilePicture =
        profilePictureUrl;
    }

    if (resumeUrl) {
      jobseeker.resume =
        resumeUrl;
    }

    /*
    |--------------------------------------------------------------------------
    | WORK EXPERIENCE
    |--------------------------------------------------------------------------
    */

    if (
      isProvided(
        technicalSkills,
      )
    ) {
      jobseeker.technicalSkills =
        normalizedTechnicalSkills;
    }

    if (
      isProvided(
        otherSkills,
      )
    ) {
      jobseeker.otherSkills =
        normalizedOtherSkills;
    }

    if (
      isProvided(
        experience,
      )
    ) {
      jobseeker.experience =
        normalizedExperience;
    }

    if (
      isProvided(roles) &&
      Array.isArray(
        parsedRoles,
      )
    ) {
      jobseeker.roles =
        parsedRoles;
    }

    /*
    |--------------------------------------------------------------------------
    | EDUCATION
    |--------------------------------------------------------------------------
    */

    if (
      isProvided(
        education,
      ) ||
      normalizedEducation
        .length
    ) {
      jobseeker.education =
        normalizedEducation;
    }

    if (
      isProvided(
        certification,
      ) ||
      normalizedCertification
        .length ||
      certificationUrls
        .length
    ) {
      jobseeker.certification =
        normalizedCertification;
    }

    /*
    |--------------------------------------------------------------------------
    | PROJECTS / LANGUAGES
    |--------------------------------------------------------------------------
    */

    if (
      isProvided(projects)
    ) {
      jobseeker.projects =
        normalizedProjects;
    }

    if (
      isProvided(languages)
    ) {
      jobseeker.languages =
        normalizedLanguages;
    }

    /*
    |--------------------------------------------------------------------------
    | PREFERENCE
    |--------------------------------------------------------------------------
    */

    if (
      normalizedPreference
    ) {
      jobseeker.preference =
        normalizedPreference;
    }

    /*
    |--------------------------------------------------------------------------
    | LEGACY FIELDS
    |--------------------------------------------------------------------------
    */

    if (
      Array.isArray(
        parsedSocialLinks,
      )
    ) {
      jobseeker.socialLinks =
        parsedSocialLinks;
    }

    if (
      Array.isArray(
        parsedExpectedPrice,
      )
    ) {
      jobseeker.expectedPrice =
        parsedExpectedPrice;
    }

    /*
    |--------------------------------------------------------------------------
    | ONBOARDING STEP
    |--------------------------------------------------------------------------
    */

    if (
      isProvided(
        talentFormIndex,
      )
    ) {
      jobseeker.talentFormIndex =
        String(
          talentFormIndex,
        );
    }

    /*
    |--------------------------------------------------------------------------
    | ONBOARDING COMPLETED
    |--------------------------------------------------------------------------
    */

    if (
      isProvided(
        talentOnboadCompleted,
      )
    ) {
      const completed =
        toBoolean(
          talentOnboadCompleted,
        );

      jobseeker.talentOnboadCompleted =
        completed;

      jobseeker.onboardingCompleted =
        completed;
    } else if (
      isProvided(
        onboardingCompleted,
      )
    ) {
      const completed =
        toBoolean(
          onboardingCompleted,
        );

      jobseeker.onboardingCompleted =
        completed;

      jobseeker.talentOnboadCompleted =
        completed;
    }

    /*
    |--------------------------------------------------------------------------
    | SAVE
    |--------------------------------------------------------------------------
    */

    await jobseeker.save();

    console.log(
      'TALENT PROFILE UPDATED:',
      {
        id:
          jobseeker._id,

        technicalSkills:
          jobseeker
            .technicalSkills,

        experience:
          jobseeker
            .experience,

        talentFormIndex:
          jobseeker
            .talentFormIndex,

        talentOnboadCompleted:
          jobseeker
            .talentOnboadCompleted,

        onboardingCompleted:
          jobseeker
            .onboardingCompleted,
      },
    );

    return res
      .status(200)
      .json({
        success: true,

        message:
          'Profile updated successfully',

        jobseeker,

        onboardingCompleted:
          jobseeker
            .onboardingCompleted ===
            true,
      });
  } catch (error) {
    console.error(
      'ADD / UPDATE TALENT ERROR:',
      error,
    );

    console.error(
      'ADD / UPDATE TALENT ERROR MESSAGE:',
      error.message,
    );

    if (error.errors) {
      console.error(
        'MONGOOSE VALIDATION ERRORS:',
        Object.keys(
          error.errors,
        ).reduce(
          (
            output,
            key,
          ) => {
            output[key] =
              error.errors[
                key
              ].message;

            return output;
          },
          {},
        ),
      );
    }

    return res
      .status(500)
      .json({
        success: false,

        error:
          'Server error',

        details:
          error.message,

        validationErrors:
          process.env
            .NODE_ENV ===
          'development'
            ? error.errors
            : undefined,
      });
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL USERS
|--------------------------------------------------------------------------
*/

const getUsers = async (
  req,
  res,
) => {
  try {
    const page =
      parseInt(
        req.query.page,
        10,
      ) || 1;

    const limit =
      parseInt(
        req.query.limit,
        10,
      ) || 20;

    const users =
      await Jobseeker.find()
        .skip(
          (page - 1) *
            limit,
        )
        .limit(limit);

    const totalUsers =
      await Jobseeker.countDocuments();

    return res
      .status(200)
      .json({
        currentPage:
          page,

        totalPages:
          Math.ceil(
            totalUsers /
              limit,
          ),

        totalUsers,

        users,
      });
  } catch (error) {
    console.error(
      'GET USERS ERROR:',
      error,
    );

    return res
      .status(500)
      .json({
        error:
          'Server error',

        details:
          error.message,
      });
  }
};

/*
|--------------------------------------------------------------------------
| GET USER BY ID
|--------------------------------------------------------------------------
*/

const getUserById =
  async (
    req,
    res,
  ) => {
    try {
      const {
        userId,
      } = req.params;

      const user =
        await Jobseeker.findOne({
          user: userId,
        });

      if (!user) {
        return res
          .status(404)
          .json({
            error:
              'User not found',
          });
      }

      return res
        .status(200)
        .json({
          email:
            user.email,

          firstName:
            user.firstName,

          middleName:
            user.middleName,

          lastName:
            user.lastName,

          fullName:
            user.fullName,

          summary:
            user.profileSummary ||
            user.summary,

          location:
            user.location,

          country:
            user.country,

          city:
            user.city,

          gender:
            user.gender,

          dateOfBirth:
            user.dateOfBirth,

          profilePicture:
            user.profilePicture,

          resume:
            user.resume,

          technicalSkills:
            user.technicalSkills,

          otherSkills:
            user.otherSkills,

          experience:
            user.experience,

          projects:
            user.projects,

          education:
            user.education,

          certification:
            user.certification,

          languages:
            user.languages,

          preference:
            user.preference,

          typeOfJob:
            user.preference
              ?.typeOfJob ||
            '',

          github:
            user.github,

          linkedin:
            user.linkedin,

          portfolio:
            user.portfolio,

          userType:
            user.userType,

          phoneNumber:
            isProvided(
              user.phoneNumber,
            )
              ? String(
                  user.phoneNumber,
                )
              : '',

          talentFormIndex:
            user.talentFormIndex,

          talentOnboadCompleted:
            user.talentOnboadCompleted,

          onboardingCompleted:
            user.onboardingCompleted,
        });
    } catch (error) {
      console.error(
        'GET USER BY ID ERROR:',
        error,
      );

      return res
        .status(500)
        .json({
          error:
            'Server error',

          details:
            error.message,
        });
    }
  };

/*
|--------------------------------------------------------------------------
| DELETE USER
|--------------------------------------------------------------------------
*/

const deleteUser = async (
  req,
  res,
) => {
  try {
    const {
      userId,
    } = req.params;

    let user =
      await Jobseeker.findById(
        userId,
      ).catch(
        () => null,
      );

    if (!user) {
      user =
        await Jobseeker.findOne({
          user: userId,
        });
    }

    if (!user) {
      return res
        .status(404)
        .json({
          error:
            'User not found',
        });
    }

    await user.deleteOne();

    return res
      .status(200)
      .json({
        message:
          'User deleted successfully',
      });
  } catch (error) {
    console.error(
      'DELETE USER ERROR:',
      error,
    );

    return res
      .status(500)
      .json({
        error:
          'Server error',

        details:
          error.message,
      });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE USER
|--------------------------------------------------------------------------
*/

const updateUser = async (
  req,
  res,
) => {
  try {
    const {
      userId,
    } = req.params;

    let user =
      await Jobseeker.findById(
        userId,
      ).catch(
        () => null,
      );

    if (!user) {
      user =
        await Jobseeker.findOne({
          user: userId,
        });
    }

    if (!user) {
      return res
        .status(404)
        .json({
          error:
            'User not found',
        });
    }

    const {
      firstName,
      middleName,
      lastName,
      fullName,

      summary,
      profileSummary,

      location,
      country,
      city,

      technicalSkills,
      otherSkills,
      experience,
      projects,
      education,

      github,
      linkedin,
      portfolio,

      phoneNumber,
      preference,
      expectedPrice,

      talentFormIndex,
      talentOnboadCompleted,
      onboardingCompleted,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | FILES
    |--------------------------------------------------------------------------
    */

    let profilePictureUrl =
      user.profilePicture ||
      null;

    let resumeUrl =
      user.resume ||
      null;

    if (
      req.files
        ?.profilePicture
        ?.length
    ) {
      if (
        profilePictureUrl
      ) {
        try {
          await deleteFileFromS3(
            profilePictureUrl,
            'jobseeker-profile/',
          );
        } catch (error) {
          console.warn(
            'Failed to delete old profile picture:',
            error.message,
          );
        }
      }

      const uploaded =
        await processAndUploadImage(
          req.files
            .profilePicture[0],

          'jobseeker-profile/',

          makeFullName(
            firstName ||
              user.firstName,

            middleName ||
              user.middleName,

            lastName ||
              user.lastName,
          ) ||
            'talent-profile',
        );

      profilePictureUrl =
        Array.isArray(
          uploaded,
        )
          ? uploaded[0]
          : uploaded;
    }

    if (
      req.files
        ?.resume
        ?.length
    ) {
      if (resumeUrl) {
        try {
          await deleteFileFromS3(
            resumeUrl,
            'jobseeker-resume/',
          );
        } catch (error) {
          console.warn(
            'Failed to delete old resume:',
            error.message,
          );
        }
      }

      resumeUrl =
        await uploadFileToS3(
          req.files
            .resume[0],

          'jobseeker-resume/',
        );
    }

    /*
    |--------------------------------------------------------------------------
    | NORMAL FIELD UPDATES
    |--------------------------------------------------------------------------
    */

    if (
      isProvided(firstName)
    ) {
      user.firstName =
        firstName;
    }

    if (
      isProvided(middleName)
    ) {
      user.middleName =
        middleName || '';
    }

    if (
      isProvided(lastName)
    ) {
      user.lastName =
        lastName;
    }

    if (
      isProvided(firstName) ||
      isProvided(middleName) ||
      isProvided(lastName)
    ) {
      user.fullName =
        makeFullName(
          user.firstName,
          user.middleName,
          user.lastName,
        );
    } else if (
      isProvided(fullName)
    ) {
      user.fullName =
        fullName;
    }

    if (
      isProvided(
        profileSummary,
      ) ||
      isProvided(summary)
    ) {
      const finalSummary =
        profileSummary ??
        summary ??
        '';

      user.summary =
        finalSummary;

      user.profileSummary =
        finalSummary;
    }

    if (
      isProvided(country)
    ) {
      user.country =
        country;
    }

    if (
      isProvided(city)
    ) {
      user.city =
        city;
    }

    if (
      isProvided(location)
    ) {
      const parsed =
        parseIfJson(
          location,
        );

      if (
        Array.isArray(
          parsed,
        )
      ) {
        user.location =
          parsed;
      }
    }

    if (
      isProvided(
        technicalSkills,
      )
    ) {
      user.technicalSkills =
        normalizeTechnicalSkills(
          technicalSkills,
        );
    }

    if (
      isProvided(
        otherSkills,
      )
    ) {
      user.otherSkills =
        normalizeOtherSkills(
          otherSkills,
        );
    }

    if (
      isProvided(
        experience,
      )
    ) {
      user.experience =
        normalizeExperience(
          experience,
        );
    }

    if (
      isProvided(projects)
    ) {
      user.projects =
        normalizeProjects(
          projects,
        );
    }

    if (
      isProvided(education)
    ) {
      user.education =
        normalizeEducation(
          education,
          req.body,
        );
    }

    if (
      isProvided(github)
    ) {
      user.github =
        github;
    }

    if (
      isProvided(linkedin)
    ) {
      user.linkedin =
        linkedin;
    }

    if (
      isProvided(portfolio)
    ) {
      user.portfolio =
        portfolio;
    }

    if (
      isProvided(
        phoneNumber,
      )
    ) {
      user.phoneNumber =
        phoneNumber === ''
          ? ''
          : String(
              phoneNumber,
            );
    }

    const normalizedPreference =
      normalizePreference(
        preference,
      );

    if (
      normalizedPreference
    ) {
      user.preference =
        normalizedPreference;
    }

    if (
      isProvided(
        expectedPrice,
      )
    ) {
      const parsed =
        parseIfJson(
          expectedPrice,
        );

      if (
        Array.isArray(
          parsed,
        )
      ) {
        user.expectedPrice =
          parsed;
      }
    }

    if (
      isProvided(
        talentFormIndex,
      )
    ) {
      user.talentFormIndex =
        String(
          talentFormIndex,
        );
    }

    if (
      isProvided(
        talentOnboadCompleted,
      )
    ) {
      const completed =
        toBoolean(
          talentOnboadCompleted,
        );

      user.talentOnboadCompleted =
        completed;

      user.onboardingCompleted =
        completed;
    } else if (
      isProvided(
        onboardingCompleted,
      )
    ) {
      const completed =
        toBoolean(
          onboardingCompleted,
        );

      user.onboardingCompleted =
        completed;

      user.talentOnboadCompleted =
        completed;
    }

    if (
      profilePictureUrl
    ) {
      user.profilePicture =
        profilePictureUrl;
    }

    if (resumeUrl) {
      user.resume =
        resumeUrl;
    }

    await user.save();

    return res
      .status(200)
      .json({
        success: true,

        message:
          'User updated successfully',

        user,
      });
  } catch (error) {
    console.error(
      'UPDATE USER ERROR:',
      error,
    );

    return res
      .status(500)
      .json({
        success: false,

        error:
          'Server error',

        details:
          error.message,
      });
  }
};

/*
|--------------------------------------------------------------------------
| FILTER USERS
|--------------------------------------------------------------------------
*/

const filterUsers = async (
  req,
  res,
) => {
  try {
    const {
      skills,
      typeOfJob,
      location,
      createdAtFrom,
      createdAtTo,
      page = 1,
    } = req.body;

    const filter = {};

    if (skills) {
      const skillsArray =
        skills.split(',');

      const skillFilters =
        skillsArray.map(
          item => {
            const [
              skill,
              exp,
            ] =
              item.split(
                ':',
              );

            return {
              skill:
                skill.trim(),

              exp: {
                $gte:
                  Number(
                    exp,
                  ),
              },
            };
          },
        );

      filter.technicalSkills =
        {
          $elemMatch: {
            $or:
              skillFilters,
          },
        };
    }

    if (typeOfJob) {
      filter[
        'preference.typeOfJob'
      ] =
        typeOfJob;
    }

    if (location) {
      filter.$or = [
        {
          country:
            location,
        },

        {
          city:
            location,
        },

        {
          'location.country':
            location,
        },

        {
          'location.city':
            location,
        },
      ];
    }

    if (
      createdAtFrom &&
      createdAtTo
    ) {
      const startDate =
        new Date(
          createdAtFrom,
        );

      const endDate =
        new Date(
          createdAtTo,
        );

      startDate.setHours(
        0,
        0,
        0,
        0,
      );

      endDate.setHours(
        23,
        59,
        59,
        999,
      );

      filter.createdAt =
        {
          $gte:
            startDate,

          $lte:
            endDate,
        };
    }

    const limit = 20;

    const currentPage =
      Number(page) || 1;

    const skip =
      (
        currentPage -
        1
      ) * limit;

    const users =
      await Jobseeker.find(
        filter,
      )
        .skip(skip)
        .limit(limit)
        .select(
          '-password -otp -otpExpiration -__v',
        );

    const totalCount =
      await Jobseeker.countDocuments(
        filter,
      );

    return res
      .status(200)
      .json({
        message:
          'Filtered users retrieved successfully',

        users,

        pagination: {
          currentPage,

          totalPages:
            Math.ceil(
              totalCount /
                limit,
            ),

          totalUsers:
            totalCount,
        },
      });
  } catch (error) {
    console.error(
      'FILTER USERS ERROR:',
      error,
    );

    return res
      .status(500)
      .json({
        error:
          'Server error',

        details:
          error.message,
      });
  }
};

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  loginUser,
  signupUser,
  forgetPassword,
  resetPassword,

  home,
  addUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  filterUsers,
};