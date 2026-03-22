'use client';

import { useState } from 'react';

interface NewEntryProps {
  currentUser: string;
}

export default function NewEntry({ currentUser }: NewEntryProps) {
  const today = new Date().toISOString().split('T')[0];

  // Form State (EMPTY values, not 0)
  const [formData, setFormData] = useState({
    date: today,
    cash: '',
    bank: '',
    sales: '',
    mutton: '',
    chicken: '',
    grocery: '',
    flower: '',
    leaf: '',
    gas: '',
    misc: '',
    pigmyS: '',
    salary: ''
  });

  // Convert string → number safely
  const toNumber = (val: any) => Number(val) || 0;

  // Handle Input Change
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate Expenses
  const calculateExpenses = () => {
    return (
      toNumber(formData.mutton) +
      toNumber(formData.chicken) +
      toNumber(formData.grocery) +
      toNumber(formData.flower) +
      toNumber(formData.leaf) +
      toNumber(formData.gas) +
      toNumber(formData.misc) +
      toNumber(formData.pigmyS) +
      toNumber(formData.salary)
    );
  };

  // Calculate Profit
  const calculateProfit = () => {
    return toNumber(formData.sales) - calculateExpenses();
  };

  // Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const expenses = calculateExpenses();
    const profit = calculateProfit();

    const entryData = {
      ...formData,
      cash: toNumber(formData.cash),
      bank: toNumber(formData.bank),
      sales: toNumber(formData.sales),
      mutton: toNumber(formData.mutton),
      chicken: toNumber(formData.chicken),
      grocery: toNumber(formData.grocery),
      flower: toNumber(formData.flower),
      leaf: toNumber(formData.leaf),
      gas: toNumber(formData.gas),
      misc: toNumber(formData.misc),
      pigmyS: toNumber(formData.pigmyS),
      salary: toNumber(formData.salary),
      expenses,
      profit,
      createdBy: currentUser,
      createdAt: new Date().toISOString()
    };

    console.log('New entry:', entryData);

    alert('Entry saved successfully!');

    // Reset Form
    setFormData({
      date: today,
      cash: '',
      bank: '',
      sales: '',
      mutton: '',
      chicken: '',
      grocery: '',
      flower: '',
      leaf: '',
      gas: '',
      misc: '',
      pigmyS: '',
      salary: ''
    });
  };

  // Input Fields
  const inputFields = [
    { id: 'date', label: 'Date', type: 'date' },
    { id: 'cash', label: 'Cash', type: 'number' },
    { id: 'bank', label: 'Bank', type: 'number' },
    { id: 'sales', label: 'Sales', type: 'number' },
    { id: 'mutton', label: 'Mutton', type: 'number' },
    { id: 'chicken', label: 'Chicken', type: 'number' },
    { id: 'grocery', label: 'Grocery', type: 'number' },
    { id: 'flower', label: 'Flower', type: 'number' },
    { id: 'leaf', label: 'Leaf', type: 'number' },
    { id: 'gas', label: 'Gas', type: 'number' },
    { id: 'misc', label: 'Miscellaneous', type: 'number' },
    { id: 'pigmyS', label: 'Pigmy S', type: 'number' },
    { id: 'salary', label: 'Salary', type: 'number' }
  ];

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          New Entry
        </h1>
        <p className="text-gray-600">
          Add a new financial entry
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border">

            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {inputFields.map((field) => (

                  <div key={field.id}>

                    <label
                      htmlFor={field.id}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {field.label}
                    </label>

                    <input
                      id={field.id}
                      type={field.type}
                      value={
                        field.type === 'date'
                          ? formData.date
                          : (formData as any)[field.id]
                      }
                      onChange={(e) =>
                        handleInputChange(field.id, e.target.value)
                      }
                      max={field.type === 'date' ? today : undefined}
                      inputMode={
                        field.type === 'number' ? 'decimal' : undefined
                      }
                      placeholder={
                        field.type === 'number' ? '0' : undefined
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-blue-500
                                 text-sm appearance-none"
                    />

                  </div>
                ))}

              </div>

              {/* Submit Button */}
              <div className="mt-6 flex justify-end">

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg
                             hover:bg-blue-700 focus:outline-none focus:ring-2
                             focus:ring-blue-500 focus:ring-offset-2
                             transition duration-200 cursor-pointer"
                >
                  Save Entry
                </button>

              </div>

            </form>

          </div>
        </div>

        {/* Calculation Section */}
        <div className="space-y-6">

          <div className="bg-white p-6 rounded-xl shadow-sm border">

            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Calculations
            </h3>

            <div className="space-y-3">

              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-gray-700">Total Expenses</span>

                <span className="font-semibold text-red-600">
                  ₹{calculateExpenses().toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Profit</span>

                <span
                  className={`font-semibold ${
                    calculateProfit() >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  ₹{calculateProfit().toLocaleString()}
                </span>
              </div>

            </div>

          </div>

          {/* Formula Info */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">

            <h4 className="font-medium text-blue-900 mb-2">
              Formula Reference
            </h4>

            <div className="text-sm text-blue-800 space-y-1">

              <p>
                <strong>Expenses = </strong>
                Mutton + Chicken + Grocery + Flower + Leaf + Gas + Misc +
                Pigmy S + Salary
              </p>

              <p>
                <strong>Profit = </strong>
                Sales - Expenses
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
