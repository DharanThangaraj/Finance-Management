const express = require('express');
const auth = require('../middleware/auth');
const { getDashboard, getMonthlyCollectionReport } = require('../controllers/dashboardController');

const router = express.Router();
router.use(auth);
router.get('/', getDashboard);
router.get('/monthly-report', getMonthlyCollectionReport);

module.exports = router;
