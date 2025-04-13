const express = require('express');
const wardrobeController = require('../controllers/wardrobe.controller');

const router = express.Router();

router
  .route('/')
  .get(wardrobeController.getAllWardrobes)
  .post(wardrobeController.createWardrobe);

router
  .route('/:id')
  .get(wardrobeController.getWardrobe)
  .patch(wardrobeController.updateWardrobe)
  .delete(wardrobeController.deleteWardrobe);

module.exports = router;