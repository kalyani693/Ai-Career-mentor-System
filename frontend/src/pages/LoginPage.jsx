import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { renewUserAccount } from '../api/auth';
import { Bot, LogIn, Lock, User, RefreshCw, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import Alert from '../components/Alert';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Account Renewal Modal state
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewUsername, setRenewUsername] = useState('');
  const [renewPassword, setRenewPassword] = useState('');
  const [renewLoading, setRenewLoading] = useState(false);
  const [renewError, setRenewError] = useState('');
  const [renewSuccess, setRenewSuccess] = useState('');

  // Check if redirected due to session expiry
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired')) {
      setErrorMsg('Your session has expired. Please sign in again.');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Form Client-side Validation (matching backend constraints)
    if (username.length < 5 || username.length > 8) {
      setErrorMsg('Username must be between 5 and 8 characters long.');
      return;
    }

    if (password.length !== 8) {
      setErrorMsg('Password must be exactly 8 characters long.');
      return;
    }

    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(typeof result.error === 'string' ? result.error : 'Login failed. Please check credentials.');
    }
  };

  const handleRenewAccount = async (e) => {
    e.preventDefault();
    setRenewError('');
    setRenewSuccess('');

    if (renewUsername.length < 5 || renewUsername.length > 8) {
      setRenewError('Username must be between 5 and 8 characters.');
      return;
    }
    if (renewPassword.length !== 8) {
      setRenewError('Password must be exactly 8 characters.');
      return;
    }

    setRenewLoading(true);
    try {
      const res = await renewUserAccount(renewUsername, renewPassword);
      setRenewSuccess(res.response || 'Your account has been reactivated! You can now sign in.');
      setRenewLoading(false);
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Renewal failed.';
      setRenewError(typeof detail === 'object' ? JSON.stringify(detail) : detail);
      setRenewLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-3 group mb-4">
         
          <span className="font-extrabold text-slate-900 text-2xl tracking-tight">
            AI Career <span className="text-brand-700">Mentor</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome back to your workspace
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to access your AI Resume Analysis & Career Roadmap
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200/80 sm:rounded-2xl sm:px-10">
          {errorMsg && (
            <Alert
              type="error"
              message={errorMsg}
              className="mb-6"
              onClose={() => setErrorMsg('')}
            />
          )}

          {successMsg && (
            <Alert
              type="success"
              message={successMsg}
              className="mb-6"
              onClose={() => setSuccessMsg('')}
            />
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Username (5-8 chars)
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
                  placeholder="e.g. john123"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password (exact 8 chars)
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
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700"
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
                className="w-full"
              >
                Sign In
              </Button>
            </div>
          </form>

          {/* Account Renewal Trigger */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                setRenewUsername(username);
                setShowRenewModal(true);
              }}
              className="text-brand-700 hover:text-brand-900 font-medium flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Renew Deleted Account?</span>
            </button>
            <Link to="/admin/login" className="text-slate-500 hover:text-slate-800 font-medium">
              Admin Portal
            </Link>
          </div>

          <div className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-900">
              Create one now
            </Link>
          </div>
        </div>
      </div>

      {/* Account Renewal Modal */}
      {showRenewModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-brand-700" />
              <span>Renew Soft-Deleted Account</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              If your account was deleted previously, enter your credentials to reactivate it.
            </p>

            {renewError && <Alert type="error" message={renewError} className="mb-4" />}
            {renewSuccess && <Alert type="success" message={renewSuccess} className="mb-4" />}

            <form onSubmit={handleRenewAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={renewUsername}
                  onChange={(e) => setRenewUsername(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
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
                  Close
                </Button>
                <Button type="submit" variant="primary" size="sm" loading={renewLoading}>
                  Reactivate Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
