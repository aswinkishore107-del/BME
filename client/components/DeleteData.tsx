'use client';

import { useState } from 'react';

export default function DeleteData() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'deleting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
    setAdminPassword('');
    setDeleteStatus('idle');
    setErrorMessage('');
  };

  const handleConfirmDelete = () => {
    // Check admin password (in real app, this would be properly authenticated)
    if (adminPassword !== 'admin123') {
      setErrorMessage('Incorrect admin password');
      return;
    }

    setDeleteStatus('deleting');
    setErrorMessage('');

    // Simulate deletion process
    setTimeout(() => {
      console.log('All data deleted');
      setDeleteStatus('success');
      
      setTimeout(() => {
        setShowConfirmModal(false);
        setDeleteStatus('idle');
        setAdminPassword('');
      }, 2000);
    }, 3000);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setAdminPassword('');
    setDeleteStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-6">Delete All Data</h1>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <i className="ri-error-warning-fill w-8 h-8 text-red-600 mt-1 flex items-center justify-center"></i>
            <div>
              <h2 className="text-xl font-semibold text-red-800 mb-3">Danger Zone</h2>
              <p className="text-red-700 mb-4">
                This action will permanently delete all data from the system including:
              </p>
              <ul className="text-red-700 mb-6 space-y-1">
                <li>• All entry records</li>
                <li>• Creditors information</li>
                <li>• Inventory data</li>
                <li>• Staff records</li>
                <li>• Savings accounts</li>
                <li>• Pigmy R entries</li>
                <li>• Attendance records</li>
                <li>• All other system data</li>
              </ul>
              <p className="text-red-700 font-medium mb-6">
                This action cannot be undone. Make sure you have created a backup before proceeding.
              </p>
              
              <button
                onClick={handleDeleteClick}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2 font-medium"
              >
                <i className="ri-delete-bin-fill w-5 h-5 flex items-center justify-center"></i>
                Delete All Data
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <i className="ri-information-line w-5 h-5 text-blue-600 mt-0.5 flex items-center justify-center"></i>
            <div>
              <h3 className="font-medium text-blue-800 mb-1">Before You Delete</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Create a backup of your data using the Backup & Restore feature</li>
                <li>• Inform all users about the data deletion</li>
                <li>• Ensure you have admin privileges to perform this action</li>
                <li>• Consider archiving important data separately</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <i className="ri-error-warning-fill w-8 h-8 text-red-600 flex items-center justify-center"></i>
              <h2 className="text-xl font-bold text-red-800">Confirm Data Deletion</h2>
            </div>
            
            <p className="text-gray-700 mb-6">
              To proceed with deleting all data, please enter the admin password.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter admin password"
                disabled={deleteStatus === 'deleting'}
              />
              {errorMessage && (
                <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
              )}
            </div>

            {deleteStatus === 'deleting' && (
              <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <i className="ri-loader-4-line w-5 h-5 animate-spin text-red-600 flex items-center justify-center"></i>
                  <span className="text-red-800">Deleting all data...</span>
                </div>
              </div>
            )}

            {deleteStatus === 'success' && (
              <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <i className="ri-check-line w-5 h-5 text-green-600 flex items-center justify-center"></i>
                  <span className="text-green-800">All data deleted successfully</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleConfirmDelete}
                disabled={deleteStatus === 'deleting' || deleteStatus === 'success'}
                className={`flex-1 py-2 rounded-lg font-medium transition duration-200 cursor-pointer whitespace-nowrap ${
                  deleteStatus === 'deleting' || deleteStatus === 'success'
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {deleteStatus === 'deleting' ? 'Deleting...' : 'Delete All Data'}
              </button>
              <button
                onClick={handleCancel}
                disabled={deleteStatus === 'deleting'}
                className={`flex-1 py-2 rounded-lg font-medium transition duration-200 cursor-pointer whitespace-nowrap ${
                  deleteStatus === 'deleting'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}