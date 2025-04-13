const mongoose = require('mongoose');

const characteristicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Characteristic name is required'],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    // Washing temperature
    washing_temperature: {
      temperature_max: {
        type: Number,
      },
      temperature_min: {
        type: Number,
      },
    },
    // Dryer options
    dryer: {
      use: {
        type: Boolean,
        default: true,
      },
      no_use: {
        type: Boolean,
        default: false,
      },
      short_cycle_low_temp: {
        type: Boolean,
        default: false,
      },
      normal_cycle: {
        type: Boolean,
        default: false,
      },
      long_cycle_normal_temp: {
        type: Boolean,
        default: false,
      },
      cold_dry: {
        type: Boolean,
        default: false,
      },
      delicate: {
        type: Boolean,
        default: false,
      },
    },
    // Drying options
    drying: {
      hang: {
        type: Boolean,
        default: false,
      },
      hang_shade_sun: {
        type: Boolean,
        default: false,
      },
      lay_flat: {
        type: Boolean,
        default: false,
      },
      hang_shade: {
        type: Boolean,
        default: false,
      },
    },
    // Bleaching options
    bleaching: {
      allowed: {
        type: Boolean,
        default: false,
      },
      not_allowed: {
        type: Boolean,
        default: false,
      },
      oxygen_based_only: {
        type: Boolean,
        default: false,
      },
    },
    // Ironing options
    ironing: {
      no_steam: {
        type: Boolean,
        default: false,
      },
      no_ironing: {
        type: Boolean,
        default: false,
      },
      max_temperature: {
        type: Number,
      },
    },
    // Professional cleaning
    professional_cleaning: {
      required: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Characteristic', characteristicSchema);