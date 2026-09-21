import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { renewAdminAccount } from '../api/auth';
import { ShieldCheck, LogIn, Lock, User, RefreshCw } from 'lucide-react';
import Button from '../components/Button';
import Alert from '../components/Alert';

const AdminLoginPage = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Renew Admin Account Modal
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewUsername, setRenewUsername] = useState('');
  const [renewPassword, setRenewPassword] = useState('');
  const [renewLoading, setRenewLoading] = useState(false);
  const [renewError, setRenewError] = useState('');
  const [renewSuccess, setRenewSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (username.length < 5 || username.length > 8) {
      setErrorMsg('Username must be between 5 and 8 characters long.');
      return;
    }
    if (password.length !== 8) {
      setErrorMsg('Password must be exactly 8 characters long.');
      return;
    }

    setLoading(true);
    const result = await adminLogin(username, password);
    setLoading(false);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMsg(typeof result.error === 'string' ? result.error : 'Admin login failed.');
    }
  };

  const handleRenew = async (e) => {
    e.preventDefault();
    setRenewError('');
    setRenewSuccess('');

    setRenewLoading(true);
    try {
      const res = await renewAdminAccount(renewUsername, renewPassword);
      setRenewSuccess(res.response || 'Admin account reactivated successfully!');
      setRenewLoading(false);
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Renewal failed.';
      setRenewError(typeof detail === 'object' ? JSON.stringify(detail) : detail);
      setRenewLoading(false);
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
        <h2 className="text-2xl font-bold tracking-tight">System Administration Login</h2>
        <p className="mt-1 text-sm text-slate-400">
          Access platform metrics, user management, and system stats
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/90 py-8 px-4 shadow-xl border border-slate-700 sm:rounded-2xl sm:px-10">
          {errorMsg && <Alert type="error" message={errorMsg} className="mb-6" onClose={() => setErrorMsg('')} />}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Username (5-8 chars)
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  maxLength={8}
                  minLength={5}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin01"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Password (exact 8 chars)
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  maxLength={8}
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                icon={LogIn}
                className="w-full bg-brand-700 hover:bg-brand-600"
              >
                Sign In as Admin
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                setRenewUsername(username);
                setShowRenewModal(true);
              }}
              className="text-brand-400 hover:text-brand-300 font-medium flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Renew Admin Account</span>
            </button>
            <Link to="/admin/register" className="text-slate-400 hover:text-white font-medium">
              Register New Admin
            </Link>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            User looking for candidate portal?{' '}
            <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300">
              User Login
            </Link>
          </div>
        </div>
      </div>

      {/* Renew Modal */}
      {showRenewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-slate-900">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold">Renew Admin Account</h3>
            {renewError && <Alert type="error" message={renewError} className="my-3" />}
            {renewSuccess && <Alert type="success" message={renewSuccess} className="my-3" />}

            <form onSubmit={handleRenew} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={renewUsername}
                  onChange={(e) => setRenewUsername(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={renewPassword}
                  onChange={(e) => setRenewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="ghost" size="sm" onClick={() => setShowRenewModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" loading={renewLoading}>
                  Reactivate
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLoginPage;
