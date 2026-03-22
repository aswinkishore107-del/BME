
'use client';

import { useState } from 'react';

interface MaintenanceEntry {
  id: string;
  date: string;
  issue: string;
  workDoneDetails: string;
  doneBy: string;
  amount: number;
  category: string;
  createdBy: string;
  createdAt: string;
}

interface TicketEntry {
  id: string;
  date: string;
  issue: string;
  details: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved';
  submittedBy: string;
}

interface MaintenanceProps {
  userRole: string;
  currentUser: string;
  onLogAction: (action: string, details: string, module?: string) => void;
}

export default function Maintenance({ userRole, currentUser, onLogAction }: MaintenanceProps) {
  const [mainTab, setMainTab] = useState<'new-issues' | 'maintenance-history'>('new-issues');
  const [activeCategory, setActiveCategory] = useState<'all' | string>('all');
  const [dateFilter, setDateFilter] = useState('current-month');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MaintenanceEntry | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Categories management
  const [categories, setCategories] = useState([
    'ups',
    'electrical',
    'plumbing',
    'carpentry',
    'network',
    'others'
  ]);

  // Sample maintenance data
  const [maintenanceEntries, setMaintenanceEntries] = useState<MaintenanceEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      issue: 'UPS battery backup failure',
      workDoneDetails: 'Replaced old batteries with new 12V 7Ah batteries. Tested backup duration - now providing 2 hours backup.',
      doneBy: 'Rajesh Kumar',
      amount: 8500,
      category: 'ups',
      createdBy: 'Admin',
      createdAt: '2024-01-15T10:30:00'
    },
    {
      id: '2',
      date: '2024-01-18',
      issue: 'Power fluctuation in main office',
      workDoneDetails: 'Installed voltage stabilizer for computer systems. Fixed loose connections in main electrical panel.',
      doneBy: 'Suresh Electricals',
      amount: 12000,
      category: 'electrical',
      createdBy: 'John Manager',
      createdAt: '2024-01-18T14:20:00'
    },
    {
      id: '3',
      date: '2024-01-20',
      issue: 'Water leakage in washroom',
      workDoneDetails: 'Fixed pipe joint leakage, replaced damaged pipe section with new PVC pipe. Applied waterproof sealant.',
      doneBy: 'Mohan Plumber',
      amount: 3500,
      category: 'plumbing',
      createdBy: 'Jane Smith',
      createdAt: '2024-01-20T09:15:00'
    },
    {
      id: '4',
      date: '2024-01-22',
      issue: 'Manager cabin door lock broken',
      workDoneDetails: 'Replaced door lock mechanism with new mortise lock. Adjusted door alignment for smooth operation.',
      doneBy: 'Carpenter Ravi',
      amount: 2800,
      category: 'carpentry',
      createdBy: 'Admin',
      createdAt: '2024-01-22T16:45:00'
    },
    {
      id: '5',
      date: '2024-01-25',
      issue: 'Internet connectivity issues',
      workDoneDetails: 'Replaced faulty ethernet cables, configured network switch settings. Upgraded router firmware.',
      doneBy: 'Tech Solutions',
      amount: 4200,
      category: 'network',
      createdBy: 'Mike Johnson',
      createdAt: '2024-01-25T11:30:00'
    },
    {
      id: '6',
      date: '2024-01-28',
      issue: 'Air conditioning not cooling',
      workDoneDetails: 'Serviced AC unit, cleaned filters, recharged refrigerant gas. Fixed thermostat calibration.',
      doneBy: 'Cool Breeze Service',
      amount: 6500,
      category: 'others',
      createdBy: 'John Manager',
      createdAt: '2024-01-28T13:20:00'
    },
    {
      id: '7',
      date: '2023-12-20',
      issue: 'UPS overheating problem',
      workDoneDetails: 'Cleaned internal components, replaced cooling fan, applied thermal paste on heat sinks.',
      doneBy: 'Power Solutions',
      amount: 5500,
      category: 'ups',
      createdBy: 'Admin',
      createdAt: '2023-12-20T15:10:00'
    },
    {
      id: '8',
      date: '2023-12-25',
      issue: 'Network server maintenance',
      workDoneDetails: 'Updated server software, cleaned hardware components, optimized network configuration settings.',
      doneBy: 'IT Department',
      amount: 0,
      category: 'network',
      createdBy: 'Tech Admin',
      createdAt: '2023-12-25T08:00:00'
    }
  ]);

  // Ticket entries from other users
  const [ticketEntries, setTicketEntries] = useState<TicketEntry[]>([
    {
      id: '1',
      date: '2024-01-29',
      issue: 'Printer not working',
      details: 'Office printer showing paper jam error even after clearing paper. Unable to print important documents.',
      priority: 'high',
      status: 'open',
      submittedBy: 'John Doe'
    },
    {
      id: '2',
      date: '2024-01-28',
      issue: 'AC making noise',
      details: 'Air conditioner in conference room making unusual rattling noise. Temperature control seems fine but noise is disturbing meetings.',
      priority: 'medium',
      status: 'in-progress',
      submittedBy: 'Jane Smith'
    },
    {
      id: '3',
      date: '2024-01-27',
      issue: 'Light bulb replacement needed',
      details: 'Two fluorescent bulbs in storage room are not working. Need replacement for proper lighting.',
      priority: 'low',
      status: 'open',
      submittedBy: 'Mike Johnson'
    }
  ]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    issue: '',
    workDoneDetails: '',
    doneBy: '',
    amount: '',
    category: 'others'
  });

  const defaultCategoryIcons = {
    'ups': 'ri-battery-line',
    'electrical': 'ri-flashlight-line',
    'plumbing': 'ri-drop-line',
    'carpentry': 'ri-hammer-line',
    'network': 'ri-wifi-line',
    'others': 'ri-tools-line'
  };

  const getCategoryIcon = (category: string) => {
    return defaultCategoryIcons[category as keyof typeof defaultCategoryIcons] || 'ri-tools-line';
  };

  const getDateRange = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    switch (dateFilter) {
      case 'current-month':
        return {
          start: new Date(currentYear, currentMonth, 1),
          end: new Date(currentYear, currentMonth + 1, 0)
        };
      case 'previous-month':
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return {
          start: new Date(prevYear, prevMonth, 1),
          end: new Date(prevYear, prevMonth + 1, 0)
        };
      case 'custom-range':
        return {
          start: customDateRange.start ? new Date(customDateRange.start) : new Date(0),
          end: customDateRange.end ? new Date(customDateRange.end) : new Date()
        };
      default:
        return { start: new Date(0), end: new Date() };
    }
  };

  const filteredEntries = maintenanceEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const dateRange = getDateRange();
    const withinDateRange = entryDate >= dateRange.start && entryDate <= dateRange.end;

    if (activeCategory === 'all') {
      return withinDateRange;
    }
    return entry.category === activeCategory && withinDateRange;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    if (categories.includes(newCategoryName.toLowerCase())) {
      alert('Category already exists');
      return;
    }

    setCategories([...categories, newCategoryName.toLowerCase()]);
    onLogAction('Add Category', `Added new maintenance category: ${newCategoryName}`, 'Maintenance');
    setNewCategoryName('');
  };

  const handleEditCategory = (oldCategory: string) => {
    if (!newCategoryName.trim()) return;

    const updatedCategories = categories.map(cat =>
      cat === oldCategory ? newCategoryName.toLowerCase() : cat
    );
    setCategories(updatedCategories);

    // Update existing entries
    const updatedEntries = maintenanceEntries.map(entry =>
      entry.category === oldCategory
        ? { ...entry, category: newCategoryName.toLowerCase() }
        : entry
    );
    setMaintenanceEntries(updatedEntries);

    onLogAction('Edit Category', `Updated category from ${oldCategory} to ${newCategoryName}`, 'Maintenance');
    setEditingCategory(null);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (category: string) => {
    if (confirm(`Are you sure you want to delete the category "${category}"?`)) {
      setCategories(categories.filter(cat => cat !== category));
      onLogAction('Delete Category', `Deleted maintenance category: ${category}`, 'Maintenance');
    }
  };

  const handleAddEntry = () => {
    if (!formData.issue || !formData.workDoneDetails || !formData.doneBy) {
      alert('Please fill in all required fields');
      return;
    }

    const newEntry: MaintenanceEntry = {
      id: Date.now().toString(),
      date: formData.date,
      issue: formData.issue,
      workDoneDetails: formData.workDoneDetails,
      doneBy: formData.doneBy,
      amount: parseFloat(formData.amount) || 0,
      category: formData.category,
      createdBy: currentUser,
      createdAt: new Date().toISOString()
    };

    setMaintenanceEntries([...maintenanceEntries, newEntry]);
    onLogAction('Add Maintenance', `Added new ${formData.category} maintenance entry: ${formData.issue}`, 'Maintenance');

    setFormData({
      date: new Date().toISOString().split('T')[0],
      issue: '',
      workDoneDetails: '',
      doneBy: '',
      amount: '',
      category: 'others'
    });
    setShowAddModal(false);
  };

  const handleEditEntry = () => {
    if (!editingEntry || !formData.issue || !formData.workDoneDetails || !formData.doneBy) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedEntries = maintenanceEntries.map(entry =>
      entry.id === editingEntry.id
        ? {
            ...entry,
            date: formData.date,
            issue: formData.issue,
            workDoneDetails: formData.workDoneDetails,
            doneBy: formData.doneBy,
            amount: parseFloat(formData.amount) || 0,
            category: formData.category
          }
        : entry
    );

    setMaintenanceEntries(updatedEntries);
    onLogAction('Edit Maintenance', `Updated ${formData.category} maintenance entry: ${formData.issue}`, 'Maintenance');

    setEditingEntry(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      issue: '',
      workDoneDetails: '',
      doneBy: '',
      amount: '',
      category: 'others'
    });
    setShowAddModal(false);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this maintenance entry?')) {
      const entryToDelete = maintenanceEntries.find(entry => entry.id === id);
      setMaintenanceEntries(maintenanceEntries.filter(entry => entry.id !== id));
      onLogAction('Delete Maintenance', `Deleted maintenance entry: ${entryToDelete?.issue}`, 'Maintenance');
    }
  };

  const updateTicketStatus = (ticketId: string, newStatus: 'open' | 'in-progress' | 'resolved') => {
    const updatedTickets = ticketEntries.map(ticket =>
      ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
    );
    setTicketEntries(updatedTickets);
    onLogAction('Update Ticket', `Updated ticket status to ${newStatus}`, 'Maintenance');
  };

  const exportEntries = () => {
    const headers = ['Date', 'Category', 'Issue', 'Work Done Details', 'Done By', 'Amount', 'Created By', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredEntries.map(entry => [
        entry.date,
        entry.category.toUpperCase(),
        entry.issue.replace(/,/g, ';'),
        entry.workDoneDetails.replace(/,/g, ';'),
        entry.doneBy,
        entry.amount,
        entry.createdBy,
        new Date(entry.createdAt).toLocaleString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maintenance-logs-${activeCategory}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    onLogAction('Export Maintenance', `Exported maintenance logs for ${activeCategory} category`, 'Maintenance');
  };

  const totalAmount = filteredEntries.reduce((sum, entry) => sum + entry.amount, 0);

  const getCategoryColor = (category: string) => {
    const colors = {
      'ups': 'bg-yellow-100 text-yellow-800',
      'electrical': 'bg-blue-100 text-blue-800',
      'plumbing': 'bg-cyan-100 text-cyan-800',
      'carpentry': 'bg-orange-100 text-orange-800',
      'network': 'bg-purple-100 text-purple-800',
      'others': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'open': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-orange-100 text-orange-800',
      'resolved': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Maintenance Logs</h1>
            <p className="text-gray-600 mt-1">Manage maintenance tickets and track maintenance history</p>
          </div>
        </div>

        {/* Main Tab Navigation */}
        <div className="flex gap-3 mb-6 border-b border-gray-200">
          <button
            onClick={() => setMainTab('new-issues')}
            className={`px-4 py-2 font-medium transition duration-200 cursor-pointer whitespace-nowrap ${
              mainTab === 'new-issues'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            New Issues
          </button>
          <button
            onClick={() => setMainTab('maintenance-history')}
            className={`px-4 py-2 font-medium transition duration-200 cursor-pointer whitespace-nowrap ${
              mainTab === 'maintenance-history'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Maintenance History
          </button>
        </div>

        {/* New Issues Tab */}
        {mainTab === 'new-issues' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Open Tickets</h2>
              <span className="text-sm text-gray-600">{ticketEntries.filter(t => t.status !== 'resolved').length} open tickets</span>
            </div>

            <div className="space-y-4">
              {ticketEntries.filter(ticket => ticket.status !== 'resolved').map(ticket => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{ticket.issue}</h3>
                      <p className="text-sm text-gray-600 mb-2">{ticket.details}</p>
                      <div className="flex gap-2 text-xs">
                        <span className="text-gray-500">Submitted: {new Date(ticket.date).toLocaleDateString()}</span>
                        <span className="text-gray-500">By: {ticket.submittedBy}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {ticket.status === 'open' && (
                      <button
                        onClick={() => updateTicketStatus(ticket.id, 'in-progress')}
                        className="px-3 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700 transition duration-200 cursor-pointer whitespace-nowrap"
                      >
                        Start Work
                      </button>
                    )}
                    {ticket.status === 'in-progress' && (
                      <button
                        onClick={() => updateTicketStatus(ticket.id, 'resolved')}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition duration-200 cursor-pointer whitespace-nowrap"
                      >
                        Mark Resolved
                      </button>
                    )}
                    {ticket.status !== 'open' && (
                      <button
                        onClick={() => updateTicketStatus(ticket.id, 'open')}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap"
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {ticketEntries.filter(ticket => ticket.status !== 'resolved').length === 0 && (
              <div className="text-center py-12">
                <i className="ri-ticket-line w-12 h-12 flex items-center justify-center text-gray-400 mx-auto mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No open tickets</h3>
                <p className="text-gray-500">All tickets have been resolved.</p>
              </div>
            )}
          </div>
        )}

        {/* Maintenance History Tab */}
        {mainTab === 'maintenance-history' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
                >
                  <i className="ri-settings-line w-4 h-4 flex items-center justify-center"></i>
                  Manage Categories
                </button>
                <button
                  onClick={exportEntries}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
                >
                  <i className="ri-download-line w-4 h-4 flex items-center justify-center"></i>
                  Export
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
                >
                  <i className="ri-add-line w-4 h-4 flex items-center justify-center"></i>
                  Add Entry
                </button>
              </div>
            </div>

            {/* Category Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => setActiveCategory('all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap ${
                  activeCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className="ri-list-check w-4 h-4 flex items-center justify-center"></i>
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap ${
                    activeCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <i className={`${getCategoryIcon(category)} w-4 h-4 flex items-center justify-center`}></i>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Date Filter */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Filter</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  <option value="current-month">Current Month</option>
                  <option value="previous-month">Previous Month</option>
                  <option value="custom-range">Custom Date Range</option>
                </select>
              </div>
              {dateFilter === 'custom-range' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={customDateRange.start}
                      onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={customDateRange.end}
                      onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-1">Total Entries</h3>
                <p className="text-2xl font-bold text-blue-900">{filteredEntries.length}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-800 mb-1">Total Amount</h3>
                <p className="text-2xl font-bold text-green-900">₹{totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-purple-800 mb-1">Average Cost</h3>
                <p className="text-2xl font-bold text-purple-900">
                  ₹{filteredEntries.length > 0 ? Math.round(totalAmount / filteredEntries.length).toLocaleString() : 0}
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800 mb-1">Category</h3>
                <p className="text-2xl font-bold text-yellow-900 capitalize">{activeCategory}</p>
              </div>
            </div>

            {/* Entries Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    {activeCategory === 'all' && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">S.No.</th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                    {activeCategory === 'all' && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category</th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Issue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Work Done Details</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Done By</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created By</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEntries.map((entry, index) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      {activeCategory === 'all' && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                      )}
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      {activeCategory === 'all' && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(entry.category)}`}>
                            {entry.category.toUpperCase()}
                          </span>
                        </td>
                      )}
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                        <span title={entry.issue}>{entry.issue}</span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 max-w-md">
                        <span title={entry.workDoneDetails}>
                          {entry.workDoneDetails.length > 100
                            ? entry.workDoneDetails.substring(0, 100) + '...'
                            : entry.workDoneDetails}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.doneBy}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{entry.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-xs font-medium text-blue-600">
                              {entry.createdBy.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{entry.createdBy}</div>
                            <div className="text-xs text-gray-500">{new Date(entry.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingEntry(entry);
                              setFormData({
                                date: entry.date,
                                issue: entry.issue,
                                workDoneDetails: entry.workDoneDetails,
                                doneBy: entry.doneBy,
                                amount: entry.amount.toString(),
                                category: entry.category
                              });
                              setShowAddModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 cursor-pointer w-6 h-6 flex items-center justify-center"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-red-600 hover:text-red-900 cursor-pointer w-6 h-6 flex items-center justify-center"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredEntries.length === 0 && (
              <div className="text-center py-12">
                <i className="ri-tools-line w-12 h-12 flex items-center justify-center text-gray-400 mx-auto mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance entries found</h3>
                <p className="text-gray-500">No maintenance activities recorded for the selected period and category.</p>
              </div>
            )}
          </div>
        )}

        {/* Category Management Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Manage Categories</h2>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Add New Category</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter category name..."
                    maxLength={50}
                  />
                  <button
                    onClick={editingCategory ? () => handleEditCategory(editingCategory) : handleAddCategory}
                    className={`px-4 py-2 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap ${
                      editingCategory
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {editingCategory ? 'Update' : 'Add'}
                  </button>
                  {editingCategory && (
                    <button
                      onClick={() => {
                        setEditingCategory(null);
                        setNewCategoryName('');
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200 cursor-pointer whitespace-nowrap"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Existing Categories ({categories.length})</h3>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <div key={category} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                        <i className={`${getCategoryIcon(category)} w-4 h-4 flex items-center justify-center text-gray-500`}></i>
                        <span className="font-medium text-gray-900 capitalize">{category}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCategory(category);
                            setNewCategoryName(category);
                          }}
                          className="text-blue-600 hover:text-blue-900 cursor-pointer w-6 h-6 flex items-center justify-center"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category)}
                          className="text-red-600 hover:text-red-900 cursor-pointer w-6 h-6 flex items-center justify-center"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                    setNewCategoryName('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200 cursor-pointer whitespace-nowrap"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Entry Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingEntry ? 'Edit Maintenance Entry' : 'Add New Maintenance Entry'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issue *</label>
                  <input
                    type="text"
                    value={formData.issue}
                    onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the maintenance issue..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Done Details *</label>
                  <textarea
                    value={formData.workDoneDetails}
                    onChange={(e) => setFormData({ ...formData, workDoneDetails: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the work performed..."
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.workDoneDetails.length}/500 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Done By *</label>
                  <input
                    type="text"
                    value={formData.doneBy}
                    onChange={(e) => setFormData({ ...formData, doneBy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Person/Company who did the work"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cost of maintenance"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingEntry(null);
                    setFormData({
                      date: new Date().toISOString().split('T')[0],
                      issue: '',
                      workDoneDetails: '',
                      doneBy: '',
                      amount: '',
                      category: 'others'
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200 cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={editingEntry ? handleEditEntry : handleAddEntry}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap"
                >
                  {editingEntry ? 'Update' : 'Add'} Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
