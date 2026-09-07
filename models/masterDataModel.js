const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const masterDataSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'designation',
        'university',
        'degree',
        'language',
        'skill',
      ],
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    normalizedName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: 'master_data',
    timestamps: true,
  },
);

masterDataSchema.index(
  {
    type: 1,
    normalizedName: 1,
  },
  {
    unique: true,
  },
);

masterDataSchema.pre('validate', function (next) {
  if (this.name) {
    this.normalizedName = this.name
      .trim()
      .toLowerCase();
  }

  next();
});

const MasterData = mongoose.model(
  'MasterData',
  masterDataSchema,
);

module.exports = {
  MasterData,
};