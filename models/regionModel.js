const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema(
  {
    regionName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: 'regions',
    timestamps: true,
  },
);

regionSchema.index(
  { regionName: 1 },
  { unique: true },
);

const Region =
  mongoose.models.Region ||
  mongoose.model(
    'Region',
    regionSchema,
  );

module.exports = {
  Region,
};