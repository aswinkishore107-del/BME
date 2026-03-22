
'use client';

import { useState } from 'react';

interface User {
  id: string;
  username: string;
  password: string;
  role: 'Admin' | 'Owner' | 'Manager' | 'Cashier' | 'User-Admin' | 'User';
  createdDate: string;
  lastLogin?: string;
  status: 'Active' | 'Inactive';
  permissions: {
    dashboard: boolean;
    analytics: boolean;
    newEntry: boolean;
    viewEntries: boolean;
    inventory: boolean;
    indent: boolean;
    savings: boolean;
    pigmyS: boolean;
    pigmyR: boolean;
    creditors: boolean;
    staff: boolean;
    attendance: boolean;
    salary: boolean;
    maintenance: boolean;
    raiseTicket: boolean;
    logs: boolean;
    backupRestore: boolean;
    deleteData: boolean;
    manageUsers: boolean;
  };
  editAccess: {
    dashboard: boolean;
    analytics: boolean;
    newEntry: boolean;
    viewEntries: boolean;
    inventory: boolean;
    indent: boolean;
    savings: boolean;
    pigmyS: boolean;
    pigmyR: boolean;
    creditors: boolean;
    staff: boolean;
    attendance: boolean;
    salary: boolean;
    maintenance: boolean;
    raiseTicket: boolean;
    logs: boolean;
    backupRestore: boolean;
    deleteData: boolean;
    manageUsers: boolean;
  };
  deleteAccess: {
    dashboard: boolean;
    analytics: boolean;
    newEntry: boolean;
    viewEntries: boolean;
    inventory: boolean;
    indent: boolean;
    savings: boolean;
    pigmyS: boolean;
    pigmyR: boolean;
    creditors: boolean;
    staff: boolean;
    attendance: boolean;
    salary: boolean;
    maintenance: boolean;
    raiseTicket: boolean;
    logs: boolean;
    backupRestore: boolean;
    deleteData: boolean;
    manageUsers: boolean;
  };
}

interface AddModalProps {
  onSave: (user: Omit<User, 'id' | 'createdDate' | 'lastLogin'>) => void;
  onClose: () => void;
}

interface EditModalProps {
  user: User;
  onSave: (user: User) => void;
  onClose: () => void;
}

function AddModal({ onSave, onClose }: AddModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'User' as const,
    status: 'Active' as const,
    permissions: {
      dashboard: true,
      analytics: false,
      newEntry: false,
      viewEntries: true,
      inventory: false,
      indent: false,
      savings: false,
      pigmyS: false,
      pigmyR: false,
      creditors: false,
      staff: false,
      attendance: false,
      salary: false,
      maintenance: false,
      raiseTicket: true,
      logs: false,
      backupRestore: false,
      deleteData: false,
      manageUsers: false
    },
    editAccess: {
      dashboard: false,
      analytics: false,
      newEntry: false,
      viewEntries: false,
      inventory: false,
      indent: false,
      savings: false,
      pigmyS: false,
      pigmyR: false,
      creditors: false,
      staff: false,
      attendance: false,
      salary: false,
      maintenance: false,
      raiseTicket: false,
      logs: false,
      backupRestore: false,
      deleteData: false,
      manageUsers: false
    },
    deleteAccess: {
      dashboard: false,
      analytics: false,
      newEntry: false,
      viewEntries: false,
      inventory: false,
      indent: false,
      savings: false,
      pigmyS: false,
      pigmyR: false,
      creditors: false,
      staff: false,
      attendance: false,
      salary: false,
      maintenance: false,
      raiseTicket: false,
      logs: false,
      backupRestore: false,
      deleteData: false,
      manageUsers: false
    }
  });

  const roles = ['Admin', 'Owner', 'Manager', 'Cashier', 'User-Admin', 'User'] as const;
  const statuses = ['Active', 'Inactive'] as const;

  const handleRoleChange = (role: User['role']) => {
    let permissions = { ...formData.permissions };
    let editAccess = { ...formData.editAccess };
    let deleteAccess = { ...formData.deleteAccess };

    switch (role) {
      case 'Admin':
      case 'Owner':
        permissions = Object.keys(permissions).reduce((acc, key) => ({ ...acc, [key]: true }), {} as User['permissions']);
        editAccess = Object.keys(editAccess).reduce((acc, key) => ({ ...acc, [key]: true }), {} as User['editAccess']);
        deleteAccess = Object.keys(deleteAccess).reduce((acc, key) => ({ ...acc, [key]: true }), {} as User['deleteAccess']);
        break;
      case 'Manager':
        permissions = {
          dashboard: true,
          analytics: true,
          newEntry: true,
          viewEntries: true,
          inventory: true,
          indent: true,
          savings: true,
          pigmyS: true,
          pigmyR: true,
          creditors: true,
          staff: true,
          attendance: true,
          salary: true,
          maintenance: true,
          raiseTicket: true,
          logs: true,
          backupRestore: false,
          deleteData: false,
          manageUsers: false
        };
        editAccess = {
          dashboard: false,
          analytics: true,
          newEntry: true,
          viewEntries: true,
          inventory: true,
          indent: true,
          savings: true,
          pigmyS: true,
          pigmyR: true,
          creditors: true,
          staff: true,
          attendance: true,
          salary: true,
          maintenance: true,
          raiseTicket: true,
          logs: false,
          backupRestore: false,
          deleteData: false,
          manageUsers: false
        };
        deleteAccess = {
          dashboard: false,
          analytics: false,
          newEntry: true,
          viewEntries: false,
          inventory: true,
          indent: true,
          savings: true,
          pigmyS: true,
          pigmyR: true,
          creditors: true,
          staff: false,
          attendance: false,
          salary: false,
          maintenance: false,
          raiseTicket: false,
          logs: false,
          backupRestore: false,
          deleteData: false,
          manageUsers: false
        };
        break;
      case 'Cashier':
        permissions = {
          dashboard: true,
          analytics: false,
          newEntry: true,
          viewEntries: true,
          inventory: false,
          indent: true,
          savings: true,
          pigmyS: true,
          pigmyR: true,
          creditors: false,
          staff: false,
          attendance: false,
          salary: false,
          maintenance: false,
          raiseTicket: true,
          logs: false,
          backupRestore: false,
          deleteData: false,
          manageUsers: false
        };
        editAccess = {
          dashboard: false,
          analytics: false,
          newEntry: true,
          viewEntries: false,
          inventory: false,
          indent: true,
          savings: true,
          pigmyS: true,
          pigmyR: true,
          creditors: false,
          staff: false,
          attendance: false,
          salary: false,
          maintenance: false,
          raiseTicket: true,
          logs: false,
          backupRestore: false,
          deleteData: false,
          manageUsers: false
        };
        deleteAccess = {
          dashboard: false,
          analytics: false,
          newEntry: false,
          viewEntries: false,
          inventory: false,
          indent: false,
          savings: false,
          pigmyS: false,
          pigmyR: false,
          creditors: false,
          staff: false,
          attendance: false,
          salary: false,
          maintenance: false,
          raiseTicket: false,
          logs: false,
          backupRestore: false,
          deleteData: false,
          manageUsers: false
        };
        break;
      case 'User-Admin':
        permissions = {
          dashboard: true,
          analytics: true,
          newEntry: false,
          viewEntries: true,
          inventory: true,
          indent: true,
          savings: true,
          pigmyS: true,
          pigmyR: true,
          creditors: true,
          staff: true,
          attendance: true,
          salary: true,
          maintenance: true,
          raiseTicket: true,
          logs: true,
          backupRestore: false,
          deleteData: false,
          manageUsers: true
        };
        editAccess = {
          dashboard: false,
          analytics: true,
          newEntry: false,
          viewEntries: false,
          inventory: true,
          indent: true,
          savings: true,
          pigmyS: true,
          pigmyR: true,
          creditors: true,
          staff: true,
          attendance: true,
          salary: true,
          maintenance: true,
          raiseTicket: true,
          logs: false,
          backupRestore: false,
          deleteData: false,
          manageUsers: true
        };
        deleteAccess = {
          dashboard: false,
          analytics: false,
          newEntry: false,
          viewEntries: false,
          inventory: false,
          indent: false,
          savings: false,
          pigmyS: false,
          pigmyR: false,
          creditors: false,
          staff: false,
          attendance: false,
          salary: false,
          maintenance: false,
          raiseTicket: false,
          logs: false,
          backupRestore: false,
          deleteData: false,
          manageUsers: false
        };
        break;
      default:
        permissions = {
          dashboard: true,
          analytics: false,
          newEntry: false,
          viewEntries: true,
          inventory: false,
          indent: false,
          savings: false,
          pigmyS: false,
          pigmyR: false,
          creditors: false,
          staff: false,
          attendance: false,
          salary: false,
          maintenance: false,
          raiseTicket: true,
          logs: false,
          backupRestore: false,
          deleteData: false,
          manageUsers: false
        };
        editAccess = Object.keys(editAccess).reduce((acc, key) => ({ ...acc, [key]: false }), {} as User['editAccess']);
        deleteAccess = Object.keys(deleteAccess).reduce((acc, key) => ({ ...acc, [key]: false }), {} as User['deleteAccess']);
    }

    setFormData({ ...formData, role, permissions, editAccess, deleteAccess });
  };

  const handlePermissionChange = (permission: keyof User['permissions'], value: boolean) => {
    setFormData({
      ...formData,
      permissions: { ...formData.permissions, [permission]: value }
    });
  };

  const handleEditAccessChange = (permission: keyof User['editAccess'], value: boolean) => {
    setFormData({
      ...formData,
      editAccess: { ...formData.editAccess, [permission]: value }
    });
  };

  const handleDeleteAccessChange = (permission: keyof User['deleteAccess'], value: boolean) => {
    setFormData({
      ...formData,
      deleteAccess: { ...formData.deleteAccess, [permission]: value }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username.trim() && formData.password.trim()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value as User['role'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as User['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">View Access</label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(formData.permissions).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`view-${key}`}
                      checked={value}
                      onChange={(e) => handlePermissionChange(key as keyof User['permissions'], e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`view-${key}`} className="text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Edit Access</label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(formData.editAccess).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`edit-${key}`}
                      checked={value}
                      onChange={(e) => handleEditAccessChange(key as keyof User['editAccess'], e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`edit-${key}`} className="text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Delete Access</label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(formData.deleteAccess).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`delete-${key}`}
                      checked={value}
                      onChange={(e) => handleDeleteAccessChange(key as keyof User['deleteAccess'], e.target.checked)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`delete-${key}`} className="text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap"
            >
              Add User
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition duration-200 cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditModal({ user, onSave, onClose }: EditModalProps) {
  const [formData, setFormData] = useState(user);

  const roles = ['Admin', 'Owner', 'Manager', 'Cashier', 'User-Admin', 'User'] as const;
  const statuses = ['Active', 'Inactive'] as const;

  const handleRoleChange = (role: User['role']) => {
    let permissions = { ...formData.permissions };
    let editAccess = { ...formData.editAccess };
    let deleteAccess = { ...formData.deleteAccess };

    switch (role) {
      case 'Admin':
      case 'Owner':
        permissions = Object.keys(permissions).reduce((acc, key) => ({ ...acc, [key]: true }), {} as User['permissions']);
        editAccess = Object.keys(editAccess).reduce((acc, key) => ({ ...acc, [key]: true }), {} as User['editAccess']);
        deleteAccess = Object.keys(deleteAccess).reduce((acc, key) => ({ ...acc, [key]: true }), {} as User['deleteAccess']);
        break;
      case 'Manager':
        permissions = {
          dashboard: true,
          analytics: true,
          newEntry: true,
          viewEntries: true,
          inventory: true,
          indent: true,
          savings: true,
          pigmyS: true,
          pigmyR: true,
          creditors: true,
          staff: true,
          attendance: true,
          salary: true,
          maintenance: true,
          raiseTicket: true,
          logs: true,
          backupRestore: false,
          deleteData: false,
          manageUsers: false
        };
        editAccess = {
          dashboard: false,
          analytics: true,
          newEntry: true,
          viewEntries: true,
          inventory: true,
          indent: true,
          savings: true,
          pigmyS: true,
          pigmyR: true,
          creditors: true,
          staff: true,
          attendance: true,
          salary: true,
          maintenance: true,
          raiseTicket: true,
          logs: false,
          backupRestore: false,
          deleteData: false,
          manageUsers: false
        };
        deleteAccess = {
          dashboard: false,
          analytics: false,
          newEntry: true,
          viewEntries: false,
          inventory: true,
          indent: true,
          savings: true,
          pigmyS: true,
          pigmyR: true,
          creditors: true,
          staff: false,
          attendance: false,
          salary: false,
          maintenance: false,
          raiseTicket: false,
          logs: false,
          backupRestore: false,
          deleteData: false,
          manageUsers: false
        };
        break;
      case 'Cashier':
        permissions = {
          dashboard: true,
          analytics: false,
          newEntry: true,
          viewEntries: true,
          inventory: false,
          indent: true,
          savings: true,
          pigmyS: true,
          pigmyR: true,
          creditors: false,
          staff: false,
          attendance: false,
          salary: false,
          maintenance: false,
          raiseTicket: true,
          logs: false,
          backupRestore: false,
          deleteData: false,
          manageUsers: false
        };
        editAccess = {
          dashboard: false,
          analytics: false,
          newEntry: true,
          viewEntries: false,
          inventory: false,
          indent: true,
          savings: true,
          pigmyS: true,
          pigmyR: true,
          creditors: false,
          staff: false,
          attendance: false,
          salary: false,
          maintenance: false,
          raiseTicket: true,
          logs: false,
          backupRestore: false,
          deleteData: false,
          manageUsers: false
        };
        deleteAccess = {
          dashboard: false,
          analytics: false,
          newEntry: false,
          viewEntries: false,
          inventory: false,
          indent: false,
          savings: false,
          pigmyS: false,
          pigmyR: false,
          creditors: false,
          staff: false,
          attendance: false,
          salary: false,
          maintenance: false,
          raiseTicket: false,
          logs: false,
          backupRestore: false,
          deleteData: false,
          manageUsers: false
        };
        break;
      case 'User-Admin':
        permissions = {
          dashboard: true,
          analytics: true,
          newEntry: false,
          viewEntries: true,
          inventory: true,
          indent: true,
          savings: true,
          pigmyS: true,
          pigmyR: true,
          creditors: true,
          staff: true,
          attendance: true,
          salary: true,
          maintenance: true,
          raiseTicket: true,
          logs: true,
          backupRestore: false,
          deleteData: false,
          manageUsers: true
        };
        editAccess = {
          dashboard: false,
          analytics: true,
          newEntry: false,
          viewEntries: false,
          inventory: true,
          indent: true,
          savings: true,
          pigmyS: true,
          pigmyR: true,
          creditors: true,
          staff: true,
          attendance: true,
          salary: true,
          maintenance: true,
          raiseTicket: true,
          logs: false,
          backupRestore: false,
          deleteData: false,
          manageUsers: true
        };
        deleteAccess = {
          dashboard: false,
          analytics: false,
          newEntry: false,
          viewEntries: false,
          inventory: false,
          indent: false,
          savings: false,
          pigmyS: false,
          pigmyR: false,
          creditors: false,
          staff: false,
          attendance: false,
          salary: false,
          maintenance: false,
          raiseTicket: false,
          logs: false,
          backupRestore: false,
          deleteData: false,
          manageUsers: false
        };
        break;
      default:
        permissions = {
          dashboard: true,
          analytics: false,
          newEntry: false,
          viewEntries: true,
          inventory: false,
          indent: false,
          savings: false,
          pigmyS: false,
          pigmyR: false,
          creditors: false,
          staff: false,
          attendance: false,
          salary: false,
          maintenance: false,
          raiseTicket: true,
          logs: false,
          backupRestore: false,
          deleteData: false,
          manageUsers: false
        };
        editAccess = Object.keys(editAccess).reduce((acc, key) => ({ ...acc, [key]: false }), {} as User['editAccess']);
        deleteAccess = Object.keys(deleteAccess).reduce((acc, key) => ({ ...acc, [key]: false }), {} as User['deleteAccess']);
    }

    setFormData({ ...formData, role, permissions, editAccess, deleteAccess });
  };

  const handlePermissionChange = (permission: keyof User['permissions'], value: boolean) => {
    setFormData({
      ...formData,
      permissions: { ...formData.permissions, [permission]: value }
    });
  };

  const handleEditAccessChange = (permission: keyof User['editAccess'], value: boolean) => {
    setFormData({
      ...formData,
      editAccess: { ...formData.editAccess, [permission]: value }
    });
  };

  const handleDeleteAccessChange = (permission: keyof User['deleteAccess'], value: boolean) => {
    setFormData({
      ...formData,
      deleteAccess: { ...formData.deleteAccess, [permission]: value }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username.trim() && formData.password.trim()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value as User['role'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as User['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">View Access</label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(formData.permissions).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`edit-view-${key}`}
                      checked={value}
                      onChange={(e) => handlePermissionChange(key as keyof User['permissions'], e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`edit-view-${key}`} className="text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Edit Access</label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(formData.editAccess).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`edit-edit-${key}`}
                      checked={value}
                      onChange={(e) => handleEditAccessChange(key as keyof User['editAccess'], e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`edit-edit-${key}`} className="text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Delete Access</label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(formData.deleteAccess).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`edit-delete-${key}`}
                      checked={value}
                      onChange={(e) => handleDeleteAccessChange(key as keyof User['deleteAccess'], e.target.checked)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`edit-delete-${key}`} className="text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap"
            >
              Update User
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition duration-200 cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ManageUsers({ currentUser = 'admin' }: { currentUser?: string }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);

  const fetchPendingUsers = async () => {
    setLoadingPending(true);
    try {
      const res = await fetch('/api/users/pending', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      const data = await res.json();
      if (data.success) setPendingUsers(data.data);
      else console.error('Failed to load pending users:', data.message);
    } catch (err) {
      console.error('Failed to load pending users', err);
    } finally {
      setLoadingPending(false);
    }
  };

  const approvePending = async (id: number) => {
    try {
      const res = await fetch(`/api/users/${id}/approve`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` } });
      const data = await res.json();
      if (data.success) fetchPendingUsers();
    } catch (err) {
      console.error('Approve failed', err);
    }
  };

  const rejectPending = async (id: number) => {
    try {
      const res = await fetch(`/api/users/${id}/reject`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` } });
      const data = await res.json();
      if (data.success) fetchPendingUsers();
    } catch (err) {
      console.error('Reject failed', err);
    }
  };

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      password: 'cse2025',
      role: 'Admin',
      createdDate: '2023-01-01',
      lastLogin: '2024-01-24',
      status: 'Active',
      email: 'admin@example.com',
      permissions: {
        dashboard: true,
        analytics: true,
        newEntry: true,
        viewEntries: true,
        inventory: true,
        indent: true,
        savings: true,
        pigmyS: true,
        pigmyR: true,
        creditors: true,
        staff: true,
        attendance: true,
        salary: true,
        maintenance: true,
        raiseTicket: true,
        logs: true,
        backupRestore: true,
        deleteData: true,
        manageUsers: true
      },
      editAccess: {
        dashboard: true,
        analytics: true,
        newEntry: true,
        viewEntries: true,
        inventory: true,
        indent: true,
        savings: true,
        pigmyS: true,
        pigmyR: true,
        creditors: true,
        staff: true,
        attendance: true,
        salary: true,
        maintenance: true,
        raiseTicket: true,
        logs: true,
        backupRestore: true,
        deleteData: true,
        manageUsers: true
      },
      deleteAccess: {
        dashboard: true,
        analytics: true,
        newEntry: true,
        viewEntries: true,
        inventory: true,
        indent: true,
        savings: true,
        pigmyS: true,
        pigmyR: true,
        creditors: true,
        staff: true,
        attendance: true,
        salary: true,
        maintenance: true,
        raiseTicket: true,
        logs: true,
        backupRestore: true,
        deleteData: true,
        manageUsers: true
      }
    },
    {
      id: '2',
      username: 'user',
      password: 'user123',
      role: 'User',
      createdDate: '2023-02-15',
      lastLogin: '2024-01-23',
      status: 'Active',
      permissions: {
        dashboard: true,
        analytics: false,
        newEntry: false,
        viewEntries: true,
        inventory: false,
        indent: false,
        savings: false,
        pigmyS: false,
        pigmyR: false,
        creditors: false,
        staff: false,
        attendance: false,
        salary: false,
        maintenance: false,
        raiseTicket: true,
        logs: false,
        backupRestore: false,
        deleteData: false,
        manageUsers: false
      },
      editAccess: {
        dashboard: false,
        analytics: false,
        newEntry: false,
        viewEntries: false,
        inventory: false,
        indent: false,
        savings: false,
        pigmyS: false,
        pigmyR: false,
        creditors: false,
        staff: false,
        attendance: false,
        salary: false,
        maintenance: false,
        raiseTicket: false,
        logs: false,
        backupRestore: false,
        deleteData: false,
        manageUsers: false
      },
      deleteAccess: {
        dashboard: false,
        analytics: false,
        newEntry: false,
        viewEntries: false,
        inventory: false,
        indent: false,
        savings: false,
        pigmyS: false,
        pigmyR: false,
        creditors: false,
        staff: false,
        attendance: false,
        salary: false,
        maintenance: false,
        raiseTicket: false,
        logs: false,
        backupRestore: false,
        deleteData: false,
        manageUsers: false
      }
    },
    {
      id: '3',
      username: 'manager',
      password: 'manager123',
      role: 'Manager',
      createdDate: '2023-03-10',
      lastLogin: '2024-01-24',
      status: 'Active',
      permissions: {
        dashboard: true,
        analytics: true,
        newEntry: true,
        viewEntries: true,
        inventory: true,
        indent: true,
        savings: true,
        pigmyS: true,
        pigmyR: true,
        creditors: true,
        staff: true,
        attendance: true,
        salary: true,
        maintenance: true,
        raiseTicket: true,
        logs: true,
        backupRestore: false,
        deleteData: false,
        manageUsers: false
      },
      editAccess: {
        dashboard: false,
        analytics: true,
        newEntry: true,
        viewEntries: true,
        inventory: true,
        indent: true,
        savings: true,
        pigmyS: true,
        pigmyR: true,
        creditors: true,
        staff: true,
        attendance: true,
        salary: true,
        maintenance: true,
        raiseTicket: true,
        logs: false,
        backupRestore: false,
        deleteData: false,
        manageUsers: false
      },
      deleteAccess: {
        dashboard: false,
        analytics: false,
        newEntry: true,
        viewEntries: false,
        inventory: true,
        indent: true,
        savings: true,
        pigmyS: true,
        pigmyR: true,
        creditors: true,
        staff: false,
        attendance: false,
        salary: false,
        maintenance: false,
        raiseTicket: false,
        logs: false,
        backupRestore: false,
        deleteData: false,
        manageUsers: false
      }
    }
  ]);

  const activeUsers = users.filter((u) => u.status === 'Active');
  const inactiveUsers = users.filter((u) => u.status === 'Inactive');

  const handleAddUser = (newUser: Omit<User, 'id' | 'createdDate' | 'lastLogin'>) => {
    const user: User = {
      ...newUser,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, user]);
  };

  const handleEditUser = (updatedUser: User) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
    setEditingUser(null);
  };

  const handleStatusToggle = (id: string) => {
    const userToToggle = users.find((u) => u.id === id);

    // Prevent admin from deactivating their own account
    if (userToToggle?.username === currentUser && userToToggle.status === 'Active') {
      alert('You cannot deactivate your own account!');
      return;
    }

    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user
      )
    );
  };

  const handleDelete = (id: string) => {
    const userToDelete = users.find((u) => u.id === id);

    // Prevent admin from deleting their own account
    if (userToDelete?.username === currentUser) {
      alert('You cannot delete your own account!');
      return;
    }

    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Owner':
        return 'bg-red-100 text-red-800';
      case 'Manager':
        return 'bg-blue-100 text-blue-800';
      case 'Cashier':
        return 'bg-green-100 text-green-800';
      case 'User-Admin':
        return 'bg-yellow-100 text-yellow-800';
      case 'User':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            <i className="ri-add-line w-4 h-4 flex items-center justify-center"></i>
            Add User
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800 mb-1">Active Users</h3>
            <p className="text-2xl font-bold text-green-900">{activeUsers.length}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-800 mb-1">Inactive Users</h3>
            <p className="text-2xl font-bold text-red-900">{inactiveUsers.length}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">User Roles & Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-800 mb-2">Admin/Owner</h4>
              <p className="text-sm text-purple-700">Full system access including user management and data deletion.</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Manager</h4>
              <p className="text-sm text-blue-700">Access to operations, reports, and staff management. No admin functions.</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Cashier</h4>
              <p className="text-sm text-green-700">Entry creation, savings, and payment processing access.</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Pending Account Approvals</h3>
            <div className="flex gap-2">
              <button onClick={fetchPendingUsers} className="bg-yellow-500 text-white px-3 py-1 rounded">{loadingPending ? 'Loading...' : 'Refresh Pending'}</button>
            </div>
          </div>

          {pendingUsers.length === 0 ? (
            <p className="text-sm text-gray-500">No pending accounts. Click "Refresh Pending" to check for new requests.</p>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{p.username} {p.email ? <span className="text-sm text-gray-500">({p.email})</span> : null}</div>
                    <div className="text-xs text-gray-500">Created: {p.created_date}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approvePending(p.id)} className="bg-green-600 text-white px-3 py-1 rounded">Approve</button>
                    <button onClick={() => rejectPending(p.id)} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">S.No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Username</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Last Login</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{user.username}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.createdDate}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{user.lastLogin || 'Never'}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer whitespace-nowrap hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleStatusToggle(user.id)}
                        className={`px-3 py-1 rounded cursor-pointer whitespace-nowrap text-white ${
                          user.status === 'Active'
                            ? 'bg-yellow-600 hover:bg-yellow-700'
                            : 'bg-green-600 hover:bg-green-700'
                        } ${user.username === currentUser && user.status === 'Active' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={user.username === currentUser && user.status === 'Active'}
                      >
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      {user.username !== currentUser && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer whitespace-nowrap hover:bg-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddModal
          onSave={handleAddUser}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {editingUser && (
        <EditModal
          user={editingUser}
          onSave={handleEditUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}
