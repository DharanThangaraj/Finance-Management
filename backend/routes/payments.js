const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  addOrUpdatePayment,
  getMemberPayments,
  updatePaymentStatus,
} = require('../controllers/paymentController');

const router = express.Router();
router.use(auth);

router.post(
  '/',
  [
    body('memberId').notEmpty().withMessage('Member ID is required'),
    body('monthNumber').isInt({ gt: 0 }).withMessage('Month number is required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount is required'),
    body('status').isIn(['PAID', 'UNPAID']).withMessage('Status must be PAID or UNPAID'),
  ],
  addOrUpdatePayment
);

router.get('/', getMemberPayments);
router.put('/:id', updatePaymentStatus);

module.exports = router;
