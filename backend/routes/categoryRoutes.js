const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const auth = require('../middleware/auth');

router.use(auth); // All category routes protected

router.route('/')
  .get(getCategories)
  .post(createCategory);

router.delete('/:id', deleteCategory);

module.exports = router;
