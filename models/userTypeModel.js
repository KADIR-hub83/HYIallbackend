const mongoose = require('mongoose');

const userTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    isSystem: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: 'user_types',
    timestamps: true,
  },
);

userTypeSchema.index(
  { name: 1 },
  { unique: true },
);

const UserType =
  mongoose.models.UserType ||
  mongoose.model(
    'UserType',
    userTypeSchema,
  );

module.exports = {
  UserType,
};