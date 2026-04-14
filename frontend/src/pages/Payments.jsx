import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/api.js';

const Payments = () => {
  const [searchParams] = useSearchParams();
  const selectedMemberId = searchParams.get('memberId');
  const [members, setMembers] = useState([]);
  const [currentMember, setCurrentMember] = useState(selectedMemberId || '');
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ monthNumber: '', amount: '', status: 'PAID' });
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMembers = async () => {
      const response = await api.get('/members');
      setMembers(response.data);
      if (selectedMemberId) {
        setCurrentMember(selectedMemberId);
      }
    };
    loadMembers();
  }, [selectedMemberId]);

  useEffect(() => {
    if (!currentMember) return;
    const loadPayments = async () => {
      try {
        const [paymentsResponse, memberResponse] = await Promise.all([
          api.get(`/payments?memberId=${currentMember}`),
          api.get(`/members/${currentMember}`),
        ]);
        setPayments(paymentsResponse.data);
        setSummary(memberResponse.data.summary);
        setForm({
          monthNumber: '',
          amount: memberResponse.data.monthlyDue || '',
          status: 'PAID',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load payments');
      }
    };
    loadPayments();
  }, [currentMember]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await api.post('/payments', {
        memberId: currentMember,
        monthNumber: Number(form.monthNumber),
        amount: Number(form.amount),
        status: form.status,
      });
      const response = await api.get(`/payments?memberId=${currentMember}`);
      setPayments(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save payment');
    }
  };

  const handleToggleStatus = async (payment) => {
    setError('');
    try {
      await api.put(`/payments/${payment._id}`, {
        status: payment.status === 'PAID' ? 'UNPAID' : 'PAID',
      });
      const response = await api.get(`/payments?memberId=${currentMember}`);
      setPayments(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update payment');
    }
  };

  return (
    <div className="space-y-4">
      <section className="border border-gray-300 bg-white p-4 rounded-sm">
        <h1 className="text-xl font-bold text-gray-900">Payments</h1>
        <p className="mt-2 text-sm text-gray-700">Track and update payments for a selected member.</p>
      </section>

      <section className="border border-gray-300 bg-white p-4 rounded-sm">
        <label className="block text-sm font-medium text-gray-900">Select member</label>
        <select
          value={currentMember}
          onChange={(event) => setCurrentMember(event.target.value)}
          className="mt-2 block w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900"
        >
          <option value="">Select member</option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>
      </section>

      {currentMember ? (
        <div className="space-y-4">
          {summary && (
            <section className="border border-gray-300 bg-white p-4 rounded-sm">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-700">Remaining</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">₹{summary.remaining.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-700">Paid months</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{summary.paidMonths}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-700">Pending months</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{summary.pendingMonths}</p>
                </div>
              </div>
            </section>
          )}

          <section className="border border-gray-300 bg-white p-4 rounded-sm">
            <h2 className="font-semibold text-gray-900">Add Payment</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-gray-900">
                Month Number
                <input
                  name="monthNumber"
                  type="number"
                  value={form.monthNumber}
                  onChange={handleChange}
                  required
                  className="mt-2 block w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900"
                />
              </label>
              <label className="block text-sm font-medium text-gray-900">
                Amount
                <input
                  name="amount"
                  type="number"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  className="mt-2 block w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900"
                />
              </label>
              <label className="block text-sm font-medium text-gray-900 md:col-span-2">
                Status
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900"
                >
                  <option value="PAID">PAID</option>
                  <option value="UNPAID">UNPAID</option>
                </select>
              </label>
              {error && <div className="text-sm text-red-700 md:col-span-2">{error}</div>}
              <button
                type="submit"
                className="md:col-span-2 rounded bg-blue-800 px-4 py-2 text-white hover:bg-blue-900"
              >
                Save Payment
              </button>
            </form>
          </section>

          <section className="border border-gray-300 bg-white p-4 rounded-sm">
            <h2 className="font-semibold text-gray-900">Payment History</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full border-collapse text-sm text-gray-900">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border border-gray-300 px-3 py-2 text-left">Month</th>
                    <th className="border border-gray-300 px-3 py-2 text-left">Amount</th>
                    <th className="border border-gray-300 px-3 py-2 text-left">Status</th>
                    <th className="border border-gray-300 px-3 py-2 text-left">Paid At</th>
                    <th className="border border-gray-300 px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length ? (
                    payments.map((payment, index) => (
                      <tr key={payment._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                        <td className="border border-gray-300 px-3 py-2">{payment.monthNumber}</td>
                        <td className="border border-gray-300 px-3 py-2">₹{payment.amount.toLocaleString()}</td>
                        <td className={`border border-gray-300 px-3 py-2 ${payment.status === 'UNPAID' ? 'text-red-600' : 'text-green-600'}`}>
                          {payment.status}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">{payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : '-'}</td>
                        <td className="border border-gray-300 px-3 py-2">
                          <button
                            onClick={() => handleToggleStatus(payment)}
                            className="rounded border border-gray-300 bg-gray-100 px-2 py-1 text-xs"
                          >
                            {payment.status === 'PAID' ? 'Mark Unpaid' : 'Mark Paid'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="border border-gray-300 px-3 py-6 text-center text-gray-600">
                        No payments recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : (
        <div className="border border-gray-300 bg-white p-4 text-gray-700">Please select a member to view payment history.</div>
      )}
    </div>
  );
};

export default Payments;
