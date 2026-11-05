const express = require('express');
const router = express.Router();
const {
  getSummary,
  getMonthlyAnalysis,
  getCategoryAnalysis,
} = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

router.use(auth); // All analytics routes protected

router.get('/summary', getSummary);
router.get('/monthly', getMonthlyAnalysis);
router.get('/categories', getCategoryAnalysis);

module.exports = router;
