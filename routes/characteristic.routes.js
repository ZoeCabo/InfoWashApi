const express = require('express');
const characteristicController = require('../controllers/characteristic.controller');

const router = express.Router();

router
  .route('/')
  .get(characteristicController.getAllCharacteristics)
  .post(characteristicController.createCharacteristic);

router
  .route('/:id')
  .get(characteristicController.getCharacteristic)
  .patch(characteristicController.updateCharacteristic)
  .delete(characteristicController.deleteCharacteristic);

module.exports = router;