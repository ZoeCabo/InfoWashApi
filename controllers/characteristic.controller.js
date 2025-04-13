const Characteristic = require('../models/characteristic.model');

// Get all characteristics
exports.getAllCharacteristics = async (req, res) => {
  try {
    const characteristics = await Characteristic.find();
    res.status(200).json({
      status: 'success',
      results: characteristics.length,
      data: {
        characteristics,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get a single characteristic
exports.getCharacteristic = async (req, res) => {
  try {
    const characteristic = await Characteristic.findById(req.params.id);

    if (!characteristic) {
      return res.status(404).json({
        status: 'fail',
        message: 'Characteristic not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        characteristic,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Create a new characteristic
exports.createCharacteristic = async (req, res) => {
  try {
    const newCharacteristic = await Characteristic.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        characteristic: newCharacteristic,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Update a characteristic
exports.updateCharacteristic = async (req, res) => {
  try {
    const characteristic = await Characteristic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!characteristic) {
      return res.status(404).json({
        status: 'fail',
        message: 'Characteristic not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        characteristic,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Delete a characteristic
exports.deleteCharacteristic = async (req, res) => {
  try {
    const characteristic = await Characteristic.findByIdAndDelete(req.params.id);

    if (!characteristic) {
      return res.status(404).json({
        status: 'fail',
        message: 'Characteristic not found',
      });
    }

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