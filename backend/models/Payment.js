const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  monthNumber: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['PAID', 'UNPAID'], default: 'UNPAID' },
  paidAt: { type: Date },
}, { timestamps: true });

PaymentSchema.index({ member: 1, monthNumber: 1 }, { unique: true });

module.exports = mongoose.model('Payment', PaymentSchema);
