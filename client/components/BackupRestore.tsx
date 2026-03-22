'use client';

import { useState } from 'react';

export default function BackupRestore() {
  const [backupStatus, setBackupStatus] = useState<'idle' | 'backing-up' | 'success' | 'error'>('idle');
  const [restoreStatus, setRestoreStatus] = useState<'idle' | 'restoring' | 'success' | 'error'>('idle');

  const handleBackup = () => {
    setBackupStatus('backing-up');
    
    // Simulate backup process
    setTimeout(() => {
      // Create backup data (in real app, this would be actual data from your system)
      const backupData = {
        timestamp: new Date().toISOString(),
        entries: [],
        creditors: [],
        inventory: [],
        staff: [],
        savings: [],
        pigmyR: [],
        attendance: []
      };

      // Create and download backup file
      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `accounts-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      setBackupStatus('success');
      
      setTimeout(() => setBackupStatus('idle'), 3000);
    }, 2000);
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setRestoreStatus('restoring');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string);
        
        // Simulate restore process
        setTimeout(() => {
          console.log('Restoring data:', backupData);
          setRestoreStatus('success');
          setTimeout(() => setRestoreStatus('idle'), 3000);
        }, 2000);
      } catch (error) {
        console.error('Invalid backup file:', error);
        setRestoreStatus('error');
        setTimeout(() => setRestoreStatus('idle'), 3000);
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Backup & Restore</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Backup Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="ri-download-cloud-line w-8 h-8 text-blue-600 flex items-center justify-center"></i>
              <h2 className="text-xl font-semibold text-blue-800">Backup Data</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Create a backup of all your accounts data including entries, creditors, inventory, staff records, and more.
            </p>

            <button
              onClick={handleBackup}
              disabled={backupStatus === 'backing-up'}
              className={`w-full py-3 rounded-lg font-medium transition duration-200 cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 ${
                backupStatus === 'backing-up'
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : backupStatus === 'success'
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {backupStatus === 'backing-up' && (
                <i className="ri-loader-4-line w-5 h-5 animate-spin flex items-center justify-center"></i>
              )}
              {backupStatus === 'success' && (
                <i className="ri-check-line w-5 h-5 flex items-center justify-center"></i>
              )}
              {backupStatus === 'idle' && (
                <i className="ri-download-line w-5 h-5 flex items-center justify-center"></i>
              )}
              
              {backupStatus === 'backing-up' && 'Creating Backup...'}
              {backupStatus === 'success' && 'Backup Created Successfully'}
              {backupStatus === 'idle' && 'Create Backup'}
            </button>

            {backupStatus === 'success' && (
              <p className="text-sm text-green-600 mt-2 text-center">
                Backup file has been downloaded to your computer
              </p>
            )}
          </div>

          {/* Restore Section */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="ri-upload-cloud-line w-8 h-8 text-orange-600 flex items-center justify-center"></i>
              <h2 className="text-xl font-semibold text-orange-800">Restore Data</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Restore your accounts data from a previously created backup file. This will replace all current data.
            </p>

            <div className="mb-4">
              <input
                type="file"
                accept=".json"
                onChange={handleRestore}
                disabled={restoreStatus === 'restoring'}
                className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              />
            </div>

            {restoreStatus === 'restoring' && (
              <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <i className="ri-loader-4-line w-5 h-5 animate-spin text-orange-600 flex items-center justify-center"></i>
                  <span className="text-orange-800">Restoring data...</span>
                </div>
              </div>
            )}

            {restoreStatus === 'success' && (
              <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <i className="ri-check-line w-5 h-5 text-green-600 flex items-center justify-center"></i>
                  <span className="text-green-800">Data restored successfully</span>
                </div>
              </div>
            )}

            {restoreStatus === 'error' && (
              <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <i className="ri-error-warning-line w-5 h-5 text-red-600 flex items-center justify-center"></i>
                  <span className="text-red-800">Invalid backup file</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <i className="ri-warning-line w-5 h-5 text-yellow-600 mt-0.5 flex items-center justify-center"></i>
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">Important Notes</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Regular backups help protect your data from loss</li>
                <li>• Store backup files in a safe location</li>
                <li>• Restoring data will replace all current information</li>
                <li>• Only restore backup files created by this system</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}