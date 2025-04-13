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
    owner: {
      type: String,
      trim: true,
    },
    // Reference to clothing items in this wardrobe
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