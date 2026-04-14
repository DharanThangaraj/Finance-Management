import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api.js';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMembers = async () => {
    try {
      const response = await api.get('/members');
      setMembers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this member and all payments?')) return;
    try {
      await api.delete(`/members/${id}`);
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete member');
    }
  };

  const filtered = members.filter((member) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    return member.name.toLowerCase().includes(query) || member.phone.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-4">
      <section className="border border-gray-300 bg-white p-4 rounded-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Members</h1>
            <p className="text-sm text-gray-700">Manage member accounts and dues.</p>
          </div>
          <Link
            to="/members/new"
            className="rounded border border-gray-400 bg-gray-900 px-3 py-2 text-sm font-medium text-white"
          >
            Add Member
          </Link>
        </div>
      </section>

      <section className="border border-gray-300 bg-white p-4 rounded-sm">
        <label className="block text-sm font-medium text-gray-900">Search members</label>
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by name or phone"
          className="mt-2 block w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900"
        />
      </section>

      {loading ? (
        <div className="border border-gray-300 bg-white p-4 text-gray-700">Loading members...</div>
      ) : error ? (
        <div className="border border-red-300 bg-white p-4 text-red-700">{error}</div>
      ) : (
        <div className="overflow-x-auto border border-gray-300 bg-white rounded-sm">
          <table className="min-w-full border-collapse text-sm text-gray-900">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Name</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Phone</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Total Amount</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Paid</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Due</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Status</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((member, index) => (
                <tr key={member._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                  <td className="border border-gray-300 px-3 py-2">{member.name}</td>
                  <td className="border border-gray-300 px-3 py-2">{member.phone}</td>
                  <td className="border border-gray-300 px-3 py-2">₹{member.totalAmount.toLocaleString()}</td>
                  <td className="border border-gray-300 px-3 py-2">{member.summary.paidMonths}</td>
                  <td className="border border-gray-300 px-3 py-2 text-red-600">{member.summary.pendingMonths}</td>
                  <td className={`border border-gray-300 px-3 py-2 text-sm font-semibold ${member.summary.pendingMonths > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {member.summary.pendingMonths > 0 ? 'Pending' : 'Paid'}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 space-x-1">
                    <Link className="rounded border border-gray-300 bg-white px-2 py-1 text-xs" to={`/members/${member._id}/edit`}>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="rounded border border-red-300 bg-red-100 px-2 py-1 text-xs text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Members;
