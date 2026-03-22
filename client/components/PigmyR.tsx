
'use client';

import { useState } from 'react';

interface PigmyREntry {
  id: string;
  date: string;
  valueDate: string;
  amount: number;
  paymentMode: string;
  paidBy: string;
  createdBy: string;
}

interface AddModalProps {
  onSave: (entry: Omit<PigmyREntry, 'id'>) => void;
  onClose: () => void;
  currentUser: string;
  usernames: string[];
}

function AddModal({ onSave, onClose, currentUser, usernames }: AddModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    valueDate: new Date().toISOString().split('T')[0],
    amount: 0,
    paymentMode: '',
    paidBy: ''
  });

  const paymentModes = ['Cash', 'UPI', 'Card', 'Cheque', 'Bank Transfer'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount > 0 && formData.paymentMode && formData.paidBy.trim()) {
      onSave({
        ...formData,
        createdBy: currentUser
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Pigmy R Entry</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value Date</label>
              <input
                type="date"
                value={formData.valueDate}
                onChange={(e) => setFormData({...formData, valueDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
              <select
                value={formData.paymentMode}
                onChange={(e) => setFormData({...formData, paymentMode: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                required
              >
                <option value="">Select Payment Mode</option>
                {paymentModes.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paid By</label>
              <select
                value={formData.paidBy}
                onChange={(e) => setFormData({...formData, paidBy: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                required
              >
                <option value="">Select User</option>
                {usernames.map(username => (
                  <option key={username} value={username}>{username}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap"
            >
              Add Entry
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

export default function PigmyR({ currentUser = 'admin' }: { currentUser?: string }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [dateFilterType, setDateFilterType] = useState('current-month');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  
  // Mock usernames - in real app, this would come from user management
  const [usernames] = useState(['admin', 'user', 'manager', 'cashier', 'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown']);
  
  const [pigmyREntries, setPigmyREntries] = useState<PigmyREntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      valueDate: '2024-01-16',
      amount: 2500,
      paymentMode: 'Cash',
      paidBy: 'John Doe',
      createdBy: 'admin'
    },
    {
      id: '2',
      date: '2024-01-20',
      valueDate: '2024-01-21',
      amount: 3000,
      paymentMode: 'UPI',
      paidBy: 'Jane Smith',
      createdBy: 'manager'
    },
    {
      id: '3',
      date: '2024-01-25',
      valueDate: '2024-01-26',
      amount: 1800,
      paymentMode: 'Bank Transfer',
      paidBy: 'Mike Johnson',
      createdBy: 'admin'
    },
    {
      id: '4',
      date: '2024-02-05',
      valueDate: '2024-02-06',
      amount: 2200,
      paymentMode: 'Card',
      paidBy: 'Sarah Wilson',
      createdBy: 'cashier'
    },
    {
      id: '5',
      date: '2024-02-12',
      valueDate: '2024-02-13',
      amount: 1500,
      paymentMode: 'UPI',
      paidBy: 'David Brown',
      createdBy: 'admin'
    },
    {
      id: '6',
      date: '2023-12-10',
      valueDate: '2023-12-11',
      amount: 4000,
      paymentMode: 'Cash',
      paidBy: 'John Doe',
      createdBy: 'admin'
    },
    {
      id: '7',
      date: '2023-11-15',
      valueDate: '2023-11-16',
      amount: 2800,
      paymentMode: 'UPI',
      paidBy: 'Jane Smith',
      createdBy: 'manager'
    },
    {
      id: '8',
      date: '2023-04-20',
      valueDate: '2023-04-21',
      amount: 3500,
      paymentMode: 'Bank Transfer',
      paidBy: 'Mike Johnson',
      createdBy: 'admin'
    }
  ]);

  const getDateRangeFromFilter = (filterType: string) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    switch (filterType) {
      case 'current-month': {
        const startDate = new Date(currentYear, currentMonth, 1);
        const endDate = new Date(currentYear, currentMonth + 1, 0);
        return {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        };
      }
      case 'previous-month': {
        const startDate = new Date(currentYear, currentMonth - 1, 1);
        const endDate = new Date(currentYear, currentMonth, 0);
        return {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        };
      }
      case 'last-3-months': {
        const startDate = new Date(currentYear, currentMonth - 2, 1);
        const endDate = new Date(currentYear, currentMonth + 1, 0);
        return {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        };
      }
      case 'current-financial-year': {
        // Financial year starts April 1st
        const fyStartYear = currentMonth >= 3 ? currentYear : currentYear - 1;
        const startDate = new Date(fyStartYear, 3, 1); // April 1st
        const endDate = new Date(fyStartYear + 1, 2, 31); // March 31st
        return {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        };
      }
      case 'previous-financial-year': {
        // Previous financial year
        const fyStartYear = currentMonth >= 3 ? currentYear - 1 : currentYear - 2;
        const startDate = new Date(fyStartYear, 3, 1); // April 1st
        const endDate = new Date(fyStartYear + 1, 2, 31); // March 31st
        return {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        };
      }
      case 'custom':
        return customDateRange;
      default:
        return customDateRange;
    }
  };

  const selectedDateRange = getDateRangeFromFilter(dateFilterType);

  const getFilteredEntries = () => {
    return pigmyREntries.filter(entry => 
      entry.date >= selectedDateRange.startDate && entry.date <= selectedDateRange.endDate
    );
  };

  const filteredEntries = getFilteredEntries();
  const totalAmount = filteredEntries.reduce((sum, entry) => sum + entry.amount, 0);

  const handleAddEntry = (newEntry: Omit<PigmyREntry, 'id'>) => {
    const entry: PigmyREntry = {
      ...newEntry,
      id: Date.now().toString()
    };
    setPigmyREntries([...pigmyREntries, entry]);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setPigmyREntries(pigmyREntries.filter(entry => entry.id !== id));
    }
  };

  const exportToExcel = () => {
    const headers = [
      'S.No',
      'Date',
      'Value Date',
      'Amount',
      'Payment Mode',
      'Paid By',
      'Created By'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredEntries.map((entry, index) => [
        index + 1,
        entry.date,
        entry.valueDate,
        entry.amount,
        entry.paymentMode,
        entry.paidBy,
        entry.createdBy
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pigmy_r_report_${selectedDateRange.startDate}_to_${selectedDateRange.endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFilterDisplayName = (filterType: string) => {
    const filterNames = {
      'current-month': 'Current Month',
      'previous-month': 'Previous Month',
      'last-3-months': 'Last 3 Months',
      'current-financial-year': 'Current Financial Year',
      'previous-financial-year': 'Previous Financial Year',
      'custom': 'Custom Date Range'
    };
    return filterNames[filterType as keyof typeof filterNames] || 'Custom Date Range';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pigmy R Management</h1>
          <div className="flex gap-2">
            <button
              onClick={exportToExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <i className="ri-file-excel-2-line w-4 h-4 flex items-center justify-center"></i>
              Export
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <i className="ri-add-line w-4 h-4 flex items-center justify-center"></i>
              New
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Filter</label>
            <select
              value={dateFilterType}
              onChange={(e) => setDateFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="current-month">Current Month</option>
              <option value="previous-month">Previous Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="current-financial-year">Current Financial Year</option>
              <option value="previous-financial-year">Previous Financial Year</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>
          
          {dateFilterType === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={customDateRange.startDate}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={customDateRange.endDate}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-green-800">
            Total Pigmy R Amount: ₹{totalAmount.toLocaleString()}
          </h3>
          <p className="text-sm text-green-600 mt-1">
            {filteredEntries.length} entries for {getFilterDisplayName(dateFilterType)} ({selectedDateRange.startDate} to {selectedDateRange.endDate})
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">S.No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Value Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment Mode</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Paid By</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created By</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.map((entry, index) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{entry.date}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{entry.valueDate}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">₹{entry.amount.toLocaleString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {entry.paymentMode}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{entry.paidBy}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{entry.createdBy}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer whitespace-nowrap flex items-center gap-1"
                    >
                      <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No entries found for selected period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600">
            <i className="ri-information-line w-5 h-5 flex items-center justify-center"></i>
            <p className="text-sm">
              Pigmy R entries are used in Net Profit calculations. Net Profit = Gross Profit - Creditors - Pigmy R.
              Use the date filter dropdown to quickly view data for specific periods.
            </p>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddModal
          onSave={handleAddEntry}
          onClose={() => setShowAddModal(false)}
          currentUser={currentUser}
          usernames={usernames}
        />
      )}
    </div>
  );
}
