const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const careerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      required: false,
      default: '',
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: false,
      default: '',
      trim: true,
    },

    resume: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'career',
    timestamps: true,
  }
);

const Career = mongoose.model(
  'Career',
  careerSchema
);

module.exports = {
  Career,
};