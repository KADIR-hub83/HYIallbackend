// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const jobseekerSchema = new Schema(
//   {
//     firstName: {
//       type: String,
//     },
//     lastName: {
//       type: String,
//     },
//     fullName: {
//       type: String,
//     },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'UserBase',
//       required: true,
//       unique: true,
//     },

//     profilePicture: {
//       type: String,
//       default: null,
//     },
//     phoneNumber: {
//       type: Number,
//     },
//     location: [
//       {
//         country: {
//           type: String,
//         },
//         city: {
//           type: String,
//         },
//         timezone: {
//           type: String,
//         },
//       },
//     ],
//     summary: {
//       type: String,
//       default: null,
//     },
//     resume: {
//       type: String,
//       default: null,
//     },
//     technicalSkills: [
//       {
//         skill: {
//           type: String,
//           required: true,
//         },
//         exp: {
//           type: Number,
//           required: true,
//         },
//       },
//     ],
//     otherSkills: {
//       type: Array,
//       default: [],
//     },
//     experience: [
//       {
//         companyName: {
//           type: String,
//           required: true,
//         },
//         duration: {
//           type: Date,
//           required: true,
//         },
//         designation: {
//           type: String,
//           required: true,
//         },
//         industry: {
//           type: [String],
//           default: [],
//         },
//       },
//     ],
//     roles: [
//       {
//         role: {
//           type: String,
//         },
//         specialities: {
//           type: String,
//         },
//       },
//     ],
//     projects: [
//       {
//         title: { type: String, required: true },
//         date: { type: Date, required: true },
//         projectLink: {
//           type: String,
//           validate: {
//             validator: function (v) {
//               return /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(
//                 v,
//               );
//             },
//             message: (props) => `${props.value} is not a valid URL!`,
//           },
//         },
//         technicalSkillUsed: { type: Array },
//         Projectdescription: { type: String },
//       },
//     ],
//     expectedPrice: [
//       {
//         price: {
//           type: String,
//         },
//         currency: {
//           type: String,
//         },
//       },
//     ],
//     education: [
//       {
//         university: {
//           type: String,
//           required: true,
//         },
//         fieldOfStudy: {
//           type: String,
//         },
//         Specialization: { type: String },
//         startDate: {
//           type: Date,
//           required: true,
//         },
//         endDate: {
//           type: Date,
//           required: true,
//         },
//         description: {
//           type: String,
//         },
//       },
//     ],
//     certification: [
//       {
//         title: { type: String },
//         issuedBy: { type: String },
//         issuedDate: { type: Date },
//         website: {
//           type: String,
//           validate: {
//             validator: function (v) {
//               return /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(
//                 v,
//               );
//             },
//             message: (props) => `${props.value} is not a valid URL!`,
//           },
//         },
//         uploadCertificate: { type: String },
//       },
//     ],
//     preference: [
//       {
//         typeOfJob: {
//           type: String,
//         },
//         availableToWork: {
//           type: String,
//         },
//         hourlyRate: {
//           type: String,
//         },
//       },
//     ],
//     socialLinks: [
//       {
//         github: {
//           type: String,
//           validate: {
//             validator: function (v) {
//               return /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9-_]+\/?$/.test(
//                 v,
//               );
//             },
//             message: (props) => `${props.value} is not a valid GitHub URL!`,
//           },
//         },
//         linkedin: {
//           type: String,
//           validate: {
//             validator: function (v) {
//               return /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9-_]+\/?$/.test(
//                 v,
//               );
//             },
//             message: (props) => `${props.value} is not a valid LinkedIn URL!`,
//           },
//         },
//       },
//     ],
//   },
//   {
//     collection: 'jobseekers', // Explicitly set the collection name
//     timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
//   },
// );
// // Disable required validations for inherited fields
// jobseekerSchema.add({
//   email: { type: String, required: false },
//   password: { type: String, required: false },
// });
// // Create Jobseeker model using the schema
// const Jobseeker = mongoose.model('Jobseeker', jobseekerSchema);

// module.exports = { Jobseeker }; // Ensure UserBase is exported correctly





























// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const jobseekerSchema = new Schema(
//   {
//     firstName: {
//       type: String,
//       default: '',
//     },

//     middleName: {
//       type: String,
//       default: '',
//     },

//     lastName: {
//       type: String,
//       default: '',
//     },

//     fullName: {
//       type: String,
//       default: '',
//     },

//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'UserBase',
//       required: true,
//       unique: true,
//     },

//     profilePicture: {
//       type: String,
//       default: null,
//     },

//     phoneNumber: {
//       type: String,
//       default: '',
//     },

//     location: [
//       {
//         country: {
//           type: String,
//         },

//         city: {
//           type: String,
//         },

//         timezone: {
//           type: String,
//         },
//       },
//     ],

//     // Added because frontend/backend currently also
//     // send country and city separately.
//     country: {
//       type: String,
//       default: '',
//     },

//     city: {
//       type: String,
//       default: '',
//     },

//     gender: {
//       type: String,
//       default: '',
//     },

//     dateOfBirth: {
//       type: Date,
//       default: null,
//     },

//     summary: {
//       type: String,
//       default: null,
//     },

//     // Support the frontend field name too.
//     profileSummary: {
//       type: String,
//       default: '',
//     },

//     resume: {
//       type: String,
//       default: null,
//     },

//     technicalSkills: [
//   {
//     skill: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     // Current frontend field
//     experience: {
//       type: String,
//       default: '',
//     },

//     // Keep old field for backward compatibility
//     exp: {
//       type: Number,
//       required: false,
//       default: 0,
//     },
//   },
// ],

//     otherSkills: {
//       type: Array,
//       default: [],
//     },

//     experience: [
//   {
//     companyName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     designation: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     // Current onboarding frontend fields
//     workSince: {
//       type: String,
//       default: '',
//     },

//     workTill: {
//       type: String,
//       default: '',
//     },

//     currentlyWorking: {
//       type: Boolean,
//       default: false,
//     },

//     description: {
//       type: String,
//       default: '',
//     },

//     totalYearsOfExperience: {
//       type: Number,
//       default: 0,
//     },

//     // Old field preserved — no longer mandatory
//     duration: {
//       type: Date,
//       required: false,
//       default: null,
//     },

//     industry: {
//       type: [String],
//       default: [],
//     },
//   },
// ],

//     roles: [
//       {
//         role: {
//           type: String,
//         },

//         specialities: {
//           type: String,
//         },
//       },
//     ],

//     projects: [
//       {
//         // Existing fields
//         title: {
//           type: String,
//           required: false,
//         },

//         date: {
//           type: Date,
//           required: false,
//         },

//         projectLink: {
//           type: String,
//           validate: {
//             validator: function (v) {
//               if (!v) return true;

//               return /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(
//                 v,
//               );
//             },

//             message: (props) =>
//               `${props.value} is not a valid URL!`,
//           },
//         },

//         technicalSkillUsed: {
//           type: Array,
//           default: [],
//         },

//         Projectdescription: {
//           type: String,
//           default: '',
//         },

//         // Added to support current frontend fields
//         projectTitle: {
//           type: String,
//           default: '',
//         },

//         year: {
//           type: String,
//           default: '',
//         },

//         projectDescription: {
//           type: String,
//           default: '',
//         },
//       },
//     ],

//     expectedPrice: [
//       {
//         price: {
//           type: String,
//         },

//         currency: {
//           type: String,
//         },
//       },
//     ],

//     education: [
//       {
//         university: {
//           type: String,
//           required: true,
//         },

//         fieldOfStudy: {
//           type: String,
//         },

//         Specialization: {
//           type: String,
//         },

//         startDate: {
//           type: Date,
//           required: false,
//         },

//         endDate: {
//           type: Date,
//           required: false,
//         },

//         description: {
//           type: String,
//         },

//         // Added to support current frontend onboarding fields
//         degree: {
//           type: String,
//           default: '',
//         },

//         specialization: {
//           type: String,
//           default: '',
//         },

//         passingOutYear: {
//           type: String,
//           default: '',
//         },
//       },
//     ],

//     certification: [
//       {
//         title: {
//           type: String,
//         },

//         issuedBy: {
//           type: String,
//         },

//         issuedDate: {
//           type: Date,
//         },

//         website: {
//           type: String,
//           validate: {
//             validator: function (v) {
//               if (!v) return true;

//               return /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(
//                 v,
//               );
//             },

//             message: (props) =>
//               `${props.value} is not a valid URL!`,
//           },
//         },

//         uploadCertificate: {
//           type: String,
//         },
//       },
//     ],

//     preference: [
//       {
//         typeOfJob: {
//           type: String,
//         },

//         availableToWork: {
//           type: String,
//         },

//         hourlyRate: {
//           type: String,
//         },

//         // Added to support current frontend structure
//         employmentPreference: {
//           type: String,
//           default: '',
//         },

//         hoursPerWeek: {
//           type: Number,
//           default: 0,
//         },

//         desiredSalary: {
//           currency: {
//             type: String,
//             default: '',
//           },

//           price: {
//             type: Number,
//             default: 0,
//           },
//         },

//         availableHours: {
//           from: {
//             type: String,
//             default: '',
//           },

//           to: {
//             type: String,
//             default: '',
//           },
//         },
//       },
//     ],

//     socialLinks: [
//       {
//         github: {
//           type: String,
//           validate: {
//             validator: function (v) {
//               if (!v) return true;

//               return /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9-_]+\/?$/.test(
//                 v,
//               );
//             },

//             message: (props) =>
//               `${props.value} is not a valid GitHub URL!`,
//           },
//         },

//         linkedin: {
//           type: String,
//           validate: {
//             validator: function (v) {
//               if (!v) return true;

//               return /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9-_]+\/?$/.test(
//                 v,
//               );
//             },

//             message: (props) =>
//               `${props.value} is not a valid LinkedIn URL!`,
//           },
//         },
//       },
//     ],

//     // Direct fields are also used by your newer frontend/API.
//     github: {
//       type: String,
//       default: '',
//     },

//     linkedin: {
//       type: String,
//       default: '',
//     },

//     portfolio: {
//       type: String,
//       default: '',
//     },

//     // -------------------------------
//     // Talent Onboarding
//     // -------------------------------

//     talentFormIndex: {
//       type: String,
//       default: '1',
//     },

//     talentOnboadCompleted: {
//       type: Boolean,
//       default: false,
//     },

//     // Also keep corrected spelling for compatibility.
//     onboardingCompleted: {
//       type: Boolean,
//       default: false,
//     },

//     languages: [
//       {
//         language: {
//           type: String,
//           default: '',
//         },

//         proficiency: {
//           type: String,
//           default: '',
//         },
//       },
//     ],
//   },

//   {
//     collection: 'jobseekers',
//     timestamps: true,
//   },
// );

// // Disable required validations for inherited fields
// jobseekerSchema.add({
//   email: {
//     type: String,
//     required: false,
//   },

//   password: {
//     type: String,
//     required: false,
//   },
// });

// // Keep both completion flags synced
// jobseekerSchema.pre('save', function (next) {
//   if (this.isModified('talentOnboadCompleted')) {
//     this.onboardingCompleted =
//       this.talentOnboadCompleted === true;
//   }

//   if (this.isModified('onboardingCompleted')) {
//     this.talentOnboadCompleted =
//       this.onboardingCompleted === true;
//   }

//   next();
// });

// // Create Jobseeker model using the schema
// const Jobseeker = mongoose.model(
//   'Jobseeker',
//   jobseekerSchema,
// );

// module.exports = { Jobseeker };




























const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/*
|--------------------------------------------------------------------------
| VALIDATION HELPERS
|--------------------------------------------------------------------------
*/

const isValidUrl = value => {
  if (!value) return true;

  try {
    const url = new URL(value);

    return (
      url.protocol === 'http:' ||
      url.protocol === 'https:'
    );
  } catch (error) {
    return false;
  }
};

const isValidGithubUrl = value => {
  if (!value) return true;

  try {
    const url = new URL(value);

    return (
      url.protocol === 'http:' ||
      url.protocol === 'https:'
    ) &&
      (
        url.hostname === 'github.com' ||
        url.hostname === 'www.github.com'
      );
  } catch (error) {
    return false;
  }
};

const isValidLinkedinUrl = value => {
  if (!value) return true;

  try {
    const url = new URL(value);

    return (
      url.protocol === 'http:' ||
      url.protocol === 'https:'
    ) &&
      (
        url.hostname === 'linkedin.com' ||
        url.hostname === 'www.linkedin.com'
      );
  } catch (error) {
    return false;
  }
};

/*
|--------------------------------------------------------------------------
| JOBSEEKER SCHEMA
|--------------------------------------------------------------------------
*/

const jobseekerSchema = new Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | BASIC ACCOUNT / PERSONAL DETAILS
    |--------------------------------------------------------------------------
    */

    firstName: {
      type: String,
      default: '',
      trim: true,
    },

    middleName: {
      type: String,
      default: '',
      trim: true,
    },

    lastName: {
      type: String,
      default: '',
      trim: true,
    },

    fullName: {
      type: String,
      default: '',
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserBase',
      required: true,
      unique: true,
      index: true,
    },

    profilePicture: {
      type: String,
      default: null,
    },

    phoneNumber: {
      type: String,
      default: '',
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | OLD LOCATION STRUCTURE - PRESERVED
    |--------------------------------------------------------------------------
    */

    location: [
      {
        country: {
          type: String,
          default: '',
        },

        city: {
          type: String,
          default: '',
        },

        timezone: {
          type: String,
          default: '',
        },
      },
    ],

    /*
    |--------------------------------------------------------------------------
    | CURRENT FRONTEND LOCATION FIELDS
    |--------------------------------------------------------------------------
    */

    country: {
      type: String,
      default: '',
      trim: true,
    },

    city: {
      type: String,
      default: '',
      trim: true,
    },

    gender: {
      type: String,
      default: '',
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    summary: {
      type: String,
      default: '',
    },

    profileSummary: {
      type: String,
      default: '',
    },

    resume: {
      type: String,
      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | TECHNICAL SKILLS
    |--------------------------------------------------------------------------
    |
    | Supports:
    |
    | Current frontend:
    | {
    |   skill: "JavaScript",
    |   experience: "2"
    | }
    |
    | Old backend:
    | {
    |   skill: "JavaScript",
    |   exp: 2
    | }
    |
    */

    technicalSkills: [
      {
        skill: {
          type: String,
          required: true,
          trim: true,
        },

        experience: {
          type: String,
          default: '',
        },

        // Old field preserved
        exp: {
          type: Number,
          required: false,
          default: 0,
        },
      },
    ],

    /*
    |--------------------------------------------------------------------------
    | SOFT / OTHER SKILLS
    |--------------------------------------------------------------------------
    */

    otherSkills: {
      type: [String],
      default: [],
    },

    /*
    |--------------------------------------------------------------------------
    | WORK EXPERIENCE
    |--------------------------------------------------------------------------
    |
    | Current frontend fields are preserved.
    | Old duration + industry fields are also preserved.
    |
    */

    experience: [
      {
        companyName: {
          type: String,
          required: true,
          trim: true,
        },

        designation: {
          type: String,
          required: true,
          trim: true,
        },

        workSince: {
          type: String,
          default: '',
        },

        workTill: {
          type: String,
          default: '',
        },

        currentlyWorking: {
          type: Boolean,
          default: false,
        },

        description: {
          type: String,
          default: '',
        },

        totalYearsOfExperience: {
          type: Number,
          default: 0,
        },

        // Old field preserved but no longer required
        duration: {
          type: Date,
          required: false,
          default: null,
        },

        // Old field preserved
        industry: {
          type: [String],
          default: [],
        },
      },
    ],

    /*
    |--------------------------------------------------------------------------
    | ROLES
    |--------------------------------------------------------------------------
    */

    roles: [
      {
        role: {
          type: String,
          default: '',
        },

        specialities: {
          type: String,
          default: '',
        },
      },
    ],

    /*
    |--------------------------------------------------------------------------
    | PROJECTS
    |--------------------------------------------------------------------------
    */

    projects: [
      {
        // Old field
        title: {
          type: String,
          required: false,
          default: '',
        },

        // Old field
        date: {
          type: Date,
          required: false,
          default: null,
        },

        projectLink: {
          type: String,
          default: '',

          validate: {
            validator: isValidUrl,
            message: props =>
              `${props.value} is not a valid URL!`,
          },
        },

        technicalSkillUsed: {
          type: [String],
          default: [],
        },

        // Old field
        Projectdescription: {
          type: String,
          default: '',
        },

        // Current frontend field
        projectTitle: {
          type: String,
          default: '',
        },

        // Current frontend field
        year: {
          type: String,
          default: '',
        },

        // Current frontend field
        projectDescription: {
          type: String,
          default: '',
        },
      },
    ],

    /*
    |--------------------------------------------------------------------------
    | OLD EXPECTED PRICE - PRESERVED
    |--------------------------------------------------------------------------
    */

    expectedPrice: [
      {
        price: {
          type: String,
          default: '',
        },

        currency: {
          type: String,
          default: '',
        },
      },
    ],

    /*
    |--------------------------------------------------------------------------
    | EDUCATION
    |--------------------------------------------------------------------------
    */

    education: [
      {
        university: {
          type: String,
          required: true,
          trim: true,
        },

        // Old field
        fieldOfStudy: {
          type: String,
          default: '',
        },

        // Old field
        Specialization: {
          type: String,
          default: '',
        },

        // Old fields preserved
        startDate: {
          type: Date,
          required: false,
          default: null,
        },

        endDate: {
          type: Date,
          required: false,
          default: null,
        },

        description: {
          type: String,
          default: '',
        },

        // Current frontend
        degree: {
          type: String,
          default: '',
        },

        specialization: {
          type: String,
          default: '',
        },

        passingOutYear: {
          type: String,
          default: '',
        },
      },
    ],

    /*
    |--------------------------------------------------------------------------
    | CERTIFICATION
    |--------------------------------------------------------------------------
    */

    certification: [
      {
        title: {
          type: String,
          default: '',
        },

        issuedBy: {
          type: String,
          default: '',
        },

        issuedDate: {
          type: Date,
          default: null,
        },

        website: {
          type: String,
          default: '',

          validate: {
            validator: isValidUrl,
            message: props =>
              `${props.value} is not a valid URL!`,
          },
        },

        uploadCertificate: {
          type: String,
          default: '',
        },
      },
    ],

    /*
    |--------------------------------------------------------------------------
    | PREFERENCE
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | Current frontend sends ONE OBJECT, not an array.
    |
    */

    preference: {
      employmentPreference: {
        type: String,
        default: '',
      },

      hoursPerWeek: {
        type: Number,
        default: 0,
      },

      desiredSalary: {
        currency: {
          type: String,
          default: '',
        },

        price: {
          type: Number,
          default: 0,
        },
      },

      availableHours: {
        from: {
          type: String,
          default: '',
        },

        to: {
          type: String,
          default: '',
        },
      },

      // Old fields preserved
      typeOfJob: {
        type: String,
        default: '',
      },

      availableToWork: {
        type: String,
        default: '',
      },

      hourlyRate: {
        type: String,
        default: '',
      },
    },

    /*
    |--------------------------------------------------------------------------
    | OLD SOCIAL LINKS STRUCTURE - PRESERVED
    |--------------------------------------------------------------------------
    */

    socialLinks: [
      {
        github: {
          type: String,
          default: '',

          validate: {
            validator: isValidGithubUrl,
            message: props =>
              `${props.value} is not a valid GitHub URL!`,
          },
        },

        linkedin: {
          type: String,
          default: '',

          validate: {
            validator: isValidLinkedinUrl,
            message: props =>
              `${props.value} is not a valid LinkedIn URL!`,
          },
        },
      },
    ],

    /*
    |--------------------------------------------------------------------------
    | CURRENT SOCIAL FIELDS
    |--------------------------------------------------------------------------
    */

    github: {
      type: String,
      default: '',
    },

    linkedin: {
      type: String,
      default: '',
    },

    portfolio: {
      type: String,
      default: '',
    },

    /*
    |--------------------------------------------------------------------------
    | LANGUAGES
    |--------------------------------------------------------------------------
    */

    languages: [
      {
        language: {
          type: String,
          default: '',
        },

        proficiency: {
          type: String,
          default: '',
        },
      },
    ],

    /*
    |--------------------------------------------------------------------------
    | ONBOARDING
    |--------------------------------------------------------------------------
    */

    talentFormIndex: {
      type: String,
      default: '1',
    },

    // Old project spelling preserved
    talentOnboadCompleted: {
      type: Boolean,
      default: false,
    },

    // Correct spelling
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },

  {
    collection: 'jobseekers',
    timestamps: true,
  },
);

/*
|--------------------------------------------------------------------------
| OLD INHERITED FIELDS - PRESERVED
|--------------------------------------------------------------------------
*/

jobseekerSchema.add({
  email: {
    type: String,
    required: false,
  },

  password: {
    type: String,
    required: false,
  },
});

/*
|--------------------------------------------------------------------------
| KEEP ONBOARDING FLAGS SYNCHRONIZED
|--------------------------------------------------------------------------
*/

jobseekerSchema.pre('save', function (next) {
  const oldFieldChanged =
    this.isModified(
      'talentOnboadCompleted',
    );

  const newFieldChanged =
    this.isModified(
      'onboardingCompleted',
    );

  if (
    oldFieldChanged &&
    !newFieldChanged
  ) {
    this.onboardingCompleted =
      this.talentOnboadCompleted === true;
  }

  if (
    newFieldChanged &&
    !oldFieldChanged
  ) {
    this.talentOnboadCompleted =
      this.onboardingCompleted === true;
  }

  // If both were changed, use true if either one is true.
  if (
    oldFieldChanged &&
    newFieldChanged
  ) {
    const completed =
      this.talentOnboadCompleted === true ||
      this.onboardingCompleted === true;

    this.talentOnboadCompleted =
      completed;

    this.onboardingCompleted =
      completed;
  }

  next();
});

/*
|--------------------------------------------------------------------------
| MODEL
|--------------------------------------------------------------------------
*/

const Jobseeker = mongoose.model(
  'Jobseeker',
  jobseekerSchema,
);

module.exports = {
  Jobseeker,
};