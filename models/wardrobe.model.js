const mongoose = require('mongoose');

const wardrobeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Wardrobe name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    clothes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clothing',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Wardrobe', wardrobeSchema);