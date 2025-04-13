const express = require('express');
const subtypeController = require('../controllers/subtype.controller');

const router = express.Router();

router
  .route('/')
  .get(subtypeController.getAllSubtypes)
  .post(subtypeController.createSubtype);

router
  .route('/:id')
  .get(subtypeController.getSubtype)
  .patch(subtypeController.updateSubtype)
  .delete(subtypeController.deleteSubtype);

module.exports = router;