
'use client';

import { useState } from 'react';

interface InventoryItem {
  id: string;
  product: string;
  quantity: number;
  unit: string;
  purchaseRate: number;
  salesRate: number;
}

interface AddModalProps {
  onSave: (item: Omit<InventoryItem, 'id'>) => void;
  onClose: () => void;
}

function AddModal({ onSave, onClose }: AddModalProps) {
  const [formData, setFormData] = useState({
    product: '',
    quantity: 0,
    unit: 'kg',
    purchaseRate: 0,
    salesRate: 0
  });

  const units = ['kg', 'litre', 'pieces', 'grams', 'ml'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.product.trim()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                value={formData.product}
                onChange={(e) => setFormData({...formData, product: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Rate</label>
              <input
                type="number"
                value={formData.purchaseRate}
                onChange={(e) => setFormData({...formData, purchaseRate: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sales Rate</label>
              <input
                type="number"
                value={formData.salesRate}
                onChange={(e) => setFormData({...formData, salesRate: Number(e.target.value)})}
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
              Add Product
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

export default function Inventory() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      product: 'Mutton',
      quantity: 50,
      unit: 'kg',
      purchaseRate: 400,
      salesRate: 500
    },
    {
      id: '2',
      product: 'Chicken',
      quantity: 30,
      unit: 'kg',
      purchaseRate: 180,
      salesRate: 220
    },
    {
      id: '3',
      product: 'Rice',
      quantity: 100,
      unit: 'kg',
      purchaseRate: 45,
      salesRate: 55
    },
    {
      id: '4',
      product: 'Cooking Oil',
      quantity: 25,
      unit: 'litre',
      purchaseRate: 120,
      salesRate: 140
    }
  ]);

  const handleAddItem = (newItem: Omit<InventoryItem, 'id'>) => {
    const item: InventoryItem = {
      ...newItem,
      id: Date.now().toString()
    };
    setInventory([...inventory, item]);
  };

  const handleQuantityChange = (id: string, change: number) => {
    setInventory(inventory.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ));
  };

  const handleEdit = (id: string, field: keyof InventoryItem, value: string | number) => {
    setInventory(inventory.map(item => 
      item.id === id 
        ? { ...item, [field]: value }
        : item
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  const exportToExcel = () => {
    const headers = ['S.No', 'Product', 'Quantity', 'Unit', 'Purchase Rate', 'Sales Rate', 'Purchase Value', 'Sales Value'];
    
    const csvContent = [
      headers.join(','),
      ...inventory.map((item, index) => [
        index + 1,
        item.product,
        item.quantity,
        item.unit,
        item.purchaseRate,
        item.salesRate,
        (item.quantity * item.purchaseRate).toFixed(2),
        (item.quantity * item.salesRate).toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
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
              Add Product
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">S.No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Unit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Purchase Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sales Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.product}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="bg-red-500 text-white w-6 h-6 rounded cursor-pointer flex items-center justify-center"
                      >
                        <i className="ri-subtract-line w-3 h-3 flex items-center justify-center"></i>
                      </button>
                      <span className="text-gray-900 font-medium min-w-[60px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="bg-green-500 text-white w-6 h-6 rounded cursor-pointer flex items-center justify-center"
                      >
                        <i className="ri-add-line w-3 h-3 flex items-center justify-center"></i>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{item.unit}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <input
                      type="number"
                      value={item.purchaseRate}
                      onChange={(e) => handleEdit(item.id, 'purchaseRate', Number(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <input
                      type="number"
                      value={item.salesRate}
                      onChange={(e) => handleEdit(item.id, 'salesRate', Number(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer whitespace-nowrap flex items-center gap-1"
                    >
                      <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddModal
          onSave={handleAddItem}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
