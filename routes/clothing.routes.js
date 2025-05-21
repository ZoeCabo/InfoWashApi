const express = require('express');
const clothingController = require('../controllers/clothing.controller');

const router = express.Router();

router
  .route('/')
  .get(clothingController.getAllClothes)
  .post(clothingController.createClothing);

router
  .route('/laundry')
  .post(clothingController.laundryInstructions);

router
  .route('/:id')
  .get(clothingController.getClothing)
  .patch(clothingController.updateClothing)
  .delete(clothingController.deleteClothing);

module.exports = router;