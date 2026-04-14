const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  joiningDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  durationMonths: { type: Number, required: true },
  monthlyDue: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Member', MemberSchema);
