const Wardrobe = require('../models/wardrobe.model');
const Clothing = require('../models/clothing.model');

// Get all wardrobes
exports.getAllWardrobes = async (req, res) => {
  try {
    const wardrobes = await Wardrobe.find();
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
    const wardrobe = await Wardrobe.findById(req.params.id).populate('clothes');

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
    const newWardrobe = await Wardrobe.create(req.body);

    res.status(200).json({
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
    const wardrobe = await Wardrobe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Delete a wardrobe
exports.deleteWardrobe = async (req, res) => {
  try {
    const wardrobe = await Wardrobe.findByIdAndDelete(req.params.id);

    if (!wardrobe) {
      return res.status(404).json({
        status: 'fail',
        message: 'Wardrobe not found',
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