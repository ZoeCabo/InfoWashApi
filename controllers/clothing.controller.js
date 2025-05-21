const Clothing = require('../models/clothing.model');
const Wardrobe = require('../models/wardrobe.model');

// Get batch laundry instructions for multiple clothing items
exports.laundryInstructions = async (req, res) => {
  try {
    if (!req.body.clothingIds || !Array.isArray(req.body.clothingIds)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide an array of clothing IDs',
      });
    }

    // Find user's wardrobes
    const userWardrobes = await Wardrobe.find({ user: req.user.id });
    const userWardrobeIds = userWardrobes.map(w => w._id);

    // Find clothes that belong to user's wardrobes and match the requested IDs
    const clothes = await Clothing.find({ 
      _id: { $in: req.body.clothingIds },
      wardrobe: { $in: userWardrobeIds }
    }).populate('characteristics');

    if (clothes.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No clothing items found with the provided IDs',
      });
    }

    // Initialize safe washing instructions with the most conservative values
    const safeInstructions = {
      washing_temperature: {
        temperature_max: Math.min(...clothes
          .filter(c => c.characteristics && c.characteristics.washing_temperature)
          .map(c => c.characteristics.washing_temperature.temperature_max || 100)),
        temperature_min: Math.max(...clothes
          .filter(c => c.characteristics && c.characteristics.washing_temperature)
          .map(c => c.characteristics.washing_temperature.temperature_min || 0))
      },
      dryer: {
        use: clothes.every(c => c.characteristics && c.characteristics.dryer && c.characteristics.dryer.use),
        no_use: clothes.some(c => c.characteristics && c.characteristics.dryer && c.characteristics.dryer.no_use),
        short_cycle_low_temp: clothes.every(c => c.characteristics && c.characteristics.dryer && c.characteristics.dryer.short_cycle_low_temp),
        normal_cycle: clothes.every(c => c.characteristics && c.characteristics.dryer && c.characteristics.dryer.normal_cycle),
        delicate: clothes.some(c => c.characteristics && c.characteristics.dryer && c.characteristics.dryer.delicate)
      },
      drying: {
        hang: clothes.some(c => c.characteristics && c.characteristics.drying && c.characteristics.drying.hang),
        hang_shade: clothes.some(c => c.characteristics && c.characteristics.drying && c.characteristics.drying.hang_shade),
        lay_flat: clothes.some(c => c.characteristics && c.characteristics.drying && c.characteristics.drying.lay_flat)
      },
      bleaching: {
        allowed: clothes.every(c => c.characteristics && c.characteristics.bleaching && c.characteristics.bleaching.allowed),
        not_allowed: clothes.some(c => c.characteristics && c.characteristics.bleaching && c.characteristics.bleaching.not_allowed),
        oxygen_based_only: clothes.some(c => c.characteristics && c.characteristics.bleaching && c.characteristics.bleaching.oxygen_based_only)
      }
    };

    // Generate washing recommendations
    const recommendations = {
      washing: `Wash at ${safeInstructions.washing_temperature.temperature_min}°C to ${safeInstructions.washing_temperature.temperature_max}°C`,
      drying: safeInstructions.dryer.no_use ? 
        'Air dry only' : 
        safeInstructions.dryer.delicate ? 
          'Use delicate cycle' : 
          safeInstructions.dryer.short_cycle_low_temp ? 
            'Use short cycle with low temperature' : 
            'Normal drying cycle',
      special_care: [
        safeInstructions.drying.lay_flat ? 'Lay flat to dry' : null,
        safeInstructions.drying.hang_shade ? 'Hang dry in shade' : null,
        safeInstructions.bleaching.not_allowed ? 'Do not bleach' : 
          safeInstructions.bleaching.oxygen_based_only ? 'Use only oxygen-based bleach' : null
      ].filter(Boolean)
    };

    res.status(200).json({
      status: 'success',
      data: {
        clothes_count: clothes.length,
        safe_instructions: safeInstructions,
        recommendations
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get all clothing items
exports.getAllClothes = async (req, res) => {
  try {
    // Find user's wardrobes
    const userWardrobes = await Wardrobe.find({ user: req.user.id });
    const userWardrobeIds = userWardrobes.map(w => w._id);
    
    // Filter by wardrobe if provided, ensuring it's one of the user's wardrobes
    const filter = { wardrobe: { $in: userWardrobeIds } };
    if (req.query.wardrobe) {
      // Verify the requested wardrobe belongs to the user
      if (userWardrobeIds.includes(req.query.wardrobe)) {
        filter.wardrobe = req.query.wardrobe;
      } else {
        return res.status(403).json({
          status: 'fail',
          message: 'You do not have access to this wardrobe',
        });
      }
    }

    const clothes = await Clothing.find(filter)
      .populate('wardrobe')
      .populate('type')
      .populate('subtype')
      .populate('characteristics');

    res.status(200).json({
      status: 'success',
      results: clothes.length,
      data: {
        clothes,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get a single clothing item
exports.getClothing = async (req, res) => {
  try {
    // Find user's wardrobes
    const userWardrobes = await Wardrobe.find({ user: req.user.id });
    const userWardrobeIds = userWardrobes.map(w => w._id);
    
    const clothing = await Clothing.findOne({
      _id: req.params.id,
      wardrobe: { $in: userWardrobeIds }
    })
      .populate('wardrobe')
      .populate('type')
      .populate('subtype')
      .populate('characteristics');

    if (!clothing) {
      return res.status(404).json({
        status: 'fail',
        message: 'Clothing item not found or you do not have permission',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        clothing,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Create a new clothing item
exports.createClothing = async (req, res) => {
  try {
    // Verify the wardrobe belongs to the user
    const wardrobe = await Wardrobe.findOne({ 
      _id: req.body.wardrobe,
      user: req.user.id
    });
    
    if (!wardrobe) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to add clothing to this wardrobe',
      });
    }
    
    const newClothing = await Clothing.create(req.body);

    // Add this clothing to the wardrobe's clothes array
    await Wardrobe.findByIdAndUpdate(
      newClothing.wardrobe,
      { $push: { clothes: newClothing._id } },
      { new: true }
    );

    res.status(201).json({
      status: 'success',
      data: {
        clothing: newClothing,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Update a clothing item
exports.updateClothing = async (req, res) => {
  try {
    // Find user's wardrobes
    const userWardrobes = await Wardrobe.find({ user: req.user.id });
    const userWardrobeIds = userWardrobes.map(w => w._id);
    
    // If wardrobe is being changed, verify the new wardrobe belongs to the user
    if (req.body.wardrobe) {
      const newWardrobe = await Wardrobe.findOne({ 
        _id: req.body.wardrobe,
        user: req.user.id
      });
      
      if (!newWardrobe) {
        return res.status(403).json({
          status: 'fail',
          message: 'You do not have permission to move clothing to this wardrobe',
        });
      }
    }
    
    // Find and update the clothing item
    const clothing = await Clothing.findOneAndUpdate(
      { 
        _id: req.params.id,
        wardrobe: { $in: userWardrobeIds }
      }, 
      req.body, 
      {
        new: true,
        runValidators: true,
      }
    );

    if (!clothing) {
      return res.status(404).json({
        status: 'fail',
        message: 'Clothing item not found or you do not have permission',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        clothing,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Delete a clothing item
exports.deleteClothing = async (req, res) => {
  try {
    // Find user's wardrobes
    const userWardrobes = await Wardrobe.find({ user: req.user.id });
    const userWardrobeIds = userWardrobes.map(w => w._id);
    
    // Find the clothing item
    const clothing = await Clothing.findOne({ 
      _id: req.params.id,
      wardrobe: { $in: userWardrobeIds }
    });

    if (!clothing) {
      return res.status(404).json({
        status: 'fail',
        message: 'Clothing item not found or you do not have permission',
      });
    }

    // Remove the clothing from its wardrobe
    await Wardrobe.findByIdAndUpdate(
      clothing.wardrobe,
      { $pull: { clothes: clothing._id } }
    );

    // Delete the clothing item
    await Clothing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};