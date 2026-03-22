
'use client';

import { useState } from 'react';
import FilterBar from './FilterBar';

interface Entry {
  id: string;
  date: string;
  profit: number;
  cash: number;
  bank: number;
  sales: number;
  expenses: number;
  mutton: number;
  chicken: number;
  grocery: number;
  flower: number;
  leaf: number;
  gas: number;
  misc: number;
  pigmyS: number;
  salary: number;
  createdBy: string;
}

interface EditModalProps {
  entry: Entry;
  onSave: (entry: Entry) => void;
  onClose: () => void;
  userRole: string;
}

function EditModal({ entry, onSave, onClose, userRole }: EditModalProps) {
  const [formData, setFormData] = useState(entry);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expenses = formData.mutton + formData.chicken + formData.grocery + formData.flower + 
                   formData.leaf + formData.gas + formData.misc + formData.pigmyS + formData.salary;
    const profit = formData.sales - expenses;
    
    onSave({
      ...formData,
      expenses,
      profit
    });
    onClose();
  };

  const isReadOnly = userRole === 'User';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {isReadOnly ? 'View Entry' : 'Edit Entry'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cash</label>
              <input
                type="number"
                value={formData.cash}
                onChange={(e) => setFormData({...formData, cash: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
              <input
                type="number"
                value={formData.bank}
                onChange={(e) => setFormData({...formData, bank: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sales</label>
              <input
                type="number"
                value={formData.sales}
                onChange={(e) => setFormData({...formData, sales: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mutton</label>
              <input
                type="number"
                value={formData.mutton}
                onChange={(e) => setFormData({...formData, mutton: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chicken</label>
              <input
                type="number"
                value={formData.chicken}
                onChange={(e) => setFormData({...formData, chicken: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grocery</label>
              <input
                type="number"
                value={formData.grocery}
                onChange={(e) => setFormData({...formData, grocery: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Flower</label>
              <input
                type="number"
                value={formData.flower}
                onChange={(e) => setFormData({...formData, flower: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leaf</label>
              <input
                type="number"
                value={formData.leaf}
                onChange={(e) => setFormData({...formData, leaf: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gas</label>
              <input
                type="number"
                value={formData.gas}
                onChange={(e) => setFormData({...formData, gas: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Misc</label>
              <input
                type="number"
                value={formData.misc}
                onChange={(e) => setFormData({...formData, misc: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pigmy S</label>
              <input
                type="number"
                value={formData.pigmyS}
                onChange={(e) => setFormData({...formData, pigmyS: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isReadOnly}
              />
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Calculated Expenses: </span>
                ₹{(formData.mutton + formData.chicken + formData.grocery + formData.flower + 
                    formData.leaf + formData.gas + formData.misc + formData.pigmyS + formData.salary).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Calculated Profit: </span>
                ₹{(formData.sales - (formData.mutton + formData.chicken + formData.grocery + formData.flower + 
                    formData.leaf + formData.gas + formData.misc + formData.pigmyS + formData.salary)).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            {!isReadOnly && (
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap"
              >
                Save Changes
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition duration-200 cursor-pointer whitespace-nowrap"
            >
              {isReadOnly ? 'Close' : 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ViewEntriesProps {
  userRole: string;
  currentUser: string;
  onLogAction: (action: string, details: string) => void;
}

export default function ViewEntries({ userRole, currentUser, onLogAction }: ViewEntriesProps) {
  const [filter, setFilter] = useState('current-month');
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  
  // Mock data - replace with actual data from your storage
  const [entries, setEntries] = useState<Entry[]>([
    {
      id: '1',
      date: '2024-01-15',
      profit: 5000,
      cash: 3000,
      bank: 2000,
      sales: 15000,
      expenses: 10000,
      mutton: 2000,
      chicken: 1500,
      grocery: 1000,
      flower: 500,
      leaf: 300,
      gas: 800,
      misc: 400,
      pigmyS: 1500,
      salary: 2000,
      createdBy: 'admin'
    },
    {
      id: '2',
      date: '2024-01-16',
      profit: 4500,
      cash: 2500,
      bank: 2000,
      sales: 13500,
      expenses: 9000,
      mutton: 1800,
      chicken: 1200,
      grocery: 900,
      flower: 400,
      leaf: 250,
      gas: 750,
      misc: 300,
      pigmyS: 1400,
      salary: 2000,
      createdBy: 'manager'
    }
  ]);

  const exportToExcel = () => {
    onLogAction('Export Data', 'Exported entries to Excel');
    
    // Create CSV content
    const headers = ['Date', 'Profit', 'Cash', 'Bank', 'Sales', 'Expenses', 'Mutton', 'Chicken', 'Grocery', 'Flower', 'Leaf', 'Gas', 'Misc', 'Pigmy S', 'Salary', 'Created By'];
    const csvContent = [
      headers.join(','),
      ...entries.map(entry => [
        entry.date,
        entry.profit,
        entry.cash,
        entry.bank,
        entry.sales,
        entry.expenses,
        entry.mutton,
        entry.chicken,
        entry.grocery,
        entry.flower,
        entry.leaf,
        entry.gas,
        entry.misc,
        entry.pigmyS,
        entry.salary,
        entry.createdBy
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'entries.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
    onLogAction('View Entry', `Accessed entry from ${entry.date}`);
  };

  const handleSave = (updatedEntry: Entry) => {
    setEntries(entries.map(e => e.id === updatedEntry.id ? updatedEntry : e));
    onLogAction('Edit Entry', `Modified entry from ${updatedEntry.date}`);
  };

  const handleDelete = (id: string) => {
    if (userRole === 'Manager') {
      alert('Managers cannot delete data');
      return;
    }
    
    if (confirm('Are you sure you want to delete this entry?')) {
      const entry = entries.find(e => e.id === id);
      setEntries(entries.filter(e => e.id !== id));
      onLogAction('Delete Entry', `Deleted entry from ${entry?.date}`);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">View Entries</h1>
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            <i className="ri-download-line w-4 h-4 flex items-center justify-center"></i>
            Download Excel
          </button>
        </div>

        <FilterBar filter={filter} setFilter={setFilter} />

        <div className="overflow-x-auto mt-6">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Profit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Cash</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Bank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sales</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Expenses</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created By</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{entry.date}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">₹{entry.profit.toLocaleString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">₹{entry.cash.toLocaleString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">₹{entry.bank.toLocaleString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">₹{entry.sales.toLocaleString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600 font-medium">₹{entry.expenses.toLocaleString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{entry.createdBy}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer whitespace-nowrap flex items-center gap-1"
                      >
                        <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                        {userRole === 'User' ? 'View' : 'Edit'}
                      </button>
                      {userRole !== 'Manager' && userRole !== 'User' && (
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer whitespace-nowrap flex items-center gap-1"
                        >
                          <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
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

      {editingEntry && (
        <EditModal
          entry={editingEntry}
          onSave={handleSave}
          onClose={() => setEditingEntry(null)}
          userRole={userRole}
        />
      )}
    </div>
  );
}
