import React, { useState, useEffect } from 'react';
import { getAdminStats, getAllUsersData, getUserByEmail } from '../api/admin';
import {
  ShieldCheck,
  Users,
  UserCheck,
  UserX,
  Search,
  RefreshCw,
  Mail,
  GraduationCap,
  Calendar,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Alert from '../components/Alert';
import Skeleton from '../components/Skeleton';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Email search state
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [statsRes, usersRes] = await Promise.all([
        getAdminStats(),
        getAllUsersData(),
      ]);
      setStats(statsRes);
      setUsersList(Array.isArray(usersRes) ? usersRes : []);
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Failed to load admin data.';
      setErrorMsg(typeof detail === 'object' ? JSON.stringify(detail) : detail);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleEmailSearch = async (e) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;

    setSearchLoading(true);
    setSearchResult(null);
    try {
      const res = await getUserByEmail(searchEmail.trim());
      setSearchResult(res.user_info || null);
    } catch (err) {
      setErrorMsg('User with specified email not found.');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-700 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Admin User Management & Statistics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor system user registration metrics, account statuses, and database records.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={RefreshCw}
          loading={loading}
          onClick={fetchAdminData}
        >
          Refresh Stats
        </Button>
      </div>

      {errorMsg && <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />}

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-brand-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-brand-50 text-brand-800 rounded-xl">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Total Registered Users
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                {loading ? <Skeleton className="h-8 w-16" /> : stats?.['Total users'] ?? 0}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <UserCheck className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Active Users
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                {loading ? <Skeleton className="h-8 w-16" /> : stats?.['Active Users'] ?? 0}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-600">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
              <UserX className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Existing / Deactivated
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                {loading ? <Skeleton className="h-8 w-16" /> : stats?.['Exsisting Users'] ?? 0}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {/* User Lookup by Email */}
      <Card title="Lookup Candidate Record by Email" icon={Search}>
        <form onSubmit={handleEmailSearch} className="flex items-center space-x-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Enter user email address..."
              className="w-full pl-10 pr-3 py-2 border rounded-xl text-sm focus:ring-brand-700 focus:border-brand-700"
            />
          </div>
          <Button type="submit" variant="primary" size="md" loading={searchLoading} icon={Search}>
            Search Email
          </Button>
        </form>

        {searchResult && (
          <div className="mt-4 p-4 bg-brand-50/60 border border-brand-200 rounded-xl text-xs space-y-2">
            <p className="font-bold text-slate-900 text-sm">Found Candidate Record:</p>
            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <p><strong>Name:</strong> {searchResult.Full_Name}</p>
              <p><strong>Username:</strong> {searchResult.Username}</p>
              <p><strong>Email:</strong> {searchResult.Email}</p>
              <p><strong>Career Goal:</strong> {searchResult.Career_goal}</p>
              <p><strong>Status:</strong> {searchResult.is_active ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Registered Users Table */}
      <Card title="Registered Candidates Database" icon={Users}>
        {loading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Career Goal</th>
                  <th className="py-3 px-4">University & Class</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      No user records found in database.
                    </td>
                  </tr>
                ) : (
                  usersList.map((usr, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div>{usr.Full_Name || 'N/A'}</div>
                        <div className="text-[11px] text-slate-400 font-mono">@{usr.Username}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{usr.Email}</td>
                      <td className="py-3 px-4 font-medium text-brand-800">{usr.Career_goal || 'N/A'}</td>
                      <td className="py-3 px-4 text-slate-600">
                        <div>{usr.University || 'N/A'}</div>
                        <div className="text-[11px] text-slate-400">{usr.Highest_Class}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{usr.CGPA ?? 'N/A'}</td>
                      <td className="py-3 px-4">
                        {usr.is_active ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="danger">Inactive</Badge>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
