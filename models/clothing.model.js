const mongoose = require('mongoose');

const clothingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Clothing name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    // Reference to the wardrobe this clothing belongs to
    wardrobe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wardrobe',
      required: true,
    },
    // Reference to the type of clothing
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Type',
      required: true,
    },
    // Reference to the subtype of clothing
    subtype: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subtype',
    },
    // Reference to the care characteristics
    characteristics: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Characteristic',
    },
    // Additional fields
    purchase_date: {
      type: Date,
    },
    last_worn_date: {
      type: Date,
    },
    image_url: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Clothing', clothingSchema);