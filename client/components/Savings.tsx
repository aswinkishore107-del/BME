
'use client';

import { useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  particulars: string;
  debit: number;
  credit: number;
  closingBalance: number;
}

interface SavingsAccount {
  id: string;
  bankName: string;
  branch: string;
  accountNo: string;
  scheme: string;
  principal: number;
  interest: number;
  startDate: string;
  maturityDate: string;
  transactions: Transaction[];
}

interface AddModalProps {
  onSave: (account: Omit<SavingsAccount, 'id'>) => void;
  onClose: () => void;
}

interface TransactionModalProps {
  account: SavingsAccount;
  onClose: () => void;
  onAddTransaction: (accountId: string, transaction: Omit<Transaction, 'id' | 'closingBalance'>) => void;
}

function TransactionModal({ account, onClose, onAddTransaction }: TransactionModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    particulars: '',
    debit: 0,
    credit: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.particulars.trim() && (formData.debit > 0 || formData.credit > 0)) {
      onAddTransaction(account.id, formData);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        particulars: '',
        debit: 0,
        credit: 0
      });
      setShowAddForm(false);
    }
  };

  const exportTransactions = () => {
    const headers = ['Date', 'Particulars', 'Debit', 'Credit', 'Closing Balance'];
    
    const transactionRows = account.transactions.map(transaction => [
      transaction.date,
      transaction.particulars,
      transaction.debit,
      transaction.credit,
      transaction.closingBalance
    ]);

    const totalDebit = account.transactions.reduce((sum, t) => sum + t.debit, 0);
    const totalCredit = account.transactions.reduce((sum, t) => sum + t.credit, 0);

    const summaryRows = [
      ['', '', '', '', ''],
      ['SUMMARY', '', '', '', ''],
      ['Total Debit', '', totalDebit, '', ''],
      ['Total Credit', '', '', totalCredit, ''],
      ['Current Balance', '', '', '', account.transactions.length > 0 ? account.transactions[account.transactions.length - 1].closingBalance : account.principal]
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
    link.setAttribute('download', `savings_${account.accountNo}_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">Account Transactions - {account.accountNo}</h2>
            <div className="text-sm text-gray-600 mt-1">
              <p>{account.bankName} • {account.branch}</p>
              <p>{account.scheme}</p>
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

        {showAddForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-4">Add New Transaction</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div className="md:col-span-4 flex gap-2">
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

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Particulars</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Debit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Credit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {account.transactions.map((transaction) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {account.transactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <i className="ri-database-line text-4xl mb-2 w-16 h-16 flex items-center justify-center mx-auto"></i>
            <p>No transactions found for this account</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AddModal({ onSave, onClose }: AddModalProps) {
  const [formData, setFormData] = useState({
    bankName: '',
    branch: '',
    accountNo: '',
    scheme: '',
    principal: 0,
    interest: 0,
    startDate: '',
    maturityDate: '',
    transactions: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.bankName.trim() && formData.scheme.trim() && formData.accountNo.trim()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Savings Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({...formData, branch: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input
                type="text"
                value={formData.accountNo}
                onChange={(e) => setFormData({...formData, accountNo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter account number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scheme</label>
              <input
                type="text"
                value={formData.scheme}
                onChange={(e) => setFormData({...formData, scheme: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Principal Amount</label>
              <input
                type="number"
                value={formData.principal}
                onChange={(e) => setFormData({...formData, principal: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Amount</label>
              <input
                type="number"
                value={formData.interest}
                onChange={(e) => setFormData({...formData, interest: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maturity Date</label>
              <input
                type="date"
                value={formData.maturityDate}
                onChange={(e) => setFormData({...formData, maturityDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
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

export default function Savings() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<SavingsAccount | null>(null);
  const [savings, setSavings] = useState<SavingsAccount[]>([
    {
      id: '1',
      bankName: 'State Bank of India',
      branch: 'Main Branch',
      accountNo: '35476890123',
      scheme: 'Fixed Deposit',
      principal: 100000,
      interest: 8500,
      startDate: '2024-01-01',
      maturityDate: '2025-01-01',
      transactions: [
        {
          id: '1',
          date: '2024-01-01',
          particulars: 'Initial Deposit',
          debit: 0,
          credit: 100000,
          closingBalance: 100000
        },
        {
          id: '2',
          date: '2024-06-01',
          particulars: 'Interest Credit',
          debit: 0,
          credit: 4250,
          closingBalance: 104250
        },
        {
          id: '3',
          date: '2024-12-01',
          particulars: 'Interest Credit',
          debit: 0,
          credit: 4250,
          closingBalance: 108500
        }
      ]
    },
    {
      id: '2',
      bankName: 'HDFC Bank',
      branch: 'Commercial Street',
      accountNo: '50089145672',
      scheme: 'Recurring Deposit',
      principal: 50000,
      interest: 4200,
      startDate: '2024-02-01',
      maturityDate: '2026-02-01',
      transactions: [
        {
          id: '1',
          date: '2024-02-01',
          particulars: 'Monthly Deposit',
          debit: 0,
          credit: 2500,
          closingBalance: 2500
        },
        {
          id: '2',
          date: '2024-03-01',
          particulars: 'Monthly Deposit',
          debit: 0,
          credit: 2500,
          closingBalance: 5000
        },
        {
          id: '3',
          date: '2024-04-01',
          particulars: 'Monthly Deposit',
          debit: 0,
          credit: 2500,
          closingBalance: 7500
        }
      ]
    }
  ]);

  const totalPrincipal = savings.reduce((sum, account) => sum + account.principal, 0);
  const totalInterest = savings.reduce((sum, account) => sum + account.interest, 0);
  const totalAmount = totalPrincipal + totalInterest;

  const handleAddAccount = (newAccount: Omit<SavingsAccount, 'id'>) => {
    const account: SavingsAccount = {
      ...newAccount,
      id: Date.now().toString()
    };
    setSavings([...savings, account]);
  };

  const handleEdit = (id: string, field: keyof SavingsAccount, value: string | number) => {
    setSavings(savings.map(account => 
      account.id === id 
        ? { ...account, [field]: value }
        : account
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this savings account?')) {
      setSavings(savings.filter(account => account.id !== id));
    }
  };

  const handleViewTransactions = (account: SavingsAccount) => {
    setSelectedAccount(account);
  };

  const handleAddTransaction = (accountId: string, transactionData: Omit<Transaction, 'id' | 'closingBalance'>) => {
    setSavings(prevSavings =>
      prevSavings.map(account => {
        if (account.id === accountId) {
          const lastBalance = account.transactions.length > 0
            ? account.transactions[account.transactions.length - 1].closingBalance
            : account.principal;

          const newClosingBalance = lastBalance + transactionData.credit - transactionData.debit;

          const newTransaction: Transaction = {
            ...transactionData,
            id: Date.now().toString(),
            closingBalance: newClosingBalance
          };

          return {
            ...account,
            transactions: [...account.transactions, newTransaction]
          };
        }
        return account;
      })
    );
  };

  const exportToExcel = () => {
    const headers = ['S.No', 'Bank Name', 'Branch', 'Account Number', 'Scheme', 'Principal Amount', 'Interest Amount', 'Total Amount', 'Start Date', 'Maturity Date', 'Transaction Count'];
    
    const csvContent = [
      headers.join(','),
      ...savings.map((account, index) => [
        index + 1,
        account.bankName,
        account.branch,
        account.accountNo,
        account.scheme,
        account.principal,
        account.interest,
        account.principal + account.interest,
        account.startDate,
        account.maturityDate,
        account.transactions.length
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `savings_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Savings Management</h1>
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
              Add
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-1">Total Principal</h3>
            <p className="text-2xl font-bold text-blue-900">₹{totalPrincipal.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800 mb-1">Total Interest</h3>
            <p className="text-2xl font-bold text-green-900">₹{totalInterest.toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-800 mb-1">Total Amount</h3>
            <p className="text-2xl font-bold text-purple-900">₹{totalAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">S.No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Bank Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Branch</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Account No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Scheme</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Principal</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Interest</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Start Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Maturity Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {savings.map((account, index) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{account.bankName}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{account.branch}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <input
                      type="text"
                      value={account.accountNo}
                      onChange={(e) => handleEdit(account.id, 'accountNo', e.target.value)}
                      className="w-32 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{account.scheme}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <input
                      type="number"
                      value={account.principal}
                      onChange={(e) => handleEdit(account.id, 'principal', Number(e.target.value))}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <input
                      type="number"
                      value={account.interest}
                      onChange={(e) => handleEdit(account.id, 'interest', Number(e.target.value))}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{account.startDate}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{account.maturityDate}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewTransactions(account)}
                        className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer whitespace-nowrap flex items-center gap-1 hover:bg-blue-700"
                      >
                        <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(account.id)}
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

      {showAddModal && (
        <AddModal
          onSave={handleAddAccount}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {selectedAccount && (
        <TransactionModal
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
          onAddTransaction={handleAddTransaction}
        />
      )}
    </div>
  );
}
