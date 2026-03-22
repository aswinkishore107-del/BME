'use client';

import { useState } from 'react';

interface FilterBarProps {
  onFilterChange: (filter: string, customStart?: string, customEnd?: string) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [activeFilter, setActiveFilter] = useState('current-month');
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const filters = [
    { id: 'current-month', label: 'Current Month' },
    { id: 'previous-month', label: 'Previous Month' },
    { id: 'last-3-months', label: 'Last 3 Months' },
    { id: 'last-6-months', label: 'Last 6 Months' },
    { id: 'custom', label: 'Custom Date Range' },
  ];

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    if (filterId === 'custom') {
      setShowCustomRange(true);
    } else {
      setShowCustomRange(false);
      onFilterChange(filterId);
    }
  };

  const handleCustomRangeApply = () => {
    if (customStartDate && customEndDate) {
      onFilterChange('custom', customStartDate, customEndDate);
      setShowCustomRange(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === filter.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {showCustomRange && (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex gap-2 mt-6">
            <button
              onClick={handleCustomRangeApply}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm cursor-pointer whitespace-nowrap"
            >
              Apply
            </button>
            <button
              onClick={() => setShowCustomRange(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 text-sm cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}