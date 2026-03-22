
'use client';

import { useState, useEffect } from 'react';
import FilterBar from './FilterBar';

interface DashboardProps {
  userRole?: string;
  currentUser?: string;
  onLogAction?: (action: string, description: string) => void;
  notifications?: Array<{
    id: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
    timestamp: string;
    targetUsers: string[];
    isRead: boolean;
  }>;
}

export default function Dashboard({
  userRole = 'Admin',
  currentUser = 'admin',
  onLogAction,
  notifications = [],
}: DashboardProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    totalSales: 125000,
    totalExpenses: 85000,
    grossProfit: 40000,
    netProfit: 25000,
    creditors: 10000,
    pigmyR: 5000,
    bankBalance: 275250, // Total from all bank accounts
  });

  const handleFilterChange = (filter: string, customStart?: string, customEnd?: string) => {
    const mockData = {
      'current-month': { totalSales: 125000, totalExpenses: 85000, creditors: 10000, pigmyR: 5000, bankBalance: 275250 },
      'previous-month': { totalSales: 118000, totalExpenses: 82000, creditors: 8000, pigmyR: 4500, bankBalance: 265000 },
      'last-3-months': { totalSales: 345000, totalExpenses: 245000, creditors: 25000, pigmyR: 15000, bankBalance: 285000 },
      'last-6-months': { totalSales: 720000, totalExpenses: 510000, creditors: 45000, pigmyR: 30000, bankBalance: 295000 },
      custom: { totalSales: 95000, totalExpenses: 68000, creditors: 7000, pigmyR: 3500, bankBalance: 260000 },
    };

    const data = mockData[filter as keyof typeof mockData] || mockData['current-month'];
    const grossProfit = data.totalSales - data.totalExpenses;
    const netProfit = grossProfit - data.creditors - data.pigmyR;

    setDashboardData({
      ...data,
      grossProfit,
      netProfit,
    });
  };

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
    if (!showProfile) {
      onLogAction?.('Profile View', 'Viewed profile information');
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      onLogAction?.('Notifications View', 'Viewed notifications panel');
    }
  };

  const userNotifications = notifications.filter((notif) =>
    notif.targetUsers.includes(currentUser) || notif.targetUsers.length === 0,
  );

  const unreadCount = userNotifications.filter((notif) => !notif.isRead).length;

  const getLastLoginTime = () => {
    const lastLogin = new Date();
    lastLogin.setHours(lastLogin.getHours() - 2);
    return lastLogin.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    }) + ' IST';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'ri-check-circle-line text-green-600';
      case 'warning':
        return 'ri-alert-line text-yellow-600';
      case 'error':
        return 'ri-error-warning-line text-red-600';
      default:
        return 'ri-information-line text-blue-600';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const cards = [
    {
      title: 'Bank Balance',
      value: dashboardData.bankBalance,
      icon: 'ri-bank-line',
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
    },
    {
      title: 'Total Sales',
      value: dashboardData.totalSales,
      icon: 'ri-line-chart-line',
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Expenses',
      value: dashboardData.totalExpenses,
      icon: 'ri-money-dollar-circle-line',
      color: 'bg-red-500',
      textColor: 'text-red-600',
    },
    {
      title: 'Gross Profit',
      value: dashboardData.grossProfit,
      icon: 'ri-trending-up-line',
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      title: 'Net Profit',
      value: dashboardData.netProfit,
      icon: 'ri-wallet-line',
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Hotel Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-[\'Pacifico\'] text-blue-600 mb-2">SREE RANGAVILAS HOTEL</h1>
      </div>

      {/* Header with Profile and Notifications */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome to your business overview</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={handleNotificationClick}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer w-10 h-10 flex items-center justify-center"
            >
              <i className="ri-notification-3-line w-6 h-6 flex items-center justify-center"></i>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-600">{unreadCount} unread notifications</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {userNotifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No notifications available
                    </div>
                  ) : (
                    userNotifications
                      .slice(0, 5)
                      .map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${
                            !notif.isRead ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <i
                              className={`${getNotificationIcon(notif.type)} mt-1 w-4 h-4 flex items-center justify-center`}
                            ></i>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 line-clamp-2">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(notif.timestamp).toLocaleString('en-IN', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true,
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
                <div className="p-3 border-t border-gray-200">
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-800 cursor-pointer whitespace-nowrap">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {currentUser.charAt(0).toUpperCase()}
              </div>
              <i className="ri-arrow-down-s-line w-4 h-4 flex items-center justify-center"></i>
            </button>

            {showProfile && (
              <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {currentUser.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">{currentUser}</h3>
                      <p className="text-sm text-gray-600">{userRole}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <i className="ri-time-line text-gray-600 w-4 h-4 flex items-center justify-center"></i>
                      <div>
                        <p className="text-gray-600">Last Login</p>
                        <p className="text-gray-900 font-medium">{getLastLoginTime()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <i className="ri-shield-check-line text-green-600 w-4 h-4 flex items-center justify-center"></i>
                      <div>
                        <p className="text-gray-600">Account Status</p>
                        <p className="text-green-600 font-medium">Active</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2">
                      <i className="ri-settings-3-line w-4 h-4 flex items-center justify-center"></i>
                      Account Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2">
                      <i className="ri-lock-line w-4 h-4 flex items-center justify-center"></i>
                      Privacy & Security
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showProfile || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowProfile(false);
            setShowNotifications(false);
          }}
        ></div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className={`text-2xl font-bold ${card.textColor}`}>
                  {formatCurrency(card.value)}
                </p>
              </div>
              <div
                className={`${card.color} p-3 rounded-lg w-12 h-12 flex items-center justify-center`}
              >
                <i className={`${card.icon} text-white text-xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Profit Analysis</h3>
          </div>
          <div className="space-y-3 p-6">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Sales</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(dashboardData.totalSales)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Less: Expenses</span>
              <span className="font-semibold text-red-600">
                -{formatCurrency(dashboardData.totalExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-blue-700 font-medium">Gross Profit</span>
              <span className="font-bold text-blue-600">
                {formatCurrency(dashboardData.grossProfit)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Less: Creditors</span>
              <span className="font-semibold text-red-600">
                -{formatCurrency(dashboardData.creditors)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Less: Pigmy R</span>
              <span className="font-semibold text-red-600">
                -{formatCurrency(dashboardData.pigmyR)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <span className="text-purple-700 font-medium">Net Profit</span>
              <span className="font-bold text-purple-600">
                {formatCurrency(dashboardData.netProfit)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap">
                <div className="bg-blue-600 p-2 rounded-lg w-8 h-8 flex items-center justify-center">
                  <i className="ri-add-circle-line text-white w-4 h-4 flex items-center justify-center"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New Entry</p>
                  <p className="text-xs text-gray-600">Create a new transaction</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap">
                <div className="bg-green-600 p-2 rounded-lg w-8 h-8 flex items-center justify-center">
                  <i className="ri-store-line text-white w-4 h-4 flex items-center justify-center"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Check Inventory</p>
                  <p className="text-xs text-gray-600">View stock levels</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap">
                <div className="bg-purple-600 p-2 rounded-lg w-8 h-8 flex items-center justify-center">
                  <i className="ri-team-line text-white w-4 h-4 flex items-center justify-center"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Staff Management</p>
                  <p className="text-xs text-gray-600">Manage team members</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap">
                <div className="bg-orange-600 p-2 rounded-lg w-8 h-8 flex items-center justify-center">
                  <i className="ri-file-chart-line text-white w-4 h-4 flex items-center justify-center"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Generate Report</p>
                  <p className="text-xs text-gray-600">Download analytics</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
