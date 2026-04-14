import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api.js';

const MemberForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    joiningDate: '',
    totalAmount: '',
    durationMonths: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchMember = async () => {
      try {
        const response = await api.get(`/members/${id}`);
        const member = response.data;
        setForm({
          name: member.name,
          phone: member.phone,
          address: member.address,
          joiningDate: member.joiningDate.slice(0, 10),
          totalAmount: member.totalAmount,
          durationMonths: member.durationMonths,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load member');
      }
    };
    fetchMember();
  }, [id]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      if (id) {
        await api.put(`/members/${id}`, form);
      } else {
        await api.post('/members', form);
      }
      navigate('/members');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save member');
    }
  };

  return (
    <div className="space-y-4">
      <section className="border border-slate-300 bg-white p-4">
        <h1 className="text-xl font-bold text-slate-900">{id ? 'Edit Member' : 'Add New Member'}</h1>
        <p className="mt-2 text-sm text-slate-700">
          {id ? 'Update member information and dues settings.' : 'Create a new member account.'}
        </p>
      </section>

      <section className="border border-slate-300 bg-white p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-900">
            Full Name
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900"
            />
          </label>
          <label className="block text-sm font-medium text-slate-900">
            Phone
            <input
              name="phone"
              type="text"
              value={form.phone}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900"
            />
          </label>
          <label className="block text-sm font-medium text-slate-900">
            Address
            <input
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900"
            />
          </label>
          <label className="block text-sm font-medium text-slate-900">
            Joining Date
            <input
              name="joiningDate"
              type="date"
              value={form.joiningDate}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900"
            />
          </label>
          <label className="block text-sm font-medium text-slate-900">
            Total Amount (₹)
            <input
              name="totalAmount"
              type="number"
              value={form.totalAmount}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900"
            />
          </label>
          <label className="block text-sm font-medium text-slate-900">
            Duration (months)
            <input
              name="durationMonths"
              type="number"
              value={form.durationMonths}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900"
            />
          </label>
          {error && <div className="text-sm text-rose-700">{error}</div>}
          <button type="submit" className="rounded border border-slate-600 bg-slate-900 px-3 py-2 text-white">
            Save Member
          </button>
        </form>
      </section>
    </div>
  );
};

export default MemberForm;
