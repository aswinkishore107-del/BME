
'use client';

import { useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  particulars: string;
  debit: number;
  credit: number;
  closingBalance: number;
  category: string;
}

interface Category {
  id: string;
  name: string;
}

interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  ifsc: string;
  branch: string;
  accountNumber: string;
  openingBalance: number;
  balance: number;
  transactions: Transaction[];
}

interface TransactionModalProps {
  account: BankAccount;
  onClose: () => void;
  onAddTransaction: (accountId: string, transaction: Omit<Transaction, 'id' | 'closingBalance'>) => void;
  categories: Category[];
  onAddCategory: (name: string) => void;
  onEditCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
}

interface AddAccountModalProps {
  onSave: (account: Omit<BankAccount, 'id' | 'balance' | 'transactions'>) => void;
  onClose: () => void;
}

interface EditAccountModalProps {
  account: BankAccount;
  onSave: (account: BankAccount) => void;
  onClose: () => void;
}

interface BankAccountsProps {
  userRole: string;
  currentUser: string;
  onLogAction: (action: string, details: string) => void;
}

interface CategoryManagementModalProps {
  categories: Category[];
  onAddCategory: (name: string) => void;
  onEditCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
  onClose: () => void;
}

function CategoryManagementModal({ categories, onAddCategory, onEditCategory, onDeleteCategory, onClose }: CategoryManagementModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowAddForm(false);
    }
  };

  const handleEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory && newCategoryName.trim()) {
      onEditCategory(editingCategory.id, newCategoryName.trim());
      setEditingCategory(null);
      setNewCategoryName('');
    }
  };

  const handleDeleteCategory = (category: Category) => {
    if (confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      onDeleteCategory(category.id);
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setNewCategoryName('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Manage Transaction Categories</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
          </button>
        </div>

        {/* Add Category Form */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Categories ({categories.length})</h3>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditingCategory(null);
                setNewCategoryName('');
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <i className="ri-add-line w-4 h-4 flex items-center justify-center"></i>
              Add Category
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddCategory} className="p-4 bg-blue-50 rounded-lg mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={50}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewCategoryName('');
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200 cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {editingCategory && (
            <form onSubmit={handleEditCategory} className="p-4 bg-green-50 rounded-lg mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  maxLength={50}
                  required
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer whitespace-nowrap"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200 cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Categories List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                editingCategory?.id === category.id ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 font-mono">#{index + 1}</span>
                <span className="font-medium text-gray-900">{category.name}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(category)}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer p-1"
                  title="Edit category"
                >
                  <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                </button>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="text-red-600 hover:text-red-800 cursor-pointer p-1"
                  title="Delete category"
                >
                  <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <i className="ri-folder-add-line text-4xl mb-2 w-16 h-16 flex items-center justify-center mx-auto"></i>
            <p>No categories yet. Add your first category above.</p>
          </div>
        )}

        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200 cursor-pointer whitespace-nowrap"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryManagement({ categories, onAddCategory, onEditCategory, onDeleteCategory }: {
  categories: Category[];
  onAddCategory: (name: string) => void;
  onEditCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
}) {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowCategoryModal(false);
    }
  };

  const handleEditCategory = () => {
    if (editingCategory && newCategoryName.trim()) {
      onEditCategory(editingCategory.id, newCategoryName.trim());
      setEditingCategory(null);
      setNewCategoryName('');
    }
  };

  const handleDeleteCategory = (category: Category) => {
    if (confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      onDeleteCategory(category.id);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-medium">Manage Categories</h4>
        <button
          onClick={() => {
            setShowCategoryModal(true);
            setEditingCategory(null);
            setNewCategoryName('');
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap"
        >
          Add Category
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center bg-gray-100 rounded px-3 py-1">
            <span className="text-sm">{category.name}</span>
            <button
              onClick={() => {
                setEditingCategory(category);
                setNewCategoryName(category.name);
                setShowCategoryModal(true);
              }}
              className="ml-2 text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              <i className="ri-edit-line w-3 h-3 flex items-center justify-center"></i>
            </button>
            <button
              onClick={() => handleDeleteCategory(category)}
              className="ml-1 text-red-600 hover:text-red-800 cursor-pointer"
            >
              <i className="ri-close-line w-3 h-3 flex items-center justify-center"></i>
            </button>
          </div>
        ))}
      </div>

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={editingCategory ? handleEditCategory : handleAddCategory}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap"
              >
                {editingCategory ? 'Update' : 'Add'}
              </button>
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCategory(null);
                  setNewCategoryName('');
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

function AddAccountModal({ onSave, onClose }: AddAccountModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    bankName: '',
    ifsc: '',
    branch: '',
    accountNumber: '',
    openingBalance: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.bankName.trim()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Bank Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
              <input
                type="text"
                value={formData.ifsc}
                onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ABCD0123456"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance</label>
              <input
                type="number"
                value={formData.openingBalance}
                onChange={(e) => setFormData({ ...formData, openingBalance: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.01"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap"
            >
              Add Account
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

function EditAccountModal({ account, onSave, onClose }: EditAccountModalProps) {
  const [formData, setFormData] = useState({
    name: account.name,
    bankName: account.bankName,
    ifsc: account.ifsc,
    branch: account.branch,
    accountNumber: account.accountNumber,
    openingBalance: account.openingBalance
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.bankName.trim()) {
      // Recalculate balance with new opening balance
      const transactionEffect = account.transactions.reduce((sum, transaction) => sum + transaction.credit - transaction.debit, 0);
      const newBalance = formData.openingBalance + transactionEffect;

      onSave({
        ...account,
        ...formData,
        balance: newBalance
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Bank Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
              <input
                type="text"
                value={formData.ifsc}
                onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ABCD0123456"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance</label>
              <input
                type="number"
                value={formData.openingBalance}
                onChange={(e) => setFormData({ ...formData, openingBalance: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.01"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap"
            >
              Update Account
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

function TransactionModal({ account, onClose, onAddTransaction, categories, onAddCategory, onEditCategory, onDeleteCategory }: TransactionModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [dateFilter, setDateFilter] = useState('current-month');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    particulars: '',
    debit: 0,
    credit: 0,
    category: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.particulars.trim() && (formData.debit > 0 || formData.credit > 0)) {
      onAddTransaction(account.id, formData);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        particulars: '',
        debit: 0,
        credit: 0,
        category: ''
      });
      setShowAddForm(false);
    }
  };

  const getDateRange = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    switch (dateFilter) {
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
      case 'last-6-months':
        return {
          start: new Date(currentYear, currentMonth - 5, 1).toISOString().split('T')[0],
          end: new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0]
        };
      case 'current-financial-year':
        // Financial year: April to March
        const fyStart = currentMonth >= 3 ? currentYear : currentYear - 1;
        return {
          start: new Date(fyStart, 3, 1).toISOString().split('T')[0], // April 1st
          end: new Date(fyStart + 1, 2, 31).toISOString().split('T')[0] // March 31st
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

  const getFilteredTransactions = () => {
    const { start, end } = getDateRange();
    return account.transactions.filter(transaction => transaction.date >= start && transaction.date <= end);
  };

  const getOpeningBalanceForPeriod = () => {
    const { start } = getDateRange();
    const transactionsBeforePeriod = account.transactions.filter(transaction => transaction.date < start);

    const balanceFromTransactions = transactionsBeforePeriod.reduce((sum, transaction) => sum + transaction.credit - transaction.debit, 0);

    return account.openingBalance + balanceFromTransactions;
  };

  const filteredTransactions = getFilteredTransactions();
  const totalDebit = filteredTransactions.reduce((sum, transaction) => sum + transaction.debit, 0);
  const totalCredit = filteredTransactions.reduce((sum, transaction) => sum + transaction.credit, 0);
  const totalDebitTransactions = filteredTransactions.filter(t => t.debit > 0).length;
  const totalCreditTransactions = filteredTransactions.filter(t => t.credit > 0).length;
  const openingBalanceForPeriod = getOpeningBalanceForPeriod();
  const closingBalanceForPeriod = openingBalanceForPeriod + totalCredit - totalDebit;

  const exportTransactions = () => {
    const headers = ['Date', 'Particulars', 'Debit', 'Credit', 'Closing Balance', 'Category'];

    // Transaction data
    const transactionRows = filteredTransactions.map(transaction => [
      transaction.date,
      transaction.particulars,
      transaction.debit,
      transaction.credit,
      transaction.closingBalance,
      transaction.category || ''
    ]);

    // Summary rows
    const summaryRows = [
      ['', '', '', '', '', ''],
      ['SUMMARY', '', '', '', '', ''],
      ['Total Debit Amount', '', totalDebit, '', '', ''],
      ['Total Credit Amount', '', '', totalCredit, '', ''],
      ['Total Debit Transactions', '', totalDebitTransactions, '', '', ''],
      ['Total Credit Transactions', '', totalCreditTransactions, '', '', ''],
      ['Opening Balance', '', '', '', openingBalanceForPeriod, ''],
      ['Closing Balance', '', '', '', closingBalanceForPeriod, ''],
      ['Net Change', '', '', '', (totalCredit - totalDebit), '']
    ];

    const csvContent = [
      headers.join(','),
      ...transactionRows.map(row => row.join(',')),
      ...summaryRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bank_${account.name}_${dateFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filterOptions = [
    { id: 'current-month', label: 'Current Month' },
    { id: 'previous-month', label: 'Previous Month' },
    { id: 'last-3-months', label: 'Last 3 Months' },
    { id: 'last-6-months', label: 'Last 6 Months' },
    { id: 'current-financial-year', label: 'Current Financial Year' },
    { id: 'previous-financial-year', label: 'Previous Financial Year' },
    { id: 'custom', label: 'Custom Date Range' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">Bank Account {account.name} - Transactions</h2>
            <div className="text-sm text-gray-600 mt-1">
              <p>{account.bankName} • {account.branch}</p>
              <p>A/c: {account.accountNumber} • IFSC: {account.ifsc}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportTransactions}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <i className="ri-file-excel-2-line w-4 h-4 flex items-center justify-center"></i>
              Export
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <i className="ri-add-line w-4 h-4 flex items-center justify-center"></i>
              Add Transaction
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <i className="ri-close-line w-4 h-4 flex items-center justify-center"></i>
              Close
            </button>
          </div>
        </div>

        {/* Category Management */}
        <CategoryManagement
          categories={categories}
          onAddCategory={onAddCategory}
          onEditCategory={onEditCategory}
          onDeleteCategory={onDeleteCategory}
        />

        {/* Date Filter Controls */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setDateFilter(option.id)}
                className={`px-4 py-2 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap ${dateFilter === option.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {dateFilter === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
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

        {/* Enhanced Balance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-purple-800">Opening Balance</h3>
            <p className="text-2xl font-bold text-purple-900">₹{openingBalanceForPeriod.toLocaleString()}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-red-800">Total Debit</h3>
            <p className="text-2xl font-bold text-red-900">₹{totalDebit.toLocaleString()}</p>
            <p className="text-sm text-red-600">{totalDebitTransactions} transactions</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-green-800">Total Credit</h3>
            <p className="text-2xl font-bold text-green-900">₹{totalCredit.toLocaleString()}</p>
            <p className="text-sm text-green-600">{totalCreditTransactions} transactions</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-800">Closing Balance</h3>
            <p className="text-2xl font-bold text-blue-900">₹{closingBalanceForPeriod.toLocaleString()}</p>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-4">Add New Transaction</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                  placeholder="Transaction description"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Debit</label>
                <input
                  type="number"
                  value={formData.debit}
                  onChange={(e) => setFormData({ ...formData, debit: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credit</label>
                <input
                  type="number"
                  value={formData.credit}
                  onChange={(e) => setFormData({ ...formData, credit: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-5 flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap"
                >
                  Add Transaction
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200 cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-purple-800">
                Filtered Results: {filteredTransactions.length} transactions
              </h3>
              <p className="text-sm text-purple-600">
                Period: {dateFilter === 'custom' ? `${customDateRange.startDate} to ${customDateRange.endDate}` : filterOptions.find(f => f.id === dateFilter)?.label}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-600">Net Change</p>
              <p className="text-xl font-bold text-purple-900">
                ₹{(totalCredit - totalDebit).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Particulars</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Debit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Credit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Closing Balance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{transaction.particulars}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600">
                    {transaction.debit > 0 ? `₹${transaction.debit.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600">
                    {transaction.credit > 0 ? `₹${transaction.credit.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                    ₹{transaction.closingBalance.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.category && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {transaction.category}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <i className="ri-database-line text-4xl mb-2 w-16 h-16 flex items-center justify-center mx-auto"></i>
            <p>No transactions found for the selected period</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BankAccounts({ userRole, currentUser, onLogAction }: BankAccountsProps) {
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Sales' },
    { id: '2', name: 'Expenses' },
    { id: '3', name: 'Loans' },
    { id: '4', name: 'Investments' },
    { id: '5', name: 'Utilities' },
    { id: '6', name: 'Rent' },
    { id: '7', name: 'Salary' },
    { id: '8', name: 'Other' }
  ]);

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: 'S',
      name: 'S',
      bankName: 'State Bank of India',
      ifsc: 'SBIN0123456',
      branch: 'Main Branch',
      accountNumber: '12345678901',
      openingBalance: 100000,
      balance: 125000,
      transactions: [
        {
          id: '1',
          date: '2024-01-15',
          particulars: 'Opening Balance',
          debit: 0,
          credit: 100000,
          closingBalance: 100000,
          category: 'Other'
        },
        {
          id: '2',
          date: '2024-01-16',
          particulars: 'Sales Deposit',
          debit: 0,
          credit: 50000,
          closingBalance: 150000,
          category: 'Sales'
        },
        {
          id: '3',
          date: '2024-01-17',
          particulars: 'Supplier Payment',
          debit: 25000,
          credit: 0,
          closingBalance: 125000,
          category: 'Expenses'
        }
      ]
    },
    {
      id: 'V',
      name: 'V',
      bankName: 'HDFC Bank',
      ifsc: 'HDFC0123456',
      branch: 'Commercial Street',
      accountNumber: '98765432109',
      openingBalance: 75000,
      balance: 87500,
      transactions: [
        {
          id: '1',
          date: '2024-01-15',
          particulars: 'Opening Balance',
          debit: 0,
          credit: 75000,
          closingBalance: 75000,
          category: 'Other'
        },
        {
          id: '2',
          date: '2024-01-16',
          particulars: 'Interest Received',
          debit: 0,
          credit: 12500,
          closingBalance: 87500,
          category: 'Investments'
        }
      ]
    },
    {
      id: 'H',
      name: 'H',
      bankName: 'ICICI Bank',
      ifsc: 'ICIC0123456',
      branch: 'Business Park',
      accountNumber: '11223344556',
      openingBalance: 50000,
      balance: 62750,
      transactions: [
        {
          id: '1',
          date: '2024-01-15',
          particulars: 'Opening Balance',
          debit: 0,
          credit: 50000,
          closingBalance: 50000,
          category: 'Other'
        },
        {
          id: '2',
          date: '2024-01-16',
          particulars: 'Cash Deposit',
          debit: 0,
          credit: 25000,
          closingBalance: 75000,
          category: 'Sales'
        },
        {
          id: '3',
          date: '2024-01-17',
          particulars: 'Withdrawal',
          debit: 12250,
          credit: 0,
          closingBalance: 62750,
          category: 'Expenses'
        }
      ]
    }
  ]);

  const totalBankBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);

  const handleAccountClick = (account: BankAccount) => {
    setSelectedAccount(account);
    onLogAction('View Bank Account', `Accessed Bank Account ${account.name} (${account.bankName}) transactions`);
  };

  const handleAddAccount = (newAccount: Omit<BankAccount, 'id' | 'balance' | 'transactions'>) => {
    const account: BankAccount = {
      ...newAccount,
      id: Date.now().toString(),
      balance: newAccount.openingBalance,
      transactions: []
    };

    // Add opening balance transaction if opening balance > 0
    if (newAccount.openingBalance > 0) {
      account.transactions = [{
        id: '1',
        date: new Date().toISOString().split('T')[0],
        particulars: 'Opening Balance',
        debit: 0,
        credit: newAccount.openingBalance,
        closingBalance: newAccount.openingBalance,
        category: 'Other'
      }];
    }

    setBankAccounts([...bankAccounts, account]);
    onLogAction('Add Bank Account', `Added new bank account: ${account.name} (${account.bankName})`);
  };

  const handleEditAccount = (updatedAccount: BankAccount) => {
    setBankAccounts(accounts => accounts.map(account => account.id === updatedAccount.id ? updatedAccount : account));
    setEditingAccount(null);
    onLogAction('Edit Bank Account', `Updated bank account: ${updatedAccount.name} (${updatedAccount.bankName})`);
  };

  const handleDeleteAccount = (accountId: string) => {
    const accountToDelete = bankAccounts.find(acc => acc.id === accountId);
    if (accountToDelete && confirm(`Are you sure you want to delete bank account "${accountToDelete.name}" (${accountToDelete.bankName})? This will permanently remove all transaction data.`)) {
      setBankAccounts(accounts => accounts.filter(account => account.id !== accountId));
      onLogAction('Delete Bank Account', `Deleted bank account: ${accountToDelete.name} (${accountToDelete.bankName})`);
    }
  };

  const handleAddTransaction = (accountId: string, transactionData: Omit<Transaction, 'id' | 'closingBalance'>) => {
    setBankAccounts(prevAccounts =>
      prevAccounts.map(account => {
        if (account.id === accountId) {
          const lastBalance = account.transactions.length > 0
            ? account.transactions[account.transactions.length - 1].closingBalance
            : account.openingBalance;

          const newClosingBalance = lastBalance + transactionData.credit - transactionData.debit;

          const newTransaction: Transaction = {
            ...transactionData,
            id: Date.now().toString(),
            closingBalance: newClosingBalance
          };

          const updatedAccount = {
            ...account,
            transactions: [...account.transactions, newTransaction],
            balance: newClosingBalance
          };

          onLogAction('Add Bank Transaction', `Added transaction to Bank Account ${account.name}: ${transactionData.particulars}`);

          return updatedAccount;
        }
        return account;
      })
    );
  };

  const handleAddCategory = (name: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: name
    };
    setCategories([...categories, newCategory]);
    onLogAction('Add Category', `Added new transaction category: ${name}`);
  };

  const handleEditCategory = (id: string, name: string) => {
    setCategories(categories.map(cat => cat.id === id ? { ...cat, name } : cat));
    onLogAction('Edit Category', `Updated transaction category to: ${name}`);
  };

  const handleDeleteCategory = (id: string) => {
    const categoryToDelete = categories.find(cat => cat.id === id);
    setCategories(categories.filter(cat => cat.id !== id));
    if (categoryToDelete) {
      onLogAction('Delete Category', `Deleted transaction category: ${categoryToDelete.name}`);
    }
  };

  const exportAllAccounts = () => {
    // Create workbook with multiple sheets
    const workbookData = [];

    // Summary sheet
    const summaryHeaders = ['Account', 'Bank Name', 'Opening Balance', 'Current Balance', 'Total Transactions'];
    const summaryData = bankAccounts.map(account => [
      account.name,
      account.bankName,
      account.openingBalance,
      account.balance,
      account.transactions.length
    ]);

    workbookData.push({
      sheetName: 'Summary',
      headers: summaryHeaders,
      data: summaryData
    });

    // Individual account sheets
    bankAccounts.forEach(account => {
      const headers = ['Date', 'Particulars', 'Debit', 'Credit', 'Closing Balance', 'Category'];

      const transactionData = account.transactions.map(transaction => [
        transaction.date,
        transaction.particulars,
        transaction.debit,
        transaction.credit,
        transaction.closingBalance,
        transaction.category || ''
      ]);

      // Calculate totals for this account
      const totalDebit = account.transactions.reduce((sum, t) => sum + t.debit, 0);
      const totalCredit = account.transactions.reduce((sum, t) => sum + t.credit, 0);
      const totalDebitTransactions = account.transactions.filter(t => t.debit > 0).length;
      const totalCreditTransactions = account.transactions.filter(t => t.credit > 0).length;

      // Add summary rows
      const summaryRows = [
        ['', '', '', '', '', ''],
        ['ACCOUNT SUMMARY', '', '', '', '', ''],
        ['Total Debit Amount', '', totalDebit, '', '', ''],
        ['Total Credit Amount', '', '', totalCredit, '', ''],
        ['Total Debit Transactions', '', totalDebitTransactions, '', '', ''],
        ['Total Credit Transactions', '', totalCreditTransactions, '', '', ''],
        ['Opening Balance', '', '', '', account.openingBalance, ''],
        ['Current Balance', '', '', '', account.balance, ''],
        ['Net Change', '', '', '', (account.balance - account.openingBalance), '']
      ];

      workbookData.push({
        sheetName: `Account_${account.name}`,
        headers: headers,
        data: [...transactionData, ...summaryRows]
      });
    });

    // Create CSV content for each sheet (simulating Excel workbook)
    let fullExport = '';
    workbookData.forEach((sheet, index) => {
      if (index > 0) fullExport += '\n\n';
      fullExport += `=== ${sheet.sheetName} ===\n`;
      fullExport += sheet.headers.join(',') + '\n';
      fullExport += sheet.data.map(row => row.join(',')).join('\n');
    });

    const blob = new Blob([fullExport], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `all_bank_accounts_workbook_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onLogAction('Export Data', 'Exported all bank accounts data as workbook with separate sheets');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Bank Accounts</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <i className="ri-folder-settings-line w-4 h-4 flex items-center justify-center"></i>
              Manage Categories
            </button>
            <button
              onClick={exportAllAccounts}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <i className="ri-file-excel-2-line w-4 h-4 flex items-center justify-center"></i>
              Export All
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <i className="ri-add-line w-4 h-4 flex items-center justify-center"></i>
              Add Account
            </button>
          </div>
        </div>

        {/* Categories Summary */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-purple-800">Transaction Categories</h3>
              <p className="text-sm text-purple-600">{categories.length} categories available for transactions</p>
            </div>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition duration-200 cursor-pointer whitespace-nowrap"
            >
              Manage
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {categories.slice(0, 8).map((category) => (
              <span
                key={category.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                {category.name}
              </span>
            ))}
            {categories.length > 8 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                +{categories.length - 8} more
              </span>
            )}
          </div>
        </div>

        {/* Total Bank Balance Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Total Bank Balance</h2>
            <p className="text-4xl font-bold text-blue-900">₹{totalBankBalance.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-2">{bankAccounts.length} Bank Accounts</p>
          </div>
        </div>

        {/* Bank Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bankAccounts.map((account) => (
            <div
              key={account.id}
              className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-200"
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-bank-line text-2xl text-blue-600 w-8 h-8 flex items-center justify-center"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Bank Account {account.name}</h3>
                <p className="text-lg font-medium text-gray-700 mb-1">{account.bankName}</p>
                <p className="text-sm text-gray-500 mb-2">{account.branch}</p>
                <p className="text-2xl font-bold text-blue-600">₹{account.balance.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">A/c: {account.accountNumber}</p>
                <p className="text-xs text-gray-500">IFSC: {account.ifsc}</p>
                <p className="text-sm text-gray-500 mt-2">{account.transactions.length} transactions</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleAccountClick(account)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                >
                  <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                  View Details
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingAccount(account)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Account Summary Section */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Account Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bankAccounts.map((account) => (
              <div key={account.id} className="p-3 bg-white rounded border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium">Account {account.name}</span>
                    <p className="text-sm text-gray-600">{account.bankName}</p>
                  </div>
                  <span className="text-blue-600 font-bold">₹{account.balance.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500">Opening: ₹{account.openingBalance.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Management Modal */}
      {showCategoryModal && (
        <CategoryManagementModal
          categories={categories}
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onClose={() => setShowCategoryModal(false)}
        />
      )}

      {/* Add Account Modal */}
      {showAddModal && (
        <AddAccountModal
          onSave={handleAddAccount}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Account Modal */}
      {editingAccount && (
        <EditAccountModal
          account={editingAccount}
          onSave={handleEditAccount}
          onClose={() => setEditingAccount(null)}
        />
      )}

      {/* Transaction Modal */}
      {selectedAccount && (
        <TransactionModal
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
          onAddTransaction={handleAddTransaction}
          categories={categories}
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}
    </div>
  );
}
