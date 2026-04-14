const Member = require('../models/Member');
const Payment = require('../models/Payment');

const getMonthsSinceJoin = (joiningDate) => {
  const start = new Date(joiningDate);
  const now = new Date();
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1;
  if (now.getDate() < start.getDate()) {
    months -= 1;
  }
  return Math.max(months, 1);
};

const getDashboard = async (req, res, next) => {
  try {
    const members = await Member.find();
    const payments = await Payment.find();

    const summaryData = members.map((member) => {
      const memberPayments = payments.filter((payment) => payment.member.toString() === member._id.toString());
      const paidMonths = memberPayments.filter((p) => p.status === 'PAID').length;
      const collected = memberPayments.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
      const remaining = Math.max(member.totalAmount - collected, 0);
      const dueMonths = Math.min(getMonthsSinceJoin(member.joiningDate), member.durationMonths);
      const unpaidCurrent = memberPayments.find((payment) => payment.monthNumber === dueMonths && payment.status === 'UNPAID');
      const currentMonthNotPaid = dueMonths <= member.durationMonths && (!unpaidCurrent && !memberPayments.some((p) => p.monthNumber === dueMonths && p.status === 'PAID'));
      const overdue = memberPayments.filter((p) => p.monthNumber <= dueMonths && p.status === 'UNPAID').length > 0;

      return {
        member,
        paidMonths,
        pendingMonths: member.durationMonths - paidMonths,
        collected,
        remaining,
        currentMonthNotPaid,
        overdue,
      };
    });

    const totalCollected = summaryData.reduce((sum, item) => sum + item.collected, 0);
    const totalPending = summaryData.reduce((sum, item) => sum + item.remaining, 0);
    const overdueMembers = summaryData.filter((item) => item.overdue).map((item) => item.member);
    const notPaidCurrentMonth = summaryData.filter((item) => item.currentMonthNotPaid).map((item) => item.member);

    res.json({
      totalMembers: members.length,
      totalCollected,
      totalPending,
      overdueMembers,
      notPaidCurrentMonth,
    });
  } catch (error) {
    next(error);
  }
};

const getMonthlyCollectionReport = async (req, res, next) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const [year, monthNumber] = month.split('-').map(Number);
    if (!year || !monthNumber) {
      return res.status(400).json({ message: 'Month must be in YYYY-MM format' });
    }

    const start = new Date(year, monthNumber - 1, 1);
    const end = new Date(year, monthNumber, 1);

    const payments = await Payment.find({
      status: 'PAID',
      paidAt: { $gte: start, $lt: end },
    }).populate('member');

    const summary = payments.reduce(
      (acc, payment) => {
        acc.totalCollected += payment.amount;
        acc.records.push({
          memberName: payment.member.name,
          monthNumber: payment.monthNumber,
          amount: payment.amount,
          paidAt: payment.paidAt,
        });
        return acc;
      },
      { totalCollected: 0, records: [] }
    );

    res.json({ month, totalCollected: summary.totalCollected, records: summary.records });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard, getMonthlyCollectionReport };
