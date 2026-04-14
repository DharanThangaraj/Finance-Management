import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md border border-slate-300 bg-white p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Finance Admin Login</h1>
          <p className="mt-2 text-sm text-slate-600">Enter your credentials to continue.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-900">
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none"
            />
          </label>
          <label className="block text-sm font-medium text-slate-900">
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none"
            />
          </label>
          {error && <div className="text-sm text-rose-700">{error}</div>}
          <button type="submit" className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-white">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
