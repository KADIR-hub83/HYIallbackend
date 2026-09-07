// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const companySchema = new Schema(
//   {
//     companyName: {
//       type: String,
//     },
//     website: {
//       type: String,
//       validate: {
//         validator: function (v) {
//           return /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(
//             v,
//           );
//         },
//         message: (props) => `${props.value} is not a valid URL!`,
//       },
//     },

//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'UserBase', // Reference UserBase
//       required: true,
//       unique: true,
//     },

//     companyLogo: {
//       type: String,
//       default: null,
//     },
//     location: {
//       type: String,
//       default: null,
//     },
//     summary: {
//       type: String,
//       default: null,
//     },
//     phoneNumber: {
//       type: Number,
//       default: null,
//     },
//     businessType: {
//       type: String,
//       default: null,
//     },
//     industryType: {
//       type: String,
//       default: null,
//     },
//     taxNumber: {
//       type: Number,
//       default: null,
//     },

//     timeZonePreferences: {
//       type: String,
//       defualt: null,
//     },
//   },
//   {
//     collection: 'companies',
//     timestamps: true,
//   },
// );

// // Disable required validations for inherited fields
// companySchema.add({
//   email: { type: String, required: false },
//   password: { type: String, required: false },
// });
// // Create Jobseeker model using the schema
// const Company = mongoose.model('companySchema', companySchema);

// module.exports = { Company }; // Ensure UserBase is exported correctly























const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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

const companySchema = new Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | OWNER
    |--------------------------------------------------------------------------
    */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserBase',
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: false,
      default: '',
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: false,
    },

    /*
    |--------------------------------------------------------------------------
    | ACCOUNT / ORGANIZATION TYPE
    |--------------------------------------------------------------------------
    */

    type: {
      type: String,
      enum: ['company', 'individual'],
      default: 'company',
    },

    /*
    |--------------------------------------------------------------------------
    | NAME
    |--------------------------------------------------------------------------
    */

    companyName: {
      type: String,
      default: '',
      trim: true,
    },

    individualName: {
      type: String,
      default: '',
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | COMPANY PROFILE
    |--------------------------------------------------------------------------
    */

    website: {
      type: String,
      default: '',
      trim: true,

      validate: {
        validator: isValidUrl,
        message: props =>
          `${props.value} is not a valid URL!`,
      },
    },

    designation: {
      type: String,
      default: '',
      trim: true,
    },

    industryType: {
      type: String,
      default: '',
      trim: true,
    },

    businessType: {
      type: String,
      default: '',
      trim: true,
    },

    projectScale: {
      type: String,
      default: '',
      trim: true,
    },

    companyType: {
      type: String,
      default: '',
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | LOCATION
    |--------------------------------------------------------------------------
    */

    country: {
      type: String,
      default: '',
      trim: true,
    },

    /*
     * Legacy field preserved
     */
    location: {
      type: String,
      default: '',
    },

    /*
    |--------------------------------------------------------------------------
    | PROFILE DETAILS
    |--------------------------------------------------------------------------
    */

    companyLogo: {
      type: String,
      default: null,
    },

    summary: {
      type: String,
      default: '',
    },

    phoneNumber: {
      type: String,
      default: '',
      trim: true,
    },

    timeZonePreferences: {
      type: String,
      default: '',
    },

    /*
    |--------------------------------------------------------------------------
    | COMPANY VERIFICATION / TAX
    |--------------------------------------------------------------------------
    */

    tin: {
      type: String,
      default: '',
      trim: true,
    },

    companyAcNumber: {
      type: String,
      default: '',
      trim: true,
    },

    /*
     * Legacy field preserved
     */
    taxNumber: {
      type: String,
      default: '',
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | INDIVIDUAL VERIFICATION
    |--------------------------------------------------------------------------
    */

    aadharCard: {
      type: String,
      default: '',
      trim: true,
    },

    panCard: {
      type: String,
      default: '',
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | ONBOARDING
    |--------------------------------------------------------------------------
    */

    organizationFromIndex: {
      type: String,
      default: '1',
    },

    organizationOnboadCompleted: {
      type: Boolean,
      default: false,
    },

    /*
     * Correct spelling also preserved for future code.
     */
    organizationOnboardCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'companies',
    timestamps: true,
  },
);

/*
|--------------------------------------------------------------------------
| VALIDATE NAME BASED ON TYPE
|--------------------------------------------------------------------------
*/

companySchema.pre('validate', function (next) {
  if (
    this.type === 'company' &&
    !this.companyName
  ) {
    return next(
      new Error(
        'Company name is required',
      ),
    );
  }

  if (
    this.type === 'individual' &&
    !this.individualName
  ) {
    return next(
      new Error(
        'Individual name is required',
      ),
    );
  }

  next();
});

/*
|--------------------------------------------------------------------------
| KEEP ONBOARDING FLAGS SYNCED
|--------------------------------------------------------------------------
*/

companySchema.pre('save', function (next) {
  const legacyChanged =
    this.isModified(
      'organizationOnboadCompleted',
    );

  const correctedChanged =
    this.isModified(
      'organizationOnboardCompleted',
    );

  if (
    legacyChanged &&
    !correctedChanged
  ) {
    this.organizationOnboardCompleted =
      this.organizationOnboadCompleted === true;
  }

  if (
    correctedChanged &&
    !legacyChanged
  ) {
    this.organizationOnboadCompleted =
      this.organizationOnboardCompleted === true;
  }

  if (
    legacyChanged &&
    correctedChanged
  ) {
    const completed =
      this.organizationOnboadCompleted === true ||
      this.organizationOnboardCompleted === true;

    this.organizationOnboadCompleted =
      completed;

    this.organizationOnboardCompleted =
      completed;
  }

  next();
});

/*
|--------------------------------------------------------------------------
| MODEL
|--------------------------------------------------------------------------
*/

const Company = mongoose.model(
  'Company',
  companySchema,
);

module.exports = {
  Company,
};