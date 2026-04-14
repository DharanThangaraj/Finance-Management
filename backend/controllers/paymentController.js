const { validationResult } = require('express-validator');
const Member = require('../models/Member');
const Payment = require('../models/Payment');

const addOrUpdatePayment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { memberId, monthNumber, amount, status } = req.body;
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const paymentData = {
      member: memberId,
      monthNumber,
      amount,
      status,
      paidAt: status === 'PAID' ? new Date() : undefined,
    };

    const payment = await Payment.findOneAndUpdate(
      { member: memberId, monthNumber },
      paymentData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(payment);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Payment for this month already exists' });
    }
    next(error);
  }
};

const getMemberPayments = async (req, res, next) => {
  try {
    const { memberId } = req.query;
    if (!memberId) {
      return res.status(400).json({ message: 'memberId is required' });
    }

    const payments = await Payment.find({ member: memberId }).sort({ monthNumber: 1 });
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['PAID', 'UNPAID'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = status;
    payment.paidAt = status === 'PAID' ? new Date() : undefined;
    await payment.save();

    res.json(payment);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addOrUpdatePayment,
  getMemberPayments,
  updatePaymentStatus,
};
