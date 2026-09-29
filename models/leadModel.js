const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const leadSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },

    gender: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phoneNumber: {
      type: String,
      trim: true,
    },

    companyName: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      trim: true,
    },

    timeZone: {
      type: String,
      trim: true,
    },

    preferToCallTime: {
      type: String,
      trim: true,
    },

    preferredCountries: {
      type: [String],
      default: [],
    },

    preferredTimeZone: {
      type: [String],
      default: [],
    },

    salaryPerHourFrom: {
      type: Number,
    },

    salaryPerHourTo: {
      type: Number,
    },

    keySkills: {
      type: [String],
      default: [],
    },

    numberOfTalentRequired: {
      type: Number,
      min: 1,
    },

    workPreference: {
      type: String,
      trim: true,
    },

    profileStatus: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Draft",
        "Submitted",
        "Contacted",
        "Qualified",
        "Closed",
      ],
      default: "Draft",
    },
  },
  {
    collection: "leads",
    timestamps: true,
  }
);

const Lead = mongoose.model("Lead", leadSchema);

module.exports = {
  Lead,
};