const Wardrobe = require('../models/wardrobe.model');
const Clothing = require('../models/clothing.model');

// Get all wardrobes for the current user
exports.getAllWardrobes = async (req, res) => {
  try {
    const wardrobes = await Wardrobe.find({ user: req.user.id });
    res.status(200).json({
      status: 'success',
      results: wardrobes.length,
      data: {
        wardrobes,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get a single wardrobe
exports.getWardrobe = async (req, res) => {
  try {
    const wardrobe = await Wardrobe.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('clothes');

    if (!wardrobe) {
      return res.status(404).json({
        status: 'fail',
        message: 'Wardrobe not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        wardrobe,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Create a new wardrobe
exports.createWardrobe = async (req, res) => {
  try {
    // Add the current user's ID to the wardrobe data
    const wardrobeData = {
      ...req.body,
      user: req.user.id
    };
    
    const newWardrobe = await Wardrobe.create(wardrobeData);

    res.status(201).json({
      status: 'success',
      data: {
        wardrobe: newWardrobe,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Update a wardrobe
exports.updateWardrobe = async (req, res) => {
  try {
    const wardrobe = await Wardrobe.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!wardrobe) {
      return res.status(404).json({
        status: 'fail',
        message: 'Wardrobe not found or you do not have permission',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        wardrobe,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Delete a wardrobe
exports.deleteWardrobe = async (req, res) => {
  try {
    const wardrobe = await Wardrobe.findOneAndDelete({ 
      _id: req.params.id,
      user: req.user.id
    });

    if (!wardrobe) {
      return res.status(404).json({
        status: 'fail',
        message: 'Wardrobe not found or you do not have permission',
      });
    }

    // Also delete all clothing items associated with this wardrobe
    await Clothing.deleteMany({ wardrobe: req.params.id });

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