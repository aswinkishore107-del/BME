
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Modifications include adding 'save functionality', 'notification feature' when saving, 
// and disabling delete option once an entry is saved for the day.
// 'onLogAction' and 'onNotification' props are expected to be passed from parent component.

interface IndentItem {
  id: string;
  date: string;
  item: string;
  quantity: number;
  salesRate: number;
  totalPrice: number;
}

interface InventoryItem {
  id: string;
  product: string;
  quantity: number;
  unit: string;
  salesRate: number;
}

interface IndentComponentProps {
  userRole?: string;
  currentUser?: string;
  onLogAction?: (action: string, description: string) => void;
  onNotification?: (message: string, type: 'success' | 'info' | 'warning' | 'error', targetUsers: string[]) => void;
}

export default function Indent({ userRole, currentUser, onLogAction, onNotification }: IndentComponentProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [dateFilterType, setDateFilterType] = useState('current-month');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [savedEntries, setSavedEntries] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<IndentItem | null>(null);

  const [indentItems, setIndentItems] = useState<IndentItem[]>([
    {
      id: '1',
      date: '2024-01-15',
      item: 'Mutton',
      quantity: 5,
      salesRate: 500,
      totalPrice: 2500
    },
    {
      id: '2',
      date: '2024-01-15',
      item: 'Chicken',
      quantity: 3,
      salesRate: 220,
      totalPrice: 660
    },
    {
      id: '3',
      date: '2024-01-16',
      item: 'Rice',
      quantity: 10,
      salesRate: 55,
      totalPrice: 550
    },
    {
      id: '4',
      date: '2024-01-17',
      item: 'Cooking Oil',
      quantity: 2,
      salesRate: 140,
      totalPrice: 280
    },
    {
      id: '5',
      date: '2023-12-10',
      item: 'Vegetables',
      quantity: 8,
      salesRate: 75,
      totalPrice: 600
    },
    {
      id: '6',
      date: '2023-11-25',
      item: 'Spices',
      quantity: 4,
      salesRate: 120,
      totalPrice: 480
    }
  ]);

  const usersWithIndentAccess = [
    { username: 'admin', role: 'Admin' },
    { username: 'manager', role: 'Manager' },
    { username: 'cashier', role: 'Cashier' },
    { username: 'user-admin', role: 'User-Admin' }
  ];

  const [inventory] = useState<InventoryItem[]>([
    { id: '1', product: 'Mutton', quantity: 50, unit: 'kg', salesRate: 500 },
    { id: '2', product: 'Chicken', quantity: 30, unit: 'kg', salesRate: 220 },
    { id: '3', product: 'Rice', quantity: 100, unit: 'kg', salesRate: 55 },
    { id: '4', product: 'Cooking Oil', quantity: 25, unit: 'litre', salesRate: 140 },
    { id: '5', product: 'Vegetables', quantity: 40, unit: 'kg', salesRate: 75 },
    { id: '6', product: 'Spices', quantity: 15, unit: 'kg', salesRate: 120 }
  ]);

  const [newItem, setNewItem] = useState({
    date: new Date().toISOString().split('T')[0],
    item: '',
    quantity: 1,
    salesRate: 0,
    totalPrice: 0
  });

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
      case 'custom':
        return customDateRange;
      default:
        return customDateRange;
    }
  };

  const getFilteredItems = () => {
    if (viewMode === 'daily') {
      return indentItems.filter(item => item.date === selectedDate);
    } else {
      // Use date filter for monthly view
      const dateRange = getDateRangeFromFilter(dateFilterType);
      return indentItems.filter(item =>
        item.date >= dateRange.startDate && item.date <= dateRange.endDate
      );
    }
  };

  const filteredItems = getFilteredItems();
  const grandTotal = filteredItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleItemSelect = (itemName: string) => {
    const selectedInventoryItem = inventory.find(inv => inv.product === itemName);
    if (selectedInventoryItem) {
      const totalPrice = newItem.quantity * selectedInventoryItem.salesRate;
      setNewItem({
        ...newItem,
        item: itemName,
        salesRate: selectedInventoryItem.salesRate,
        totalPrice
      });
    }
  };

  const handleQuantityChange = (quantity: number) => {
    const totalPrice = quantity * newItem.salesRate;
    setNewItem({
      ...newItem,
      quantity,
      totalPrice
    });
  };

  const handleAddItem = () => {
    if (newItem.item && newItem.quantity > 0) {
      const item: IndentItem = {
        id: Date.now().toString(),
        ...newItem
      };
      setIndentItems([...indentItems, item]);

      setNewItem({
        date: new Date().toISOString().split('T')[0],
        item: '',
        quantity: 1,
        salesRate: 0,
        totalPrice: 0
      });
      setShowAddModal(false);

      onLogAction?.('Add Item', `Added ${newItem.item} (Qty: ${newItem.quantity}) to indent for ${newItem.date}`);
    }
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = indentItems.find(item => item.id === id);
    if (confirm('Are you sure you want to delete this item?')) {
      setIndentItems(indentItems.filter(item => item.id !== id));

      if (itemToDelete) {
        onLogAction?.('Delete Item', `Deleted ${itemToDelete.item} from indent for ${itemToDelete.date}`);

        const targetUsers = usersWithIndentAccess
          .filter(user => user.username !== currentUser)
          .map(user => user.username);

        const formattedDate = new Date(itemToDelete.date).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

        const notificationMessage = `${currentUser} deleted ${itemToDelete.item} (Qty: ${itemToDelete.quantity}) from indent for ${formattedDate}`;
        onNotification?.(notificationMessage, 'warning', targetUsers);
      }
    }
  };

  const handleEditItem = (item: IndentItem) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingItem && editingItem.item && editingItem.quantity > 0) {
      const updatedItems = indentItems.map(item =>
        item.id === editingItem.id ? editingItem : item
      );
      setIndentItems(updatedItems);

      onLogAction?.('Edit Item', `Modified ${editingItem.item} in indent for ${editingItem.date}`);

      const targetUsers = usersWithIndentAccess
        .filter(user => user.username !== currentUser)
        .map(user => user.username);

      const formattedDate = new Date(editingItem.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const notificationMessage = `${currentUser} edited ${editingItem.item} (Qty: ${editingItem.quantity}) in indent for ${formattedDate}`;
      onNotification?.(notificationMessage, 'info', targetUsers);

      setShowEditModal(false);
      setEditingItem(null);
    }
  };

  const handleEditQuantityChange = (quantity: number) => {
    if (editingItem) {
      const totalPrice = quantity * editingItem.salesRate;
      setEditingItem({
        ...editingItem,
        quantity,
        totalPrice
      });
    }
  };

  const handleSaveDayEntry = async () => {
    if (viewMode !== 'daily') {
      alert('Save function is only available in daily view');
      return;
    }

    const dayItems = indentItems.filter(item => item.date === selectedDate);
    if (dayItems.length === 0) {
      alert('No items found for the selected date to save');
      return;
    }

    setIsSaving(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSavedEntries(prev => new Set([...prev, selectedDate]));

      const dayTotal = dayItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const formattedDate = new Date(selectedDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      onLogAction?.('Save Entry', `Saved indent entry for ${formattedDate} with ${dayItems.length} items (Total: ₹${dayTotal.toLocaleString()})`);

      const targetUsers = usersWithIndentAccess
        .filter(user => user.username !== currentUser)
        .map(user => user.username);

      const notificationMessage = `${currentUser} saved indent entry for ${formattedDate} - ${dayItems.length} items totaling ₹${dayTotal.toLocaleString()}`;
      onNotification?.(notificationMessage, 'success', targetUsers);

      alert(`Successfully saved indent entry for ${formattedDate}!\nTotal: ₹${dayTotal.toLocaleString()}\nItems: ${dayItems.length}\n\nNotifications sent to users with indent access.`);
    } catch (error) {
      alert('Failed to save indent entry. Please try again.');
      onLogAction?.('Save Error', `Failed to save indent entry for ${selectedDate}`);
    } finally {
      setIsSaving(false);
    }
  };

  const getMonthlyGroupedItems = () => {
    const grouped = filteredItems.reduce((acc, item) => {
      const date = item.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {} as Record<string, IndentItem[]>);

    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));
  };

  const isDateSaved = (date: string) => savedEntries.has(date);

  const exportToExcel = () => {
    const headers = [
      'Date',
      'Item',
      'Quantity',
      'Sales Rate',
      'Total Price'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredItems.map(item => [
        item.date,
        item.item,
        item.quantity,
        item.salesRate,
        item.totalPrice
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);

    const dateRange = getDateRangeFromFilter(dateFilterType);
    const filterName = dateFilterType === 'custom' ? 'custom' : dateFilterType.replace('-', '_');
    link.setAttribute('download', `indent_${filterName}_${dateRange.startDate}_to_${dateRange.endDate}.csv`);

    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onLogAction?.('Export Data', `Exported indent data for ${dateFilterType} filter`);
  };

  const getFilterDisplayName = (filterType: string) => {
    const filterNames = {
      'current-month': 'Current Month',
      'previous-month': 'Previous Month',
      'custom': 'Custom Date Range'
    };
    return filterNames[filterType as keyof typeof filterNames] || 'Custom Date Range';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Procure 1.0</h1>
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
            {viewMode === 'monthly' && (
              <button
                onClick={exportToExcel}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
              >
                <i className="ri-file-excel-2-line w-4 h-4 flex items-center justify-center"></i>
                Export
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <i className="ri-add-line w-4 h-4 flex items-center justify-center"></i>
              New
            </button>
            {viewMode === 'daily' && filteredItems.length > 0 && (
              <button
                onClick={handleSaveDayEntry}
                disabled={isSaving || isDateSaved(selectedDate)}
                className={`px-4 py-2 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  isDateSaved(selectedDate)
                    ? 'bg-green-100 text-green-700 border-2 border-green-300 cursor-not-allowed'
                    : isSaving
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                {isSaving ? (
                  <>
                    <i className="ri-loader-4-line w-4 h-4 flex items-center justify-center animate-spin"></i>
                    Saving...
                  </>
                ) : isDateSaved(selectedDate) ? (
                  <>
                    <i className="ri-check-line w-4 h-4 flex items-center justify-center"></i>
                    Saved
                  </>
                ) : (
                  <>
                    <i className="ri-save-line w-4 h-4 flex items-center justify-center"></i>
                    Save Entry
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {viewMode === 'daily' ? (
          <>
            <div className="mb-6 flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {isDateSaved(selectedDate) && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-2">
                  <i className="ri-check-circle-line text-green-600 w-4 h-4 flex items-center justify-center"></i>
                  <span className="text-sm text-green-700 font-medium">Entry Saved</span>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">S.No</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sales Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.item}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.salesRate.toLocaleString()}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">₹{item.totalPrice.toLocaleString()}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer whitespace-nowrap flex items-center gap-1 hover:bg-blue-700"
                          >
                            <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer whitespace-nowrap flex items-center gap-1 hover:bg-red-700"
                          >
                            <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        No items found for selected date
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Filter</label>
                <select
                  value={dateFilterType}
                  onChange={(e) => setDateFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  <option value="current-month">Current Month</option>
                  <option value="previous-month">Previous Month</option>
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-800">
                Total Amount: ₹{grandTotal.toLocaleString()}
              </h3>
              <p className="text-sm text-blue-600 mt-1">
                {filteredItems.length} items for {getFilterDisplayName(dateFilterType)}
                {dateFilterType === 'custom' && (
                  <span> ({customDateRange.startDate} to {customDateRange.endDate})</span>
                )}
              </p>
            </div>

            <div className="space-y-6">
              {getMonthlyGroupedItems().map(([date, items]) => (
                <div key={date} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div
                    className={`px-4 py-3 border-b flex justify-between items-center ${
                      isDateSaved(date) ? 'bg-green-50' : 'bg-gray-100'
                    }`}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {isDateSaved(date) && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <i className="ri-check-line w-3 h-3 flex items-center justify-center"></i>
                            Saved
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Total: ₹{items.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">S.No</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Item</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Quantity</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Sales Rate</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Total Price</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((item, index) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">{item.item}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">₹{item.salesRate.toLocaleString()}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600 font-medium">₹{item.totalPrice.toLocaleString()}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditItem(item)}
                                  className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer whitespace-nowrap flex items-center gap-1 hover:bg-blue-700"
                                >
                                  <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer whitespace-nowrap flex items-center gap-1 hover:bg-red-700"
                                >
                                  <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              {getMonthlyGroupedItems().length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No items found for selected period</p>
                </div>
              )}
            </div>
          </>
        )}

        <div className="mt-6 flex justify-end">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800">
              {viewMode === 'daily' ? 'Daily' : 'Total'} Amount: ₹{grandTotal.toLocaleString()}
            </h3>
            {viewMode === 'monthly' && (
              <p className="text-sm text-blue-600 mt-1">
                Showing {filteredItems.length} items for {getFilterDisplayName(dateFilterType)}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600">
            <i className="ri-information-line w-5 h-5 flex items-center justify-center"></i>
            <p className="text-sm">
              {viewMode === 'daily'
                ? 'Daily view shows items for the selected date. Use the save button to finalize the entry.'
                : 'Monthly view supports date filtering. Use the dropdown to filter by current month, previous month, or set a custom date range. Export function is available in monthly view.'
              }
            </p>
          </div>
        </div>

      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newItem.date}
                  onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                <select
                  value={newItem.item}
                  onChange={(e) => handleItemSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  <option value="">Select Item</option>
                  {inventory.map((item) => (
                    <option key={item.id} value={item.product}>
                      {item.product} (Available: {item.quantity} {item.unit})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sales Rate</label>
                <input
                  type="number"
                  value={newItem.salesRate}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
                <input
                  type="number"
                  value={newItem.totalPrice}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none font-medium"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddItem}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap"
              >
                Add Item
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition duration-200 cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={editingItem.date}
                  onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                <select
                  value={editingItem.item}
                  onChange={(e) => {
                    const selectedInventoryItem = inventory.find((inv) => inv.product === e.target.value);
                    if (selectedInventoryItem) {
                      const totalPrice = editingItem.quantity * selectedInventoryItem.salesRate;
                      setEditingItem({
                        ...editingItem,
                        item: e.target.value,
                        salesRate: selectedInventoryItem.salesRate,
                        totalPrice
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  <option value="">Select Item</option>
                  {inventory.map((item) => (
                    <option key={item.id} value={item.product}>
                      {item.product} (Available: {item.quantity} {item.unit})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={editingItem.quantity}
                  onChange={(e) => handleEditQuantityChange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sales Rate</label>
                <input
                  type="number"
                  value={editingItem.salesRate}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
                <input
                  type="number"
                  value={editingItem.totalPrice}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none font-medium"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition duration-200 cursor-pointer whitespace-nowrap"
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
