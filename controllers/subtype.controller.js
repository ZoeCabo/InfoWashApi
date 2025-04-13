const Subtype = require('../models/subtype.model');
const Type = require('../models/type.model');

// Get all subtypes
exports.getAllSubtypes = async (req, res) => {
  try {
    // Filter by type if provided
    const filter = {};
    if (req.query.type) {
      filter.type = req.query.type;
    }

    const subtypes = await Subtype.find(filter).populate('type');
    res.status(200).json({
      status: 'success',
      results: subtypes.length,
      data: {
        subtypes,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get a single subtype
exports.getSubtype = async (req, res) => {
  try {
    const subtype = await Subtype.findById(req.params.id).populate('type');

    if (!subtype) {
      return res.status(404).json({
        status: 'fail',
        message: 'Subtype not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        subtype,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Create a new subtype
exports.createSubtype = async (req, res) => {
  try {
    const newSubtype = await Subtype.create(req.body);

    // Add this subtype to the type's subtypes array
    await Type.findByIdAndUpdate(
      newSubtype.type,
      { $push: { subtypes: newSubtype._id } },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        subtype: newSubtype,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Update a subtype
exports.updateSubtype = async (req, res) => {
  try {
    const subtype = await Subtype.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!subtype) {
      return res.status(404).json({
        status: 'fail',
        message: 'Subtype not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        subtype,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Delete a subtype
exports.deleteSubtype = async (req, res) => {
  try {
    const subtype = await Subtype.findById(req.params.id);

    if (!subtype) {
      return res.status(404).json({
        status: 'fail',
        message: 'Subtype not found',
      });
    }

    // Remove this subtype from the type's subtypes array
    await Type.findByIdAndUpdate(
      subtype.type,
      { $pull: { subtypes: subtype._id } },
      { new: true }
    );

    // Delete the subtype
    await Subtype.findByIdAndDelete(req.params.id);

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