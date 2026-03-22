
'use client';

import { useState } from 'react';

interface StaffMember {
  id: string;
  staffId: string;
  name: string;
  status: 'Active' | 'Resigned';
  resignedDate?: string;
}

interface AttendanceRecord {
  id: string;
  date: string;
  staffId: string;
  staffName: string;
  status: 'Present' | 'Absent' | 'Morning Half' | 'Afternoon Half' | 'Day Off';
  checkInTime?: string;
  checkOutTime?: string;
  reason?: 'Medical Leave' | 'Function' | 'Others';
  reasonDetails?: string;
  createdBy?: string;
  createdAt?: string;
}

interface AttendanceProps {
  userRole: string;
  currentUser: string;
  onLogAction: (action: string, details: string) => void;
}

export default function Attendance({ userRole, currentUser, onLogAction }: AttendanceProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'daily' | 'monthly' | 'detailed'>('daily');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [useCustomRange, setUseCustomRange] = useState(false);

  // Mock staff data including resigned staff
  const [allStaff] = useState<StaffMember[]>([
    { id: '1', staffId: 'EMP001', name: 'Rajesh Kumar', status: 'Active' },
    { id: '2', staffId: 'EMP002', name: 'Priya Sharma', status: 'Active' },
    { id: '3', staffId: 'EMP003', name: 'Venkat Reddy', status: 'Resigned', resignedDate: '2024-01-15' },
    { id: '4', staffId: 'EMP004', name: 'Amit Singh', status: 'Active' },
    { id: '5', staffId: 'EMP005', name: 'Sneha Patel', status: 'Active' }
  ]);

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: '1',
      date: '2024-01-15',
      staffId: 'EMP001',
      staffName: 'Rajesh Kumar',
      status: 'Present',
      checkInTime: '09:00',
      checkOutTime: '18:30',
      createdBy: 'admin',
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: '2',
      date: '2024-01-15',
      staffId: 'EMP002',
      staffName: 'Priya Sharma',
      status: 'Absent',
      reason: 'Medical Leave',
      reasonDetails: 'Fever',
      createdBy: 'manager',
      createdAt: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      date: '2024-01-15',
      staffId: 'EMP003',
      staffName: 'Venkat Reddy',
      status: 'Present',
      checkInTime: '09:00',
      checkOutTime: '17:00',
      createdBy: 'admin',
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: '4',
      date: '2024-01-15',
      staffId: 'EMP004',
      staffName: 'Amit Singh',
      status: 'Morning Half',
      checkInTime: '09:00',
      checkOutTime: '13:00',
      createdBy: 'manager',
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: '5',
      date: '2024-01-15',
      staffId: 'EMP005',
      staffName: 'Sneha Patel',
      status: 'Present',
      checkInTime: '09:15',
      checkOutTime: '18:45',
      createdBy: 'admin',
      createdAt: '2024-01-15T09:15:00Z'
    },
    {
      id: '6',
      date: '2024-01-16',
      staffId: 'EMP001',
      staffName: 'Rajesh Kumar',
      status: 'Afternoon Half',
      checkInTime: '13:00',
      checkOutTime: '18:00',
      createdBy: 'admin',
      createdAt: '2024-01-16T13:00:00Z'
    },
    {
      id: '7',
      date: '2024-01-16',
      staffId: 'EMP002',
      staffName: 'Priya Sharma',
      status: 'Present',
      checkInTime: '09:00',
      checkOutTime: '18:00',
      createdBy: 'manager',
      createdAt: '2024-01-16T09:00:00Z'
    },
    {
      id: '8',
      date: '2024-01-16',
      staffId: 'EMP003',
      staffName: 'Venkat Reddy',
      status: 'Present',
      checkInTime: '09:00',
      checkOutTime: '17:00',
      createdBy: 'admin',
      createdAt: '2024-01-16T09:00:00Z'
    },
    {
      id: '9',
      date: '2024-01-17',
      staffId: 'EMP001',
      staffName: 'Rajesh Kumar',
      status: 'Present',
      checkInTime: '09:00',
      checkOutTime: '18:30',
      createdBy: 'admin',
      createdAt: '2024-01-17T09:00:00Z'
    },
    {
      id: '10',
      date: '2024-01-17',
      staffId: 'EMP002',
      staffName: 'Priya Sharma',
      status: 'Day Off',
      createdBy: 'manager',
      createdAt: '2024-01-17T08:00:00Z'
    },
    {
      id: '11',
      date: '2024-01-17',
      staffId: 'EMP004',
      staffName: 'Amit Singh',
      status: 'Absent',
      reason: 'Function',
      reasonDetails: 'Wedding ceremony',
      createdBy: 'admin',
      createdAt: '2024-01-17T08:30:00Z'
    },
    {
      id: '12',
      date: '2024-01-18',
      staffId: 'EMP001',
      staffName: 'Rajesh Kumar',
      status: 'Present',
      checkInTime: '09:15',
      checkOutTime: '18:45',
      createdBy: 'admin',
      createdAt: '2024-01-18T09:15:00Z'
    },
    {
      id: '13',
      date: '2024-01-18',
      staffId: 'EMP005',
      staffName: 'Sneha Patel',
      status: 'Morning Half',
      checkInTime: '09:00',
      checkOutTime: '13:30',
      createdBy: 'manager',
      createdAt: '2024-01-18T09:00:00Z'
    }
  ]);

  const handleAttendanceChange = (staffId: string, status: AttendanceRecord['status']) => {
    if (userRole === 'User') {
      alert('Users cannot modify attendance records');
      return;
    }

    const existingRecord = attendanceRecords.find(r => r.date === selectedDate && r.staffId === staffId);

    const staff = allStaff.find(s => s.staffId === staffId);

    if (existingRecord) {
      const updatedRecords = attendanceRecords.map(record =>
        record.id === existingRecord.id
          ? {
              ...record,
              status,
              reason: status === 'Absent' ? record.reason : undefined,
              checkInTime: status === 'Present' || status === 'Morning Half' || status === 'Afternoon Half' ? record.checkInTime || '' : undefined,
              checkOutTime: status === 'Present' || status === 'Morning Half' || status === 'Afternoon Half' ? record.checkOutTime || '' : undefined
            }
          : record
      );
      setAttendanceRecords(updatedRecords);
    } else {
      if (staff) {
        const newRecord: AttendanceRecord = {
          id: Date.now().toString() + staffId,
          date: selectedDate,
          staffId,
          staffName: staff.name,
          status,
          checkInTime: status === 'Present' || status === 'Morning Half' || status === 'Afternoon Half' ? '' : undefined,
          checkOutTime: status === 'Present' || status === 'Morning Half' || status === 'Afternoon Half' ? '' : undefined,
          createdBy: currentUser,
          createdAt: new Date().toISOString()
        };
        setAttendanceRecords([...attendanceRecords, newRecord]);
      }
    }

    onLogAction('Update Attendance', `Set ${staff?.name} attendance to ${status} for ${selectedDate}`);
  };

  const handleTimeChange = (staffId: string, timeType: 'checkInTime' | 'checkOutTime', time: string) => {
    if (userRole === 'User') return;

    const existingRecord = attendanceRecords.find(r => r.date === selectedDate && r.staffId === staffId);

    if (existingRecord) {
      const updatedRecords = attendanceRecords.map(record =>
        record.id === existingRecord.id
          ? { ...record, [timeType]: time }
          : record
      );
      setAttendanceRecords(updatedRecords);

      const staff = allStaff.find(s => s.staffId === staffId);
      onLogAction('Update Time', `Updated ${timeType} for ${staff?.name}: ${time}`);
    }
  };

  const handleReasonChange = (staffId: string, reason: AttendanceRecord['reason'], reasonDetails?: string) => {
    if (userRole === 'User') return;

    const existingRecord = attendanceRecords.find(r => r.date === selectedDate && r.staffId === staffId);

    if (existingRecord) {
      setAttendanceRecords(attendanceRecords.map(record =>
        record.id === existingRecord.id
          ? { ...record, reason, reasonDetails }
          : record
      ));
    }
  };

  const getTodayAttendance = () => {
    const activeStaff = allStaff.filter(s => s.status === 'Active');
    return activeStaff.map(staff => {
      const record = attendanceRecords.find(r => r.date === selectedDate && r.staffId === staff.staffId);
      return {
        ...staff,
        attendance: record?.status || 'Present',
        checkInTime: record?.checkInTime || '',
        checkOutTime: record?.checkOutTime || '',
        reason: record?.reason,
        reasonDetails: record?.reasonDetails,
        createdBy: record?.createdBy
      };
    });
  };

  const getDateRange = () => {
    if (useCustomRange) {
      return {
        start: customDateRange.startDate,
        end: customDateRange.endDate
      };
    } else {
      const year = parseInt(selectedMonth.split('-')[0]);
      const month = parseInt(selectedMonth.split('-')[1]) - 1;
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0);
      return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      };
    }
  };

  const getMonthlyAttendance = () => {
    const dateRange = getDateRange();
    const rangeRecords = attendanceRecords.filter(r => r.date >= dateRange.start && r.date <= dateRange.end);

    // Include all staff (active and resigned) but filter resigned staff based on date range
    const relevantStaff = allStaff.filter(staff => {
      if (staff.status === 'Active') return true;
      if (staff.resignedDate && staff.resignedDate >= dateRange.start) return true;
      return false;
    });

    const staffSummary = relevantStaff.map(staff => {
      const staffRecords = rangeRecords.filter(r => r.staffId === staff.staffId);
      const present = staffRecords.filter(r => r.status === 'Present').length;
      const absent = staffRecords.filter(r => r.status === 'Absent').length;
      const morningHalf = staffRecords.filter(r => r.status === 'Morning Half').length;
      const afternoonHalf = staffRecords.filter(r => r.status === 'Afternoon Half').length;
      const dayOffs = staffRecords.filter(r => r.status === 'Day Off').length;

      // Calculate present days with half days counted as 0.5
      const totalPresentDays = present + (morningHalf * 0.5) + (afternoonHalf * 0.5);
      const totalAbsentDays = absent + (morningHalf * 0.5) + (afternoonHalf * 0.5);
      const totalWorkingDays = present + absent + morningHalf + afternoonHalf;

      // Calculate percentage
      const presentPercentage = totalWorkingDays > 0 ? (totalPresentDays / totalWorkingDays) * 100 : 0;

      // Calculate total working hours
      const totalHours = staffRecords.reduce((sum, record) => {
        if (record.checkInTime && record.checkOutTime) {
          const checkIn = new Date(`2024-01-01T${record.checkInTime}:00`);
          const checkOut = new Date(`2024-01-01T${record.checkOutTime}:00`);
          const hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
          return sum + hours;
        }
        return sum;
      }, 0);

      return {
        ...staff,
        present,
        absent,
        morningHalf,
        afternoonHalf,
        dayOffs,
        totalDays: staffRecords.length,
        totalPresentDays: Math.round(totalPresentDays * 10) / 10,
        totalAbsentDays: Math.round(totalAbsentDays * 10) / 10,
        presentPercentage: Math.round(presentPercentage * 10) / 10,
        totalHours: Math.round(totalHours * 10) / 10
      };
    });
    return staffSummary;
  };

  const getDetailedAttendance = () => {
    const dateRange = getDateRange();
    const rangeRecords = attendanceRecords.filter(r => r.date >= dateRange.start && r.date <= dateRange.end);

    // Get all unique dates in the range
    const uniqueDates = [...new Set(rangeRecords.map(r => r.date))].sort();

    // Include all staff (active and resigned) but filter resigned staff based on date range
    const relevantStaff = allStaff.filter(staff => {
      if (staff.status === 'Active') return true;
      if (staff.resignedDate && staff.resignedDate >= dateRange.start) return true;
      return false;
    });

    return uniqueDates.map(date => {
      const dayRecords = rangeRecords.filter(r => r.date === date);
      const staffAttendance = relevantStaff.map(staff => {
        const record = dayRecords.find(r => r.staffId === staff.staffId);
        return {
          ...staff,
          date,
          attendance: record?.status || 'Absent',
          checkInTime: record?.checkInTime || '',
          checkOutTime: record?.checkOutTime || '',
          reason: record?.reason,
          reasonDetails: record?.reasonDetails,
          createdBy: record?.createdBy || ''
        };
      });

      return {
        date,
        dayName: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
        staffAttendance
      };
    });
  };

  const exportToExcel = () => {
    const monthlyData = getMonthlyAttendance();
    const dateRange = getDateRange();

    // Create CSV content
    const headers = [
      'Staff ID',
      'Name',
      'Status',
      'Present Days',
      'Absent Days',
      'Morning Half',
      'Afternoon Half',
      'Day Offs',
      'Total Present Days',
      'Total Absent Days',
      'Present %',
      'Total Hours',
      'Total Records'
    ];

    const csvContent = [
      headers.join(','),
      ...monthlyData.map(staff => [
        staff.staffId,
        staff.name,
        staff.status,
        staff.present,
        staff.absent,
        staff.morningHalf,
        staff.afternoonHalf,
        staff.dayOffs,
        staff.totalPresentDays,
        staff.totalAbsentDays,
        `${staff.presentPercentage}%`,
        `${staff.totalHours}h`,
        staff.totalDays
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_report_${dateRange.start}_to_${dateRange.end}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onLogAction('Export Attendance', `Exported attendance report for ${dateRange.start} to ${dateRange.end}`);
  };

  const exportDetailedToExcel = () => {
    const detailedData = getDetailedAttendance();
    const dateRange = getDateRange();

    // Create CSV content
    const headers = [
      'Date',
      'Day',
      'Staff ID',
      'Staff Name',
      'Status',
      'Attendance',
      'Check-In Time',
      'Check-Out Time',
      'Reason',
      'Details',
      'Created By'
    ];

    const csvRows = [];
    csvRows.push(headers.join(','));

    detailedData.forEach(day => {
      day.staffAttendance.forEach(staff => {
        const row = [
          day.date,
          day.dayName,
          staff.staffId,
          staff.name,
          staff.status,
          staff.attendance,
          staff.checkInTime || '',
          staff.checkOutTime || '',
          staff.reason || '',
          staff.reasonDetails || '',
          staff.createdBy || ''
        ];
        csvRows.push(row.join(','));
      });
    });

    const csvContent = csvRows.join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `detailed_attendance_${dateRange.start}_to_${dateRange.end}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onLogAction('Export Detailed Attendance', `Exported detailed attendance report for ${dateRange.start} to ${dateRange.end}`);
  };

  const attendanceStatuses = ['Present', 'Absent', 'Morning Half', 'Afternoon Half', 'Day Off'];
  const absentReasons = ['Medical Leave', 'Function', 'Others'];
  const isReadOnly = userRole === 'User';

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Staff Attendance</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-4 py-2 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap ${
                viewMode === 'daily'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Daily View
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-4 py-2 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap ${
                viewMode === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Monthly View
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-4 py-2 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap ${
                viewMode === 'detailed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Detailed View
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
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  onLogAction('Change Date', `Switched to attendance view for ${e.target.value}`);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Staff ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Attendance</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Check-In Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Check-Out Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Reason</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Details</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created By</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getTodayAttendance().map((staff) => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{staff.staffId}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{staff.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <select
                          value={staff.attendance}
                          onChange={(e) => handleAttendanceChange(staff.staffId, e.target.value as AttendanceRecord['status'])}
                          className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-8"
                          disabled={isReadOnly}
                        >
                          {attendanceStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {(staff.attendance === 'Present' || staff.attendance === 'Morning Half' || staff.attendance === 'Afternoon Half') && (
                          <input
                            type="time"
                            value={staff.checkInTime}
                            onChange={(e) => handleTimeChange(staff.staffId, 'checkInTime', e.target.value)}
                            placeholder="Enter check-in time"
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={isReadOnly}
                          />
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {(staff.attendance === 'Present' || staff.attendance === 'Morning Half' || staff.attendance === 'Afternoon Half') && (
                          <input
                            type="time"
                            value={staff.checkOutTime}
                            onChange={(e) => handleTimeChange(staff.staffId, 'checkOutTime', e.target.value)}
                            placeholder="Enter check-out time"
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={isReadOnly}
                          />
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {staff.attendance === 'Absent' && (
                          <select
                            value={staff.reason || ''}
                            onChange={(e) => handleReasonChange(staff.staffId, e.target.value as AttendanceRecord['reason'])}
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-8"
                            disabled={isReadOnly}
                          >
                            <option value="">Select Reason</option>
                            {absentReasons.map((reason) => (
                              <option key={reason} value={reason}>
                                {reason}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {staff.attendance === 'Absent' && staff.reason && (
                          <input
                            type="text"
                            value={staff.reasonDetails || ''}
                            onChange={(e) => handleReasonChange(staff.staffId, staff.reason, e.target.value)}
                            placeholder="Additional details"
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={isReadOnly}
                          />
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{staff.createdBy || 'System'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : viewMode === 'detailed' ? (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="useCustomRangeDetailed"
                    checked={useCustomRange}
                    onChange={(e) => setUseCustomRange(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="useCustomRangeDetailed" className="text-sm font-medium text-gray-700">
                    Use Custom Date Range
                  </label>
                </div>
                <button
                  onClick={exportDetailedToExcel}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
                >
                  <i className="ri-file-excel-2-line w-4 h-4 flex items-center justify-center" />
                  Export Detailed Report
                </button>
              </div>

              {useCustomRange ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={customDateRange.startDate}
                      onChange={(e) => {
                        setCustomDateRange({ ...customDateRange, startDate: e.target.value });
                        onLogAction('Change Custom Start Date', `Set start date to ${e.target.value}`);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={customDateRange.endDate}
                      onChange={(e) => {
                        setCustomDateRange({ ...customDateRange, endDate: e.target.value });
                        onLogAction('Change Custom End Date', `Set end date to ${e.target.value}`);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      onLogAction('Change Month', `Switched to detailed attendance view for ${e.target.value}`);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="space-y-6">
              {getDetailedAttendance().map((day) => (
                <div key={day.date} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    <div className="text-sm text-gray-600">
                      Present: {day.staffAttendance.filter(s => s.attendance === 'Present').length} | Absent: {day.staffAttendance.filter(s => s.attendance === 'Absent').length} | Half Day: {day.staffAttendance.filter(s => s.attendance === 'Morning Half' || s.attendance === 'Afternoon Half').length}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Staff ID</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Attendance</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Check-In</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Check-Out</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Reason</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created By</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {day.staffAttendance.map((staff) => (
                          <tr key={`${day.date}-${staff.id}`} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">{staff.staffId}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">{staff.name}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  staff.status === 'Active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {staff.status}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                              <span
                                className={`px-2 py-1 text-xs rounded-full font-medium ${
                                  staff.attendance === 'Present'
                                    ? 'bg-green-100 text-green-800'
                                    : staff.attendance === 'Absent'
                                    ? 'bg-red-100 text-red-800'
                                    : staff.attendance === 'Day Off'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {staff.attendance}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{staff.checkInTime || '-'}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{staff.checkOutTime || '-'}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                              {staff.reason ? (
                                <div>
                                  <div className="font-medium">{staff.reason}</div>
                                  {staff.reasonDetails && <div className="text-xs text-gray-500">{staff.reasonDetails}</div>}
                                </div>
                              ) : '-'}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{staff.createdBy || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="useCustomRange"
                    checked={useCustomRange}
                    onChange={(e) => setUseCustomRange(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="useCustomRange" className="text-sm font-medium text-gray-700">
                    Use Custom Date Range
                  </label>
                </div>
                <button
                  onClick={exportToExcel}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
                >
                  <i className="ri-file-excel-2-line w-4 h-4 flex items-center justify-center" />
                  Export to Excel
                </button>
              </div>

              {useCustomRange ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={customDateRange.startDate}
                      onChange={(e) => {
                        setCustomDateRange({ ...customDateRange, startDate: e.target.value });
                        onLogAction('Change Custom Start Date', `Set start date to ${e.target.value}`);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={customDateRange.endDate}
                      onChange={(e) => {
                        setCustomDateRange({ ...customDateRange, endDate: e.target.value });
                        onLogAction('Change Custom End Date', `Set end date to ${e.target.value}`);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      onLogAction('Change Month', `Switched to monthly attendance view for ${e.target.value}`);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Staff ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Present</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Absent</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Morning Half</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Afternoon Half</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Day Offs</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Present Days</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Present %</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total Hours</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getMonthlyAttendance().map((staff) => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{staff.staffId}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        <div className="flex items-center gap-2">
                          {staff.name}
                          {staff.status === 'Resigned' && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                              Resigned
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            staff.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {staff.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{staff.present}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{staff.absent}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium">{staff.morningHalf}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">{staff.afternoonHalf}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">{staff.dayOffs}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-green-700 font-medium">{staff.totalPresentDays}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`font-medium ${
                            staff.presentPercentage >= 90
                              ? 'text-green-600'
                              : staff.presentPercentage >= 75
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {staff.presentPercentage}%
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">{staff.totalHours}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600">
            <i className="ri-information-line w-5 h-5 flex items-center justify-center" />
            <p className="text-sm">
              {isReadOnly
                ? 'You have read-only access to attendance records.'
                : viewMode === 'detailed'
                ? 'Detailed view shows each day\'s attendance for all staff members. Export includes comprehensive day-by-day attendance data.'
                : viewMode === 'monthly'
                ? 'Half days are calculated as 0.5 present and 0.5 absent. Present percentage excludes day offs. Export includes all staff (active and resigned).'
                : 'Check-in and check-out times must be entered manually. Staff attendance affects salary calculations. Created By shows who entered the attendance record.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
