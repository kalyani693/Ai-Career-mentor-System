import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import { Bot, UserPlus, Upload, FileCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import Alert from '../components/Alert';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Full_Name: '',
    Username: '',
    Email: '',
    Password: '',
    Highest_Class: '',
    Career_goal: '',
    University: '',
    CGPA: '',
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.type !== 'application/pdf') {
        setErrorMsg('Only PDF resume files are supported by the AI parser.');
        return;
      }
      setResumeFile(selected);
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Field Validations matching backend Pydantic model
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

    const parsedCgpa = parseFloat(formData.CGPA);
    if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10) {
      setErrorMsg('Please enter a valid CGPA between 0.0 and 10.0');
      return;
    }

    function toTitlecase(str){
      return str.
      toLowerCase().
      split(' ').
      map(word=> word.charAt(0).
      toUpperCase()+ word.slice(1)).join(' ');

    };


    const payload = {
      Full_Name: toTitlecase(formData.Full_Name),
      Username: formData.Username,
      Email: formData.Email,
      Password: formData.Password,
      Highest_Class: formData.Highest_Class,
      Career_goal: toTitlecase(formData.Career_goal),
      University: toTitlecase(formData.University),
      CGPA: parsedCgpa,
    };

    setLoading(true);
    try {
      const res = await registerUser(payload, resumeFile);
      setSuccessMsg(res.Result || 'Registration completed successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const detail = 'Registration failed.';//err.response?.data?.detail || err.message || 
      setErrorMsg(typeof detail === 'object' ? JSON.stringify(detail) : detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link to="/" className="inline-flex items-center space-x-3 group mb-4">
          
          <span className="font-extrabold text-slate-900 text-2xl tracking-tight">
            AI Career <span className="text-brand-700">Mentor</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Create Your Mentee Account
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Get started with AI-driven resume scoring and career roadmap planning
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200/80 sm:rounded-2xl sm:px-10">
          {errorMsg && <Alert type="error" message={errorMsg} className="mb-6" onClose={() => setErrorMsg('')} />}
          {successMsg && <Alert type="success" message={successMsg} className="mb-6" />}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="Full_Name"
                  required
                  value={formData.Full_Name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-brand-700 focus:border-brand-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
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
                  placeholder="john12"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-brand-700 focus:border-brand-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email (Gmail/Yahoo/Outlook)
                </label>
                <input
                  type="email"
                  name="Email"
                  required
                  value={formData.Email}
                  onChange={handleChange}
                  placeholder="john@gmail.com"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-brand-700 focus:border-brand-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Password (Exact 8 chars)
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
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-brand-700 focus:border-brand-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Highest Class / Degree
                </label>
                <input
                  type="text"
                  name="Highest_Class"
                  required
                  value={formData.Highest_Class}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech 3rd Year"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-brand-700 focus:border-brand-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Target Career Goal
                </label>
                <input
                  type="text"
                  name="Career_goal"
                  required
                  value={formData.Career_goal}
                  onChange={handleChange}
                  placeholder="e.g. Data Scientist / SDE"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-brand-700 focus:border-brand-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  University / College
                </label>
                <input
                  type="text"
                  name="University"
                  required
                  value={formData.University}
                  onChange={handleChange}
                  placeholder="e.g. MIT"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-brand-700 focus:border-brand-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  CGPA / Grade
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="CGPA"
                  required
                  value={formData.CGPA}
                  onChange={handleChange}
                  placeholder="e.g. 8.5"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-brand-700 focus:border-brand-700"
                />
              </div>
            </div>

            {/* Optional Resume Upload Dropzone */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Upload Resume PDF (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-brand-600 transition-colors bg-slate-50/50">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload-register"
                />
                <label htmlFor="resume-upload-register" className="cursor-pointer flex flex-col items-center">
                  {resumeFile ? (
                    <div className="flex items-center space-x-2 text-brand-800 font-medium">
                      <FileCheck className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm truncate max-w-xs">{resumeFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-xs text-slate-600 font-medium">
                        Click to select PDF or drag & drop file
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                icon={UserPlus}
                className="w-full"
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-900">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
