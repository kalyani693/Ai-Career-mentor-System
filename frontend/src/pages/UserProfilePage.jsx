import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { editProfile, editResume, editProfilePic } from '../api/profile';
import { deleteUserAccount } from '../api/auth';
import { User, Edit, Upload, Trash2, Check, Sparkles, FileText, AlertTriangle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Badge from '../components/Badge';

const UserProfilePage = () => {
  const { user, refreshProfile, logout } = useAuth();

  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState('');
  const [loadingField, setLoadingField] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // File states
  const [newResume, setNewResume] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  const [newPic, setNewPic] = useState(null);
  const [picLoading, setPicLoading] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleStartEdit = (field, currentVal) => {
    setEditingField(field);
    setFieldValue(currentVal || '');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSaveEdit = async (field) => {
    if (!fieldValue.trim()) return;
    setErrorMsg('');
    setSuccessMsg('');
    setLoadingField(true);

    try {
      const res = await editProfile(field, fieldValue.trim());
      setSuccessMsg(res.response || `${field} updated successfully!`);
      setEditingField(null);
      await refreshProfile();
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Failed to update field.';
      setErrorMsg(typeof detail === 'object' ? JSON.stringify(detail) : detail);
    } finally {
      setLoadingField(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setNewResume(file);
      setResumeLoading(true);
      setErrorMsg('');
      setSuccessMsg('');

      try {
        const res = await editResume(file);
        setSuccessMsg(res.response || 'Resume updated successfully!');
        await refreshProfile();
      } catch (err) {
        const detail = err.response?.data?.detail || err.message || 'Failed to upload new resume.';
        setErrorMsg(typeof detail === 'object' ? JSON.stringify(detail) : detail);
      } finally {
        setResumeLoading(false);
      }
    } else {
      setErrorMsg('Please select a valid PDF file.');
    }
  };

  const handlePicUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPic(file);
      setPicLoading(true);
      setErrorMsg('');
      setSuccessMsg('');

      try {
        const res = await editProfilePic(file);
        setSuccessMsg(res.response || 'Profile picture updated successfully!');
        await refreshProfile();
      } catch (err) {
        const detail = err.response?.data?.detail || err.message || 'Failed to update profile picture.';
        setErrorMsg(typeof detail === 'object' ? JSON.stringify(detail) : detail);
      } finally {
        setPicLoading(false);
      }
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await deleteUserAccount();
      logout();
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Failed to delete account.';
      setErrorMsg(typeof detail === 'object' ? JSON.stringify(detail) : detail);
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const editableFields = [
    { key: 'Full_Name', label: 'Full Name' },
    { key: 'Highest_Class', label: 'Highest Class / Degree' },
    { key: 'Career_goal', label: 'Career Goal' },
    { key: 'University', label: 'University / Institute' },
    { key: 'CGPA', label: 'CGPA Grade' },
  ];

  function toTitlecase(str){
  return str.
  toLowerCase().
  split(' ').
  map(word=> word.charAt(0).
  toUpperCase()+ word.slice(1)).join(' ');

};

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-700 uppercase tracking-wider mb-1">
            <User className="w-4 h-4 text-brand-600" />
            <span>Account Settings</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            User Profile & Resume Credentials
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal data, academic credentials, and stored resume file.
          </p>
        </div>

        <Button
          variant="danger"
          size="sm"
          icon={Trash2}
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </Button>
      </div>

      {errorMsg && <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />}
      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Resume Updates */}
        <div className="space-y-6">
          <Card className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-brand-800 text-white font-black text-3xl flex items-center justify-center mx-auto shadow-md">
                {toTitlecase(user?.Full_Name ? user.Full_Name.charAt(0).toUpperCase() : 'U')}
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900">{toTitlecase(user?.Full_Name || 'Candidate')}</h3>
            <p className="text-xs text-slate-500 font-medium">@{user?.Username}</p>
            <p className="text-xs text-brand-700 font-semibold mt-1">{user?.Email}</p>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <label
                htmlFor="pic-upload-input"
                className="cursor-pointer text-xs font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center space-x-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{picLoading ? 'Uploading Picture...' : 'Update Profile Picture'}</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePicUpload}
                className="hidden"
                id="pic-upload-input"
              />
            </div>
          </Card>

          {/* Stored Resume Card */}
          <Card title="Resume Storage" icon={FileText}>
            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                Update your registered PDF resume file to keep your AI analysis fresh:
              </p>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-brand-600 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                  id="resume-profile-upload"
                />
                <label htmlFor="resume-profile-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="font-semibold text-brand-700">
                    {resumeLoading ? 'Uploading Resume...' : 'Upload New Resume PDF'}
                  </span>
                </label>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Editable Profile Details */}
        <div className="lg:col-span-2">
          <Card title="Academic & Profile Credentials" icon={Sparkles}>
            <div className="divide-y divide-slate-100">
              {editableFields.map((field) => {
                const isEditing = editingField === field.key;
                const val =user ? user[field.key]: '';

                return (
                  <div key={field.key} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                        {field.label}
                      </span>
                      {isEditing ? (
                        <div className="flex items-center space-x-2 mt-1">
                          <input
                            type={field.key === 'CGPA' ? 'number' : 'text'}
                            step="0.01"
                            value={fieldValue}
                            onChange={(e) => setFieldValue(e.target.value)}
                            className="px-3 py-1.5 border rounded-lg text-sm w-full max-w-xs focus:ring-brand-700"
                          />
                          <Button
                            variant="primary"
                            size="sm"
                            loading={loadingField}
                            icon={Check}
                            onClick={() => handleSaveEdit(field.key)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingField(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm font-semibold text-slate-900 block">
                          {val !== undefined && val !== null ? String(val) : 'Not specified'}
                        </span>
                      )}
                    </div>

                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(field.key, val)}
                        className="text-xs font-medium text-brand-700 hover:text-brand-900 flex items-center space-x-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Confirm Account Deletion</h3>
            <p className="text-xs text-slate-600 mt-2 mb-6 leading-relaxed">
              Are you sure you want to deactivate your account? Your status will be set to inactive. You can reactivate it anytime using the Renew Account option.
            </p>

            <div className="flex justify-end space-x-3">
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                loading={deleteLoading}
                onClick={handleDeleteAccount}
              >
                Deactivate My Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
