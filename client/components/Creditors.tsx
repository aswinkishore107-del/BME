
'use client';

import { useState } from 'react';
import FilterBar from './FilterBar';

interface Creditor {
  id: string;
  billDate: string;
  settledDate?: string;
  entityName: string;
  particulars: string;
  billAmount: number;
  paymentMethod1?: string;
  amount1?: number;
  paidBy1?: string;
  paymentMethod2?: string;
  amount2?: number;
  paidBy2?: string;
  status: 'pending' | 'settled';
  createdBy: string;
}

interface EditModalProps {
  creditor: Creditor;
  onSave: (creditor: Creditor) => void;
  onClose: () => void;
}

interface AddModalProps {
  onSave: (creditor: Omit<Creditor, 'id' | 'createdBy'>) => void;
  onClose: () => void;
}

interface EditSettledModalProps {
  creditor: Creditor;
  onSave: (creditor: Creditor) => void;
  onClose: () => void;
}

function AddModal({ onSave, onClose }: AddModalProps) {
  const [formData, setFormData] = useState({
    billDate: new Date().toISOString().split('T')[0],
    entityName: '',
    particulars: '',
    billAmount: 0,
    status: 'pending' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.entityName.trim() && formData.particulars.trim() && formData.billAmount > 0) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Creditor</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bill Date</label>
              <input
                type="date"
                value={formData.billDate}
                onChange={(e) => setFormData({ ...formData, billDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entity Name</label>
              <input
                type="text"
                value={formData.entityName}
                onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Particulars</label>
              <input
                type="text"
                value={formData.particulars}
                onChange={(e) => setFormData({ ...formData, particulars: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bill Amount</label>
              <input
                type="number"
                value={formData.billAmount}
                onChange={(e) => setFormData({ ...formData, billAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap"
            >
              Add Creditor
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

function EditModal({ creditor, onSave, onClose }: EditModalProps) {
  const [formData, setFormData] = useState({
    paymentMethod1: '',
    amount1: 0,
    paidBy1: '',
    paymentMethod2: '',
    amount2: 0,
    paidBy2: ''
  });

  const paymentMethods = ['Cash', 'UPI', 'Card', 'Cheque'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCreditor = {
      ...creditor,
      ...formData,
      status: 'settled' as const,
      settledDate: new Date().toISOString().split('T')[0]
    };
    onSave(updatedCreditor);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Payment</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method 1</label>
              <select
                value={formData.paymentMethod1}
                onChange={(e) => setFormData({ ...formData, paymentMethod1: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value="">Select Method</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount 1</label>
              <input
                type="number"
                value={formData.amount1}
                onChange={(e) => setFormData({ ...formData, amount1: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paid By 1</label>
              <input
                type="text"
                value={formData.paidBy1}
                onChange={(e) => setFormData({ ...formData, paidBy1: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method 2</label>
              <select
                value={formData.paymentMethod2}
                onChange={(e) => setFormData({ ...formData, paymentMethod2: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value="">Select Method</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount 2</label>
              <input
                type="number"
                value={formData.amount2}
                onChange={(e) => setFormData({ ...formData, amount2: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paid By 2</label>
              <input
                type="text"
                value={formData.paidBy2}
                onChange={(e) => setFormData({ ...formData, paidBy2: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap"
            >
              Save
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

function EditSettledModal({ creditor, onSave, onClose }: EditSettledModalProps) {
  const [formData, setFormData] = useState({
    billDate: creditor.billDate,
    settledDate: creditor.settledDate || '',
    entityName: creditor.entityName,
    particulars: creditor.particulars,
    billAmount: creditor.billAmount,
    paymentMethod1: creditor.paymentMethod1 || '',
    amount1: creditor.amount1 || 0,
    paidBy1: creditor.paidBy1 || '',
    paymentMethod2: creditor.paymentMethod2 || '',
    amount2: creditor.amount2 || 0,
    paidBy2: creditor.paidBy2 || ''
  });

  const paymentMethods = ['Cash', 'UPI', 'Card', 'Cheque'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCreditor = {
      ...creditor,
      ...formData
    };
    onSave(updatedCreditor);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Settled Creditor</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bill Date</label>
              <input
                type="date"
                value={formData.billDate}
                onChange={(e) => setFormData({ ...formData, billDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Settled Date</label>
              <input
                type="date"
                value={formData.settledDate}
                onChange={(e) => setFormData({ ...formData, settledDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entity Name</label>
              <input
                type="text"
                value={formData.entityName}
                onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Particulars</label>
              <input
                type="text"
                value={formData.particulars}
                onChange={(e) => setFormData({ ...formData, particulars: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bill Amount</label>
              <input
                type="number"
                value={formData.billAmount}
                onChange={(e) => setFormData({ ...formData, billAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method 1</label>
              <select
                value={formData.paymentMethod1}
                onChange={(e) => setFormData({ ...formData, paymentMethod1: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value="">Select Method</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount 1</label>
              <input
                type="number"
                value={formData.amount1}
                onChange={(e) => setFormData({ ...formData, amount1: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paid By 1</label>
              <input
                type="text"
                value={formData.paidBy1}
                onChange={(e) => setFormData({ ...formData, paidBy1: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method 2</label>
              <select
                value={formData.paymentMethod2}
                onChange={(e) => setFormData({ ...formData, paymentMethod2: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value="">Select Method</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount 2</label>
              <input
                type="number"
                value={formData.amount2}
                onChange={(e) => setFormData({ ...formData, amount2: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paid By 2</label>
              <input
                type="text"
                value={formData.paidBy2}
                onChange={(e) => setFormData({ ...formData, paidBy2: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap"
            >
              Save Changes
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

interface CreditorsProps {
  userRole: string;
  currentUser: string;
  onLogAction: (action: string, details: string) => void;
}

export default function Creditors({ userRole, currentUser, onLogAction }: CreditorsProps) {
  const [statusFilter, setStatusFilter] = useState('pending');
  const [dateFilter, setDateFilter] = useState('current-month');
  const [editingCreditor, setEditingCreditor] = useState<Creditor | null>(null);
  const [editingSettledCreditor, setEditingSettledCreditor] = useState<Creditor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [creditors, setCreditors] = useState<Creditor[]>([
    {
      id: '1',
      billDate: '2024-01-15',
      entityName: 'ABC Suppliers',
      particulars: 'Raw materials purchase',
      billAmount: 25000,
      status: 'pending',
      createdBy: 'admin'
    },
    {
      id: '2',
      billDate: '2024-01-10',
      settledDate: '2024-01-20',
      entityName: 'XYZ Traders',
      particulars: 'Equipment rental',
      billAmount: 15000,
      paymentMethod1: 'Cash',
      amount1: 10000,
      paidBy1: 'Manager',
      paymentMethod2: 'UPI',
      amount2: 5000,
      paidBy2: 'Admin',
      status: 'settled',
      createdBy: 'manager'
    }
  ]);

  const pendingCreditors = creditors.filter((c) => c.status === 'pending');
  const settledCreditors = creditors.filter((c) => c.status === 'settled');

  const totalPending = pendingCreditors.reduce((sum, c) => sum + c.billAmount, 0);
  const totalSettled = settledCreditors.reduce((sum, c) => sum + c.billAmount, 0);

  const handleAdd = (newCreditor: Omit<Creditor, 'id' | 'createdBy'>) => {
    if (userRole === 'User') {
      alert('Users cannot add creditors');
      return;
    }

    const creditor: Creditor = {
      ...newCreditor,
      id: Date.now().toString(),
      createdBy: currentUser
    };
    setCreditors([...creditors, creditor]);
    onLogAction('Add Creditor', `Added creditor: ${newCreditor.entityName} - ₹${newCreditor.billAmount}`);
  };

  const handleEdit = (creditor: Creditor) => {
    if (userRole === 'User') {
      alert('Users cannot modify creditors');
      return;
    }
    setEditingCreditor(creditor);
    onLogAction('Edit Creditor', `Started editing creditor: ${creditor.entityName}`);
  };

  const handleSave = (updatedCreditor: Creditor) => {
    setCreditors(creditors.map((c) => (c.id === updatedCreditor.id ? updatedCreditor : c)));
    onLogAction('Settle Creditor', `Settled creditor: ${updatedCreditor.entityName} - ₹${updatedCreditor.billAmount}`);
  };

  const handleEditSettled = (creditor: Creditor) => {
    if (userRole === 'User') {
      alert('Users cannot modify creditors');
      return;
    }
    setEditingSettledCreditor(creditor);
    onLogAction('Edit Settled Creditor', `Started editing settled creditor: ${creditor.entityName}`);
  };

  const handleSaveSettled = (updatedCreditor: Creditor) => {
    setCreditors(creditors.map((c) => (c.id === updatedCreditor.id ? updatedCreditor : c)));
    onLogAction('Update Settled Creditor', `Updated settled creditor: ${updatedCreditor.entityName} - ₹${updatedCreditor.billAmount}`);
  };

  const handleDelete = (id: string) => {
    if (userRole === 'Manager' || userRole === 'User') {
      alert(`${userRole}s cannot delete creditors`);
      return;
    }

    if (confirm('Are you sure you want to delete this creditor?')) {
      const creditor = creditors.find((c) => c.id === id);
      setCreditors(creditors.filter((c) => c.id !== id));
      onLogAction('Delete Creditor', `Deleted creditor: ${creditor?.entityName}`);
    }
  };

  const exportToExcel = () => {
    const currentData = statusFilter === 'pending' ? pendingCreditors : settledCreditors;

    let headers: string[];
    if (statusFilter === 'pending') {
      headers = ['S.No', 'Bill Date', 'Entity Name', 'Particulars', 'Bill Amount', 'Created By'];
    } else {
      headers = [
        'S.No',
        'Bill Date',
        'Settled Date',
        'Entity Name',
        'Particulars',
        'Payment 1',
        'Payment 2',
        'Total Amount',
        'Created By'
      ];
    }

    const csvContent = [
      headers.join(','),
      ...currentData.map((creditor, index) => {
        if (statusFilter === 'pending') {
          return [
            index + 1,
            creditor.billDate,
            creditor.entityName,
            creditor.particulars,
            creditor.billAmount,
            creditor.createdBy
          ].join(',');
        } else {
          const payment1 = creditor.paymentMethod1 ? `${creditor.paymentMethod1}: ₹${creditor.amount1}` : '';
          const payment2 = creditor.paymentMethod2 ? `${creditor.paymentMethod2}: ₹${creditor.amount2}` : '';
          return [
            index + 1,
            creditor.billDate,
            creditor.settledDate || '',
            creditor.entityName,
            creditor.particulars,
            payment1,
            payment2,
            creditor.billAmount,
            creditor.createdBy
          ].join(',');
        }
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `creditors_${statusFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onLogAction('Export Creditors', `Exported ${statusFilter} creditors data`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Creditors</h1>
          <div className="flex gap-2">
            <button
              onClick={exportToExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <i className="ri-file-excel-2-line w-4 h-4 flex items-center justify-center"></i>
              Export
            </button>
            {userRole !== 'User' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
              >
                <i className="ri-add-line w-4 h-4 flex items-center justify-center"></i>
                Add New Creditor
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap ${
                statusFilter === 'pending'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('settled')}
              className={`px-4 py-2 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap ${
                statusFilter === 'settled'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Settled
            </button>
          </div>
        </div>

        {statusFilter === 'pending' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-800">Total Pending Amount: ₹{totalPending.toLocaleString()}</h3>
          </div>
        )}

        {statusFilter === 'settled' && (
          <>
            <FilterBar filter={dateFilter} setFilter={setDateFilter} />
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-green-800">Total Settled Amount: ₹{totalSettled.toLocaleString()}</h3>
            </div>
          </>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">S.No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Bill Date</th>
                {statusFilter === 'settled' && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Settled Date</th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Entity Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Particulars</th>
                {statusFilter === 'pending' ? (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Bill Amount</th>
                ) : (
                  <>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment 1</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment 2</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total Amount</th>
                  </>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created By</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(statusFilter === 'pending' ? pendingCreditors : settledCreditors).map((creditor, index) => (
                <tr key={creditor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{creditor.billDate}</td>
                  {statusFilter === 'settled' && (
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{creditor.settledDate}</td>
                  )}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{creditor.entityName}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{creditor.particulars}</td>
                  {statusFilter === 'pending' ? (
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600 font-medium">₹{creditor.billAmount.toLocaleString()}</td>
                  ) : (
                    <>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {creditor.paymentMethod1 && `${creditor.paymentMethod1}: ₹${creditor.amount1?.toLocaleString()}`}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {creditor.paymentMethod2 && `${creditor.paymentMethod2}: ₹${creditor.amount2?.toLocaleString()}`}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">₹{creditor.billAmount.toLocaleString()}</td>
                    </>
                  )}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{creditor.createdBy}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      {statusFilter === 'pending' && userRole !== 'User' && (
                        <button
                          onClick={() => handleEdit(creditor)}
                          className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer whitespace-nowrap flex items-center gap-1"
                        >
                          <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                          Edit
                        </button>
                      )}
                      {statusFilter === 'settled' && userRole !== 'User' && (
                        <button
                          onClick={() => handleEditSettled(creditor)}
                          className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer whitespace-nowrap flex items-center gap-1"
                        >
                          <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                          Edit
                        </button>
                      )}
                      {userRole === 'Admin' && (
                        <button
                          onClick={() => handleDelete(creditor.id)}
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

      {showAddModal && (
        <AddModal
          onSave={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {editingCreditor && (
        <EditModal
          creditor={editingCreditor}
          onSave={handleSave}
          onClose={() => setEditingCreditor(null)}
        />
      )}

      {editingSettledCreditor && (
        <EditSettledModal
          creditor={editingSettledCreditor}
          onSave={handleSaveSettled}
          onClose={() => setEditingSettledCreditor(null)}
        />
      )}
    </div>
  );
}
