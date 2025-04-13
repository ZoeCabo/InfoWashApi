const mongoose = require('mongoose');

const subtypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subtype name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // Reference to the parent type
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Type',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Subtype', subtypeSchema);