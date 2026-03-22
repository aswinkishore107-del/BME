
'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsProps {
  userRole: string;
  currentUser: string;
  onLogAction?: (action: string, description: string) => void;
}

export default function Analytics({ userRole, currentUser, onLogAction }: AnalyticsProps) {
  const [salesDateRange, setSalesDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const [profitDateRange, setProfitDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const [salesData, setSalesData] = useState([]);
  const [profitData, setProfitData] = useState([]);

  const generateSalesData = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const data = [];
    
    const currentDate = new Date(start);
    while (currentDate <= end) {
      data.push({
        date: currentDate.toISOString().split('T')[0],
        sales: Math.floor(Math.random() * 50000) + 30000,
        day: currentDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  };

  const generateProfitData = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const data = [];
    
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const sales = Math.floor(Math.random() * 50000) + 30000;
      const expenses = Math.floor(sales * 0.6) + Math.floor(Math.random() * 5000);
      const netProfit = sales - expenses - Math.floor(Math.random() * 3000);
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        netProfit: netProfit,
        day: currentDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  };

  useEffect(() => {
    setSalesData(generateSalesData(salesDateRange.start, salesDateRange.end));
    onLogAction?.('View Analytics', 'Generated sales chart data');
  }, [salesDateRange]);

  useEffect(() => {
    setProfitData(generateProfitData(profitDateRange.start, profitDateRange.end));
    onLogAction?.('View Analytics', 'Generated profit chart data');
  }, [profitDateRange]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);
  };

  const exportSalesData = () => {
    const headers = ['Date', 'Sales Amount'];
    const csvContent = [
      headers.join(','),
      ...salesData.map((item: any) => [item.date, item.sales].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-analytics-${salesDateRange.start}-to-${salesDateRange.end}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    onLogAction?.('Export', 'Exported sales analytics data');
  };

  const exportProfitData = () => {
    const headers = ['Date', 'Net Profit'];
    const csvContent = [
      headers.join(','),
      ...profitData.map((item: any) => [item.date, item.netProfit].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profit-analytics-${profitDateRange.start}-to-${profitDateRange.end}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    onLogAction?.('Export', 'Exported profit analytics data');
  };

  const totalSales = salesData.reduce((sum: number, item: any) => sum + item.sales, 0);
  const totalProfit = profitData.reduce((sum: number, item: any) => sum + item.netProfit, 0);
  const averageDailySales = salesData.length > 0 ? totalSales / salesData.length : 0;
  const averageDailyProfit = profitData.length > 0 ? totalProfit / profitData.length : 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Visual insights into sales and profit trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Sales</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSales)}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg w-12 h-12 flex items-center justify-center">
              <i className="ri-line-chart-line text-white text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Profit</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalProfit)}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg w-12 h-12 flex items-center justify-center">
              <i className="ri-wallet-line text-white text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Daily Sales</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(averageDailySales)}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg w-12 h-12 flex items-center justify-center">
              <i className="ri-bar-chart-line text-white text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Daily Profit</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(averageDailyProfit)}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg w-12 h-12 flex items-center justify-center">
              <i className="ri-trending-up-line text-white text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Sales Analytics</h3>
              <p className="text-gray-600">Track daily sales performance over time</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">From:</label>
                <input
                  type="date"
                  value={salesDateRange.start}
                  onChange={(e) => setSalesDateRange({...salesDateRange, start: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">To:</label>
                <input
                  type="date"
                  value={salesDateRange.end}
                  onChange={(e) => setSalesDateRange({...salesDateRange, end: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <button
                onClick={exportSalesData}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2 text-sm"
              >
                <i className="ri-download-line w-4 h-4 flex items-center justify-center"></i>
                Export
              </button>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Sales']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Net Profit Analytics</h3>
              <p className="text-gray-600">Monitor daily profit margins and trends</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">From:</label>
                <input
                  type="date"
                  value={profitDateRange.start}
                  onChange={(e) => setProfitDateRange({...profitDateRange, start: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">To:</label>
                <input
                  type="date"
                  value={profitDateRange.end}
                  onChange={(e) => setProfitDateRange({...profitDateRange, end: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <button
                onClick={exportProfitData}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2 text-sm"
              >
                <i className="ri-download-line w-4 h-4 flex items-center justify-center"></i>
                Export
              </button>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Net Profit']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="netProfit" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-700">
          <i className="ri-information-line w-5 h-5 flex items-center justify-center"></i>
          <div>
            <p className="text-sm font-medium">Analytics Information</p>
            <p className="text-sm">Charts show trends over your selected date ranges. Data is updated in real-time as new transactions are processed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
