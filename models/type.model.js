const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Type name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // Reference to subtypes of this type
    subtypes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subtype',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Type', typeSchema);