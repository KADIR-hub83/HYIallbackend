// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const validator = require('validator');

// const Schema = mongoose.Schema;
// // Base schema for common fields (email, password, otp, etc.)
// const userBaseSchema = new Schema(
//   {
//     firstName: {
//   type: String,
//   trim: true,
//   default: '',
// },
// middleName: {
//   type: String,
//   trim: true,
//   default: '',
// },
// lastName: {
//   type: String,
//   trim: true,
//   default: '',
// },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     userType: {
//   type: String,
//   enum: [
//     'talent',
//     'company',
//     'individual',
//     'accountManager',
//     'admin',
//   ],
//   default: 'talent',
//   required: false,
// },
//     ipAddress: {
//       type: String, // Store the IP address
//       required: false,
//     },
//     geoLocation: {
//       type: Object, // Store geolocation data as an object
//       required: false,
//     },
//     deviceInfo: {
//       type: String, // Store user agent or parsed device info
//       required: false,
//     },
//     otp: {
//       type: String,
//       required: false,
//     },
//     otpExpiration: {
//       type: Date,
//       required: false,
//     },
//     isOtpVerified: {
//       type: Boolean,
//       default: false,
//     },
//     status: {
//       type: Number,
//       default: 1,
//       enum: [0, 1, 2],
//     },
//     jwtToken: {
//       type: String, // Add jwtToken field
//       required: false,
//     },
//   },
//   { timestamps: true, collection: 'users' },
// );

// //static signup method
// userBaseSchema.statics.signup = async function (
//   email,
//   password,
//   userType,
//   firstName = '',
//   middleName = '',
//   lastName = ''
// ) {
//   //validation
//   if (!email || !password) {
//     throw Error('All fields must be filled');
//   }
//   if (!validator.isEmail(email)) {
//     throw Error('Email is not valid');
//   }
//   if (!validator.isStrongPassword(password)) {
//     throw Error('Password is not strong enough');
//   }

//   const exists = await this.findOne({ email });
//   if (exists) {
//     throw Error('Email already in use');
//   }

//   const salt = await bcrypt.genSalt(10);
//   const hash = await bcrypt.hash(password, salt);

// const user = await this.create({
//   email,
//   password: hash,
//   userType,
//   firstName,
//   middleName,
//   lastName,
// });
//   return user;
// };

// // static login method
// userBaseSchema.statics.login = async function (email, password) {
//   if (!email || !password) {
//     throw Error('All fields must be filled');
//   }
//   const user = await this.findOne({ email });
//   if (!user) {
//     throw Error('Incorrect email');
//   }
//   const match = await bcrypt.compare(password, user.password);
//   if (!match) {
//     throw Error('Incorrect password');
//   }
//   return user;
// };

// // Method to update password
// userBaseSchema.methods.updatePassword = async function (newPassword) {
//   const salt = await bcrypt.genSalt(10);
//   const hash = await bcrypt.hash(newPassword, salt);
//   this.password = hash;
//   await this.save();
// };

// const UserBase = mongoose.model('UserBase', userBaseSchema);
// module.exports = { UserBase };





















































const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userBaseSchema = new Schema(
  {
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

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    userType: {
      type: String,

      enum: [
        'talent',
        'company',
        'individual',
        'accountManager',
        'admin',
      ],

      default: 'talent',

      required: false,
    },

    ipAddress: {
      type: String,
      required: false,
    },

    geoLocation: {
      type: Object,
      required: false,
    },

    deviceInfo: {
      type: String,
      required: false,
    },

    otp: {
      type: String,
      required: false,
    },

    otpExpiration: {
      type: Date,
      required: false,
    },

    isOtpVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: Number,
      default: 1,
      enum: [0, 1, 2],
    },

    jwtToken: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

/*
|--------------------------------------------------------------------------
| SIGNUP
|--------------------------------------------------------------------------
*/

userBaseSchema.statics.signup = async function (
  email,
  password,
  userType,
  firstName = '',
  middleName = '',
  lastName = '',
) {
  if (!email || !password) {
    throw new Error(
      'All fields must be filled',
    );
  }

  if (!validator.isEmail(email)) {
    throw new Error(
      'Email is not valid',
    );
  }

  if (
    !validator.isStrongPassword(password)
  ) {
    throw new Error(
      'Password is not strong enough',
    );
  }

  const normalizedEmail =
    email.trim().toLowerCase();

  const normalizedUserType =
    String(
      userType || 'talent',
    ).trim();

  const allowedUserTypes = [
    'talent',
    'company',
    'individual',
    'accountManager',
    'admin',
  ];

  if (
    !allowedUserTypes.includes(
      normalizedUserType,
    )
  ) {
    throw new Error(
      'Invalid user type',
    );
  }

  const exists =
    await this.findOne({
      email: normalizedEmail,
    });

  if (exists) {
    throw new Error(
      'Email already in use',
    );
  }

  const salt =
    await bcrypt.genSalt(10);

  const hash =
    await bcrypt.hash(
      password,
      salt,
    );

  const user =
    await this.create({
      email:
        normalizedEmail,

      password:
        hash,

      userType:
        normalizedUserType,

      firstName:
        String(
          firstName || '',
        ).trim(),

      middleName:
        String(
          middleName || '',
        ).trim(),

      lastName:
        String(
          lastName || '',
        ).trim(),
    });

  return user;
};

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

userBaseSchema.statics.login =
  async function (
    email,
    password,
  ) {
    if (
      !email ||
      !password
    ) {
      throw new Error(
        'All fields must be filled',
      );
    }

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    const user =
      await this.findOne({
        email:
          normalizedEmail,
      });

    if (!user) {
      throw new Error(
        'Incorrect email',
      );
    }

    const match =
      await bcrypt.compare(
        password,
        user.password,
      );

    if (!match) {
      throw new Error(
        'Incorrect password',
      );
    }

    return user;
  };

/*
|--------------------------------------------------------------------------
| UPDATE PASSWORD
|--------------------------------------------------------------------------
*/

userBaseSchema.methods.updatePassword =
  async function (
    newPassword,
  ) {
    const salt =
      await bcrypt.genSalt(10);

    const hash =
      await bcrypt.hash(
        newPassword,
        salt,
      );

    this.password =
      hash;

    await this.save();
  };

const UserBase =
  mongoose.model(
    'UserBase',
    userBaseSchema,
  );

module.exports = {
  UserBase,
};