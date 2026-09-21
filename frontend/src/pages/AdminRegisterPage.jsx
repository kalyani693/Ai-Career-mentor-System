import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerAdmin } from '../api/auth';
import { ShieldCheck, UserPlus } from 'lucide-react';
import Button from '../components/Button';
import Alert from '../components/Alert';

const AdminRegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Full_Name: '',
    Username: '',
    Email: '',
    Password: '',
    Profession: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (formData.Username.length < 5 || formData.Username.length > 8) {
      setErrorMsg('Username must be between 5 and 8 characters long.');
      return;
    }
    if (formData.Password.length !== 8) {
      setErrorMsg('Password must be exactly 8 characters long.');
      return;
    }

    const emailDomain = formData.Email.split('@')[1];
    const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    if (!emailDomain || !validDomains.includes(emailDomain.toLowerCase())) {
      setErrorMsg(`Email domain must be one of: ${validDomains.join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      const res = await registerAdmin(formData);
      setSuccessMsg(res.Result || 'Admin Registration completed! Redirecting to login...');
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Admin registration failed.';
      setErrorMsg(typeof detail === 'object' ? JSON.stringify(detail) : detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-3 group mb-4">
          <div className="w-12 h-12 rounded-xl bg-brand-700 text-white flex items-center justify-center shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="font-extrabold text-white text-2xl tracking-tight">
            Admin <span className="text-brand-400">Portal</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Register New Admin Account</h2>
        <p className="mt-1 text-sm text-slate-400">
          Create administrative credentials for platform management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/90 py-8 px-4 shadow-xl border border-slate-700 sm:rounded-2xl sm:px-10">
          {errorMsg && <Alert type="error" message={errorMsg} className="mb-6" onClose={() => setErrorMsg('')} />}
          {successMsg && <Alert type="success" message={successMsg} className="mb-6" />}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="Full_Name"
                required
                value={formData.Full_Name}
                onChange={handleChange}
                placeholder="Admin Name"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Username (5-8 chars)
              </label>
              <input
                type="text"
                name="Username"
                required
                minLength={5}
                maxLength={8}
                value={formData.Username}
                onChange={handleChange}
                placeholder="admuser"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                name="Email"
                required
                value={formData.Email}
                onChange={handleChange}
                placeholder="admin@gmail.com"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Password (exact 8 chars)
              </label>
              <input
                type="password"
                name="Password"
                required
                minLength={8}
                maxLength={8}
                value={formData.Password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Profession / Designation
              </label>
              <input
                type="text"
                name="Profession"
                required
                value={formData.Profession}
                onChange={handleChange}
                placeholder="Lead Career Strategist"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:ring-brand-500"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                icon={UserPlus}
                className="w-full bg-brand-700 hover:bg-brand-600"
              >
                Register Admin
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already registered as Admin?{' '}
            <Link to="/admin/login" className="font-semibold text-brand-400 hover:text-brand-300">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegisterPage;
