const express = require('express');
const typeController = require('../controllers/type.controller');

const router = express.Router();

router
  .route('/')
  .get(typeController.getAllTypes)
  .post(typeController.createType);

router
  .route('/:id')
  .get(typeController.getType)
  .patch(typeController.updateType)
  .delete(typeController.deleteType);

module.exports = router;