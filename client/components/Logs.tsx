
'use client';

import { useState } from 'react';
import FilterBar from './FilterBar';

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  details: string;
  ipAddress?: string;
  module: string;
}

interface LogsProps {
  userRole: string;
  currentUser: string;
  logs: LogEntry[];
}

export default function Logs({ userRole, currentUser, logs }: LogsProps) {
  const [filter, setFilter] = useState('current-month');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (userRole !== 'Admin') {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center py-12">
            <i className="ri-lock-line w-16 h-16 flex items-center justify-center text-red-500 mx-auto mb-4"></i>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">Only administrators can view system logs.</p>
          </div>
        </div>
      </div>
    );
  }

  const modules = ['All', 'Dashboard', 'Entries', 'Staff', 'Attendance', 'Creditors', 'Inventory', 'Savings', 'Users', 'Login/Logout'];
  const users = ['All', ...Array.from(new Set(logs.map(log => log.user)))];

  const filteredLogs = logs.filter(log => {
    const matchesModule = moduleFilter === 'all' || moduleFilter === 'All' || log.module.toLowerCase().includes(moduleFilter.toLowerCase());
    const matchesUser = userFilter === 'all' || userFilter === 'All' || log.user === userFilter;
    const matchesSearch = searchTerm === '' || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesModule && matchesUser && matchesSearch;
  });

  const exportLogs = () => {
    const headers = ['Timestamp', 'User', 'Role', 'Module', 'Action', 'Details', 'IP Address'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.user,
        log.userRole,
        log.module,
        log.action,
        log.details.replace(/,/g, ';'),
        log.ipAddress || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getActionIcon = (action: string) => {
    if (action.includes('Login')) return 'ri-login-box-line text-green-600';
    if (action.includes('Logout')) return 'ri-logout-box-line text-red-600';
    if (action.includes('Add') || action.includes('Create')) return 'ri-add-circle-line text-blue-600';
    if (action.includes('Edit') || action.includes('Update') || action.includes('Modify')) return 'ri-edit-line text-yellow-600';
    if (action.includes('Delete')) return 'ri-delete-bin-line text-red-600';
    if (action.includes('View') || action.includes('Access')) return 'ri-eye-line text-gray-600';
    if (action.includes('Export') || action.includes('Download')) return 'ri-download-line text-purple-600';
    return 'ri-information-line text-blue-500';
  };

  const getModuleColor = (module: string) => {
    const colors = {
      'Dashboard': 'bg-blue-100 text-blue-800',
      'Entries': 'bg-green-100 text-green-800',
      'Staff': 'bg-purple-100 text-purple-800',
      'Attendance': 'bg-yellow-100 text-yellow-800',
      'Creditors': 'bg-red-100 text-red-800',
      'Inventory': 'bg-indigo-100 text-indigo-800',
      'Users': 'bg-pink-100 text-pink-800',
      'Login/Logout': 'bg-gray-100 text-gray-800'
    };
    return colors[module as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Activity Logs</h1>
            <p className="text-gray-600 mt-1">Monitor all user activities and system events</p>
          </div>
          <button
            onClick={exportLogs}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            <i className="ri-download-line w-4 h-4 flex items-center justify-center"></i>
            Export Logs
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-1">Total Logs</h3>
            <p className="text-2xl font-bold text-blue-900">{logs.length}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800 mb-1">Today's Activities</h3>
            <p className="text-2xl font-bold text-green-900">
              {logs.filter(log => log.timestamp.startsWith(new Date().toISOString().split('T')[0])).length}
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-800 mb-1">Active Users</h3>
            <p className="text-2xl font-bold text-purple-900">
              {new Set(logs.filter(log => log.timestamp.startsWith(new Date().toISOString().split('T')[0])).map(log => log.user)).size}
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800 mb-1">Critical Actions</h3>
            <p className="text-2xl font-bold text-yellow-900">
              {logs.filter(log => log.action.includes('Delete') || log.action.includes('Admin')).length}
            </p>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <FilterBar filter={filter} setFilter={setFilter} />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Module</label>
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                {modules.map(module => (
                  <option key={module} value={module.toLowerCase()}>{module}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by User</label>
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                {users.map(user => (
                  <option key={user} value={user.toLowerCase()}>{user}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Actions</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search in actions and details..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredLogs.length} of {logs.length} log entries
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Module</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Details</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">IP Address</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log, index) => (
                <tr key={`${log.id}-${log.timestamp}-${index}`} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs font-medium text-blue-600">
                          {log.user.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      log.userRole === 'Admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : log.userRole === 'Manager'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {log.userRole}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${getModuleColor(log.module)}`}>
                      {log.module}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <i className={`${getActionIcon(log.action)} w-4 h-4 flex items-center justify-center mr-2`}></i>
                      <span className="font-medium text-gray-900">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">
                    <span title={log.details}>{log.details}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ipAddress || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <i className="ri-file-search-line w-12 h-12 flex items-center justify-center text-gray-400 mx-auto mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-700">
            <i className="ri-information-line w-5 h-5 flex items-center justify-center"></i>
            <div>
              <p className="text-sm font-medium">Log Retention Policy</p>
              <p className="text-sm">System logs are retained for 90 days for security and compliance purposes. Critical actions are permanently logged.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
