const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
} = require('../controllers/memberController');

const router = express.Router();

router.use(auth);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('joiningDate').isISO8601().toDate().withMessage('Joining date is required'),
    body('totalAmount').isFloat({ gt: 0 }).withMessage('Total amount must be greater than 0'),
    body('durationMonths').isInt({ gt: 0 }).withMessage('Duration months must be greater than 0'),
  ],
  createMember
);

router.get('/', getMembers);
router.get('/:id', getMemberById);

router.put(
  '/:id',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('joiningDate').isISO8601().toDate().withMessage('Joining date is required'),
    body('totalAmount').isFloat({ gt: 0 }).withMessage('Total amount must be greater than 0'),
    body('durationMonths').isInt({ gt: 0 }).withMessage('Duration months must be greater than 0'),
  ],
  updateMember
);

router.delete('/:id', deleteMember);

module.exports = router;
