
'use client';

import { useState } from 'react';

interface PigmySEntry {
  id: string;
  date: string;
  amount: number;
}

export default function PigmyS() {
  const [dateFilter, setDateFilter] = useState('current-month');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Mock data from expenses entries - in real app, this would be fetched from the New Entry data
  const [pigmySEntries] = useState<PigmySEntry[]>([
    { id: '1', date: '2024-01-15', amount: 1500 },
    { id: '2', date: '2024-01-16', amount: 1400 },
    { id: '3', date: '2024-01-17', amount: 1600 },
    { id: '4', date: '2024-01-18', amount: 1500 },
    { id: '5', date: '2024-01-19', amount: 1550 },
    { id: '6', date: '2024-01-20', amount: 1450 },
    { id: '7', date: '2024-01-21', amount: 1500 },
    { id: '8', date: '2024-01-22', amount: 1700 },
    { id: '9', date: '2024-01-23', amount: 1400 },
    { id: '10', date: '2024-01-24', amount: 1600 },
    { id: '11', date: '2023-12-15', amount: 1300 },
    { id: '12', date: '2023-12-16', amount: 1450 },
    { id: '13', date: '2023-04-10', amount: 1200 },
    { id: '14', date: '2023-04-11', amount: 1350 },
    { id: '15', date: '2023-11-20', amount: 1400 }
  ]);

  const getDateRange = () => {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    
    // Previous financial year (April to March)
    const currentYear = now.getFullYear();
    const previousFinancialYearStart = new Date(currentYear - 1, 3, 1); // April 1st
    const previousFinancialYearEnd = new Date(currentYear, 2, 31); // March 31st

    switch (dateFilter) {
      case 'current-month':
        return {
          start: currentMonth.toISOString().split('T')[0],
          end: currentMonthEnd.toISOString().split('T')[0]
        };
      case 'previous-month':
        return {
          start: previousMonth.toISOString().split('T')[0],
          end: previousMonthEnd.toISOString().split('T')[0]
        };
      case 'previous-financial-year':
        return {
          start: previousFinancialYearStart.toISOString().split('T')[0],
          end: previousFinancialYearEnd.toISOString().split('T')[0]
        };
      case 'custom':
        return {
          start: customDateRange.startDate,
          end: customDateRange.endDate
        };
      default:
        return {
          start: currentMonth.toISOString().split('T')[0],
          end: currentMonthEnd.toISOString().split('T')[0]
        };
    }
  };

  const getFilteredEntries = () => {
    const { start, end } = getDateRange();
    return pigmySEntries.filter(entry => 
      entry.date >= start && entry.date <= end
    );
  };

  const filteredEntries = getFilteredEntries();
  const totalAmount = filteredEntries.reduce((sum, entry) => sum + entry.amount, 0);

  const exportToExcel = () => {
    const headers = ['S.No', 'Date', 'Amount', 'Running Total'];
    
    const csvContent = [
      headers.join(','),
      ...filteredEntries.map((entry, index) => {
        const runningTotal = filteredEntries
          .slice(0, index + 1)
          .reduce((sum, e) => sum + e.amount, 0);
        
        return [
          index + 1,
          entry.date,
          entry.amount,
          runningTotal
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pigmy_s_${dateFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pigmy S Records</h1>
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            <i className="ri-file-excel-2-line w-4 h-4 flex items-center justify-center"></i>
            Export
          </button>
        </div>

        {/* Date Filter Controls */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setDateFilter('current-month')}
              className={`px-4 py-2 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap ${
                dateFilter === 'current-month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Current Month
            </button>
            <button
              onClick={() => setDateFilter('previous-month')}
              className={`px-4 py-2 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap ${
                dateFilter === 'previous-month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous Month
            </button>
            <button
              onClick={() => setDateFilter('previous-financial-year')}
              className={`px-4 py-2 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap ${
                dateFilter === 'previous-financial-year'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous Financial Year
            </button>
            <button
              onClick={() => setDateFilter('custom')}
              className={`px-4 py-2 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap ${
                dateFilter === 'custom'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Custom Range
            </button>
          </div>

          {dateFilter === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-800">Total Amount: ₹{totalAmount.toLocaleString()}</h3>
          <p className="text-sm text-blue-600 mt-1">
            {filteredEntries.length} entries for selected period | Data fetched from New Entry expenses
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">S.No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Running Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.map((entry, index) => {
                const runningTotal = filteredEntries
                  .slice(0, index + 1)
                  .reduce((sum, e) => sum + e.amount, 0);
                
                return (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{entry.date}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">₹{entry.amount.toLocaleString()}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">₹{runningTotal.toLocaleString()}</td>
                  </tr>
                );
              })}
              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
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
              This data is automatically populated from the Pigmy S entries in the New Entry form. 
              To add new records, use the New Entry section. Use date filters to analyze different periods.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}