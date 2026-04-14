import { useEffect, useState } from 'react';
import api from '../api/api.js';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await api.get('/dashboard');
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load dashboard');
      }
    };
    loadStats();
  }, []);

  if (error) {
    return <div className="border border-red-300 bg-white p-4 text-red-700">Error: {error}</div>;
  }

  if (!stats) {
    return <div className="border border-gray-300 bg-white p-4">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-4">
      <section className="border border-gray-300 bg-white p-4 rounded-sm">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-700">Overview of current collection and due status.</p>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="border border-gray-300 bg-white p-4 rounded-sm">
          <p className="text-sm text-gray-700">Total Members</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalMembers}</p>
        </div>
        <div className="border border-gray-300 bg-white p-4 rounded-sm">
          <p className="text-sm text-gray-700">Total Collected</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">₹{stats.totalCollected.toLocaleString()}</p>
        </div>
        <div className="border border-gray-300 bg-white p-4 rounded-sm">
          <p className="text-sm text-gray-700">Total Pending</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">₹{stats.totalPending.toLocaleString()}</p>
        </div>
      </div>

      <section className="border border-gray-300 bg-white p-4 rounded-sm">
        <h2 className="text-lg font-semibold text-gray-900">Overdue Members</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm text-gray-900">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Remaining</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.overdueMembers.map((member, index) => (
                <tr key={member._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                  <td className="border border-gray-300 px-3 py-2">{member.name}</td>
                  <td className="border border-gray-300 px-3 py-2">₹{member.remaining?.toLocaleString() || '0'}</td>
                  <td className="border border-gray-300 px-3 py-2 text-red-600">Pending</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
