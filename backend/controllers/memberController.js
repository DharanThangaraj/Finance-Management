const { validationResult } = require('express-validator');
const Member = require('../models/Member');
const Payment = require('../models/Payment');

const calculateSummary = (member, payments = []) => {
  const paidMonths = payments.filter((p) => p.status === 'PAID').length;
  const pendingMonths = member.durationMonths - paidMonths;
  const collected = payments.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
  const remaining = Math.max(member.totalAmount - collected, 0);
  return { paidMonths, pendingMonths, collected, remaining };
};

const createMember = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name, phone, address, joiningDate, totalAmount, durationMonths } = req.body;
    const monthlyDue = Math.round((totalAmount / durationMonths) * 100) / 100;

    const member = await Member.create({
      name,
      phone,
      address,
      joiningDate,
      totalAmount,
      durationMonths,
      monthlyDue,
    });

    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
};

const getMembers = async (req, res, next) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    const payments = await Payment.find();
    const result = members.map((member) => {
      const memberPayments = payments.filter((payment) => payment.member.toString() === member._id.toString());
      return { ...member.toObject(), summary: calculateSummary(member, memberPayments) };
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getMemberById = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    const payments = await Payment.find({ member: member._id }).sort({ monthNumber: 1 });
    res.json({ ...member.toObject(), payments, summary: calculateSummary(member, payments) });
  } catch (error) {
    next(error);
  }
};

const updateMember = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const { name, phone, address, joiningDate, totalAmount, durationMonths } = req.body;
    member.name = name;
    member.phone = phone;
    member.address = address;
    member.joiningDate = joiningDate;
    member.totalAmount = totalAmount;
    member.durationMonths = durationMonths;
    member.monthlyDue = Math.round((totalAmount / durationMonths) * 100) / 100;
    await member.save();

    res.json(member);
  } catch (error) {
    next(error);
  }
};

const deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    await Payment.deleteMany({ member: member._id });
    await member.deleteOne();
    res.json({ message: 'Member deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
};
