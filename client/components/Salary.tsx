
'use client';

import { useState } from 'react';

interface StaffMember {
  id: string;
  staffId: string;
  name: string;
  designation: string;
  salary: number;
  status: 'Active' | 'Resigned';
  resignedDate?: string;
}

interface SalaryEntry {
  id: string;
  date: string;
  staffId: string;
  staffName: string;
  designation: string;
  salary: number;
  paymentMode: 'Cash' | 'UPI' | 'NEFT' | 'Cheque';
  createdBy: string;
  createdAt: string;
}

interface SalaryProps {
  userRole: string;
  currentUser: string;
  onLogAction: (action: string, details: string) => void;
}

export default function Salary({ userRole, currentUser, onLogAction }: SalaryProps) {
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Monthly view filters
  const [dateRangeFilter, setDateRangeFilter] = useState('current-month');
  const [staffFilter, setStaffFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Mock staff data
  const [allStaff] = useState<StaffMember[]>([
    {
      id: '1',
      staffId: 'EMP001',
      name: 'Rajesh Kumar',
      designation: 'Shop Manager',
      salary: 25000,
      status: 'Active'
    },
    {
      id: '2',
      staffId: 'EMP002',
      name: 'Priya Sharma',
      designation: 'Sales Assistant',
      salary: 18000,
      status: 'Active'
    },
    {
      id: '3',
      staffId: 'EMP003',
      name: 'Venkat Reddy',
      designation: 'Cashier',
      salary: 22000,
      status: 'Resigned',
      resignedDate: '2024-01-15'
    },
    {
      id: '4',
      staffId: 'EMP004',
      name: 'Amit Singh',
      designation: 'Sales Executive',
      salary: 20000,
      status: 'Active'
    },
    {
      id: '5',
      staffId: 'EMP005',
      name: 'Sneha Patel',
      designation: 'Assistant Manager',
      salary: 28000,
      status: 'Active'
    }
  ]);

  const [salaryEntries, setSalaryEntries] = useState<SalaryEntry[]>([
    {
      id: '1',
      date: '2024-01-31',
      staffId: 'EMP001',
      staffName: 'Rajesh Kumar',
      designation: 'Shop Manager',
      salary: 25000,
      paymentMode: 'NEFT',
      createdBy: 'admin',
      createdAt: '2024-01-31T10:30:00Z'
    },
    {
      id: '2',
      date: '2024-01-31',
      staffId: 'EMP002',
      staffName: 'Priya Sharma',
      designation: 'Sales Assistant',
      salary: 18000,
      paymentMode: 'UPI',
      createdBy: 'admin',
      createdAt: '2024-01-31T10:45:00Z'
    },
    {
      id: '3',
      date: '2024-01-15',
      staffId: 'EMP003',
      staffName: 'Venkat Reddy',
      designation: 'Cashier',
      salary: 22000,
      paymentMode: 'Cash',
      createdBy: 'manager',
      createdAt: '2024-01-15T14:20:00Z'
    },
    {
      id: '4',
      date: '2024-02-29',
      staffId: 'EMP001',
      staffName: 'Rajesh Kumar',
      designation: 'Shop Manager',
      salary: 25000,
      paymentMode: 'NEFT',
      createdBy: 'admin',
      createdAt: '2024-02-29T11:15:00Z'
    },
    {
      id: '5',
      date: '2024-02-29',
      staffId: 'EMP004',
      staffName: 'Amit Singh',
      designation: 'Sales Executive',
      salary: 20000,
      paymentMode: 'Cheque',
      createdBy: 'manager',
      createdAt: '2024-02-29T11:30:00Z'
    }
  ]);

  const paymentModes = ['Cash', 'UPI', 'NEFT', 'Cheque'];

  const getActiveStaff = () => {
    return allStaff.filter(staff => staff.status === 'Active');
  };

  const getDailyStaffData = () => {
    const activeStaff = getActiveStaff();
    return activeStaff.map(staff => {
      const existingEntry = salaryEntries.find(
        entry => entry.date === selectedDate && entry.staffId === staff.staffId
      );
      return {
        ...staff,
        paymentMode: existingEntry?.paymentMode || 'Cash',
        paid: !!existingEntry,
        entryId: existingEntry?.id,
        actualSalary: existingEntry?.salary || staff.salary
      };
    });
  };

  const handleSalaryChange = (staffId: string, newSalary: number) => {
    if (userRole === 'User') {
      alert('Users cannot modify salary entries');
      return;
    }

    const staff = allStaff.find(s => s.staffId === staffId);
    if (!staff) return;

    const existingEntry = salaryEntries.find(
      entry => entry.date === selectedDate && entry.staffId === staffId
    );

    if (existingEntry) {
      // Update existing entry
      setSalaryEntries(entries =>
        entries.map(entry =>
          entry.id === existingEntry.id
            ? { ...entry, salary: newSalary }
            : entry
        )
      );
    } else {
      // Create new entry with updated salary
      const newEntry: SalaryEntry = {
        id: Date.now().toString() + staffId,
        date: selectedDate,
        staffId: staff.staffId,
        staffName: staff.name,
        designation: staff.designation,
        salary: newSalary,
        paymentMode: 'Cash',
        createdBy: currentUser,
        createdAt: new Date().toISOString()
      };
      setSalaryEntries([...salaryEntries, newEntry]);
    }

    onLogAction('Update Salary Amount', `Updated ${staff.name} salary to ₹${newSalary.toLocaleString()} for ${selectedDate}`);
  };

  const togglePaymentStatus = (staffId: string) => {
    if (userRole === 'User') {
      alert('Users cannot modify salary entries');
      return;
    }

    const staff = allStaff.find(s => s.staffId === staffId);
    if (!staff) return;

    const existingEntry = salaryEntries.find(
      entry => entry.date === selectedDate && entry.staffId === staffId
    );

    if (existingEntry) {
      // Remove entry (mark as unpaid)
      setSalaryEntries(entries => entries.filter(entry => entry.id !== existingEntry.id));
      onLogAction('Mark Salary Unpaid', `Marked ${staff.name} salary as unpaid for ${selectedDate}`);
    } else {
      // Create new entry (mark as paid)
      const newEntry: SalaryEntry = {
        id: Date.now().toString() + staffId,
        date: selectedDate,
        staffId: staff.staffId,
        staffName: staff.name,
        designation: staff.designation,
        salary: staff.salary,
        paymentMode: 'Cash',
        createdBy: currentUser,
        createdAt: new Date().toISOString()
      };
      setSalaryEntries([...salaryEntries, newEntry]);
      onLogAction('Mark Salary Paid', `Marked ${staff.name} salary as paid for ${selectedDate}`);
    }
  };

  const handlePaymentModeChange = (staffId: string, paymentMode: string) => {
    if (userRole === 'User') {
      alert('Users cannot modify salary entries');
      return;
    }

    const staff = allStaff.find(s => s.staffId === staffId);
    if (!staff) return;

    const existingEntry = salaryEntries.find(
      entry => entry.date === selectedDate && entry.staffId === staffId
    );

    if (existingEntry) {
      // Update existing entry
      setSalaryEntries(entries =>
        entries.map(entry =>
          entry.id === existingEntry.id
            ? { ...entry, paymentMode: paymentMode as SalaryEntry['paymentMode'] }
            : entry
        )
      );
    } else {
      // Create new entry
      const newEntry: SalaryEntry = {
        id: Date.now().toString() + staffId,
        date: selectedDate,
        staffId: staff.staffId,
        staffName: staff.name,
        designation: staff.designation,
        salary: staff.salary,
        paymentMode: paymentMode as SalaryEntry['paymentMode'],
        createdBy: currentUser,
        createdAt: new Date().toISOString()
      };
      setSalaryEntries([...salaryEntries, newEntry]);
    }

    onLogAction('Update Payment Mode', `Set ${staff.name} payment mode to ${paymentMode} for ${selectedDate}`);
  };

  const getDateRangeForFilter = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    switch (dateRangeFilter) {
      case 'current-month':
        return {
          start: new Date(currentYear, currentMonth, 1).toISOString().split('T')[0],
          end: new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0]
        };
      case 'previous-month':
        return {
          start: new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0],
          end: new Date(currentYear, currentMonth, 0).toISOString().split('T')[0]
        };
      case 'last-3-months':
        return {
          start: new Date(currentYear, currentMonth - 2, 1).toISOString().split('T')[0],
          end: new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0]
        };
      case 'current-financial-year':
        const fyStart = currentMonth >= 3 ? currentYear : currentYear - 1;
        return {
          start: new Date(fyStart, 3, 1).toISOString().split('T')[0],
          end: new Date(fyStart + 1, 2, 31).toISOString().split('T')[0]
        };
      case 'previous-financial-year':
        const prevFyStart = currentMonth >= 3 ? currentYear - 1 : currentYear - 2;
        return {
          start: new Date(prevFyStart, 3, 1).toISOString().split('T')[0],
          end: new Date(prevFyStart + 1, 2, 31).toISOString().split('T')[0]
        };
      case 'custom':
        return {
          start: customDateRange.startDate,
          end: customDateRange.endDate
        };
      default:
        return {
          start: new Date(currentYear, currentMonth, 1).toISOString().split('T')[0],
          end: new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0]
        };
    }
  };

  const getFilteredMonthlyEntries = () => {
    const dateRange = getDateRangeForFilter();
    let filtered = salaryEntries.filter(
      entry => entry.date >= dateRange.start && entry.date <= dateRange.end
    );

    // Staff filter
    if (staffFilter !== 'all') {
      filtered = filtered.filter(entry => entry.staffId === staffFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      const relevantStaff = allStaff.filter(staff => {
        if (statusFilter === 'active') return staff.status === 'Active';
        if (statusFilter === 'resigned') return staff.status === 'Resigned';
        return true;
      });
      const relevantStaffIds = relevantStaff.map(s => s.staffId);
      filtered = filtered.filter(entry => relevantStaffIds.includes(entry.staffId));
    }

    return filtered;
  };

  const exportToExcel = () => {
    if (viewMode === 'daily') {
      const dailyData = getDailyStaffData();
      const paidStaff = dailyData.filter(staff => staff.paid);

      const headers = ['S.No', 'Staff ID', 'Name', 'Designation', 'Salary', 'Payment Mode'];
      const csvContent = [
        headers.join(','),
        ...paidStaff.map((staff, index) => [
          index + 1,
          staff.staffId,
          staff.name,
          staff.designation,
          staff.salary,
          staff.paymentMode
        ].join(',')),
        '',
        `Total Salary Paid: ₹${paidStaff.reduce((sum, staff) => sum + staff.salary, 0).toLocaleString()}`
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `daily_salary_${selectedDate}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const monthlyData = getFilteredMonthlyEntries();
      const headers = [
        'S.No',
        'Date',
        'Staff ID',
        'Name',
        'Designation',
        'Salary',
        'Payment Mode',
        'Created By',
        'Created At'
      ];

      const csvContent = [
        headers.join(','),
        ...monthlyData.map((entry, index) => [
          index + 1,
          entry.date,
          entry.staffId,
          entry.staffName,
          entry.designation,
          entry.salary,
          entry.paymentMode,
          entry.createdBy,
          new Date(entry.createdAt).toLocaleString()
        ].join(',')),
        '',
        `Total Entries: ${monthlyData.length}`,
        `Total Amount: ₹${monthlyData.reduce((sum, entry) => sum + entry.salary, 0).toLocaleString()}`
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      const dateRange = getDateRangeForFilter();
      link.setAttribute('download', `monthly_salary_${dateRange.start}_to_${dateRange.end}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    onLogAction('Export Salary', `Exported ${viewMode} salary data`);
  };

  const dailyStaffData = getDailyStaffData();
  const dailyTotal = dailyStaffData.filter(staff => staff.paid).reduce((sum, staff) => sum + staff.actualSalary, 0);
  const monthlyEntries = getFilteredMonthlyEntries();
  const monthlyTotal = monthlyEntries.reduce((sum, entry) => sum + entry.salary, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Salary Management</h1>
          <div className="flex gap-2">
            <button
              onClick={exportToExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <i className="ri-file-excel-2-line w-4 h-4 flex items-center justify-center"></i>
              Export
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={`px-4 py-2 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap ${
                viewMode === 'daily'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Day Wise
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-4 py-2 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap ${
                viewMode === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Monthly Wise
            </button>
          </div>
        </div>

        {viewMode === 'daily' ? (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => {
                  setSelectedDate(e.target.value);
                  onLogAction('Change Date', `Switched to salary view for ${e.target.value}`);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-green-800">
                Total Salary for {selectedDate}: ₹{dailyTotal.toLocaleString()}
              </h3>
              <p className="text-sm text-green-600 mt-1">
                {dailyStaffData.filter(staff => staff.paid).length} of {dailyStaffData.length} staff paid
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">S.No</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Designation</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Salary</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment Mode</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dailyStaffData.map((staff, index) => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{staff.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{staff.designation}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <input
                          type="number"
                          value={staff.actualSalary}
                          onChange={e => handleSalaryChange(staff.staffId, Number(e.target.value))}
                          className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-green-600 font-medium"
                          disabled={userRole === 'User'}
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <select
                          value={staff.paymentMode}
                          onChange={e => handlePaymentModeChange(staff.staffId, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-8"
                          disabled={userRole === 'User'}
                        >
                          {paymentModes.map(mode => (
                            <option key={mode} value={mode}>
                              {mode}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => togglePaymentStatus(staff.staffId)}
                          disabled={userRole === 'User'}
                          className={`px-3 py-1 text-xs rounded-full cursor-pointer transition duration-200 whitespace-nowrap ${
                            staff.paid
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          } ${userRole === 'User' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {staff.paid ? 'Paid ✓' : 'Pending'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateRangeFilter}
                  onChange={e => {
                    setDateRangeFilter(e.target.value);
                    onLogAction('Change Date Range', `Changed salary date range to ${e.target.value}`);
                  }}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Staff Filter</label>
                <select
                  value={staffFilter}
                  onChange={e => setStaffFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  <option value="all">All Staff</option>
                  {allStaff.map(staff => (
                    <option key={staff.staffId} value={staff.staffId}>
                      {staff.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  <option value="all">All</option>
                  <option value="active">Active Staff</option>
                  <option value="resigned">Resigned Staff</option>
                </select>
              </div>
            </div>

            {dateRangeFilter === 'custom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={customDateRange.startDate}
                    onChange={e => setCustomDateRange({ ...customDateRange, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={customDateRange.endDate}
                    onChange={e => setCustomDateRange({ ...customDateRange, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-800">
                Total Salary Paid: ₹{monthlyTotal.toLocaleString()}
              </h3>
              <p className="text-sm text-blue-600 mt-1">
                {monthlyEntries.length} salary payments found
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">S.No</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Staff ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Designation</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Salary</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment Mode</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created By</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlyEntries.map((entry, index) => {
                    const staff = allStaff.find(s => s.staffId === entry.staffId);
                    return (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{entry.date}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{entry.staffId}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{entry.staffName}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{entry.designation}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">₹{entry.salary.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {entry.paymentMode}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{entry.createdBy}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              staff?.status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {staff?.status || 'Unknown'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {monthlyEntries.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                        No salary entries found for selected criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600">
            <i className="ri-information-line w-5 h-5 flex items-center justify-center"></i>
            <p className="text-sm">
              {viewMode === 'daily'
                ? 'Edit salary amounts directly in the table. Click payment status to toggle between paid and pending.'
                : 'Monthly view shows complete salary history including resigned staff. Use filters to narrow down results.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
