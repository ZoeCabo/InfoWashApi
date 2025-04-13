const Type = require('../models/type.model');
const Subtype = require('../models/subtype.model');

// Get all types
exports.getAllTypes = async (req, res) => {
  try {
    const types = await Type.find().populate('subtypes');
    res.status(200).json({
      status: 'success',
      results: types.length,
      data: {
        types,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get a single type
exports.getType = async (req, res) => {
  try {
    const type = await Type.findById(req.params.id).populate('subtypes');

    if (!type) {
      return res.status(404).json({
        status: 'fail',
        message: 'Type not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        type,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Create a new type
exports.createType = async (req, res) => {
  try {
    const newType = await Type.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        type: newType,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Update a type
exports.updateType = async (req, res) => {
  try {
    const type = await Type.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!type) {
      return res.status(404).json({
        status: 'fail',
        message: 'Type not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        type,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Delete a type
exports.deleteType = async (req, res) => {
  try {
    const type = await Type.findById(req.params.id);

    if (!type) {
      return res.status(404).json({
        status: 'fail',
        message: 'Type not found',
      });
    }

    // Delete all subtypes associated with this type
    await Subtype.deleteMany({ type: req.params.id });

    // Delete the type
    await Type.findByIdAndDelete(req.params.id);

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