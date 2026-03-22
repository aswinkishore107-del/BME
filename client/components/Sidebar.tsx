
'use client';

import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
  onLogAction: (action: string, details: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab, userRole, onLogAction }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line', roles: ['Admin', 'Owner', 'Manager', 'Cashier', 'User-Admin', 'User'] },
    { id: 'analytics', label: 'Analytics', icon: 'ri-bar-chart-line', roles: ['Admin', 'Owner', 'Manager', 'User-Admin'] },
    { id: 'new-entry', label: 'New Entry', icon: 'ri-add-circle-line', roles: ['Admin', 'Owner', 'Manager', 'Cashier'] },
    { id: 'view-entries', label: 'View Entries', icon: 'ri-eye-line', roles: ['Admin', 'Owner', 'Manager', 'Cashier', 'User-Admin', 'User'] },
    { id: 'creditors', label: 'Creditors', icon: 'ri-user-line', roles: ['Admin', 'Owner', 'Manager'] },
    { id: 'inventory', label: 'Inventory', icon: 'ri-box-line', roles: ['Admin', 'Owner', 'Manager', 'User-Admin'] },
    { id: 'indent', label: 'Indent', icon: 'ri-file-list-line', roles: ['Admin', 'Owner', 'Manager', 'Cashier', 'User-Admin'] },
    { id: 'savings', label: 'Savings', icon: 'ri-bank-line', roles: ['Admin', 'Owner', 'Manager', 'Cashier', 'User-Admin'] },
    { id: 'bank-accounts', label: 'Bank Accounts', icon: 'ri-bank-card-line', roles: ['Admin', 'Owner', 'Manager'] },
    { id: 'pigmy-s', label: 'Pigmy S', icon: 'ri-coins-line', roles: ['Admin', 'Owner', 'Manager', 'Cashier', 'User-Admin'] },
    { id: 'pigmy-r', label: 'Pigmy R', icon: 'ri-wallet-line', roles: ['Admin', 'Owner', 'Manager', 'Cashier', 'User-Admin'] },
    { id: 'staff', label: 'Staff', icon: 'ri-team-line', roles: ['Admin', 'Owner', 'Manager', 'User-Admin'] },
    { id: 'attendance', label: 'Attendance', icon: 'ri-calendar-check-line', roles: ['Admin', 'Owner', 'Manager', 'User-Admin'] },
    { id: 'salary', label: 'Salary', icon: 'ri-money-dollar-circle-line', roles: ['Admin', 'Owner', 'Manager', 'User-Admin'] },
    { id: 'maintenance', label: 'Maintenance', icon: 'ri-tools-line', roles: ['Admin', 'Owner', 'Manager', 'User-Admin'] },
    { id: 'raise-ticket', label: 'Raise Ticket', icon: 'ri-customer-service-line', roles: ['Admin', 'Owner', 'Manager', 'User-Admin', 'Cashier', 'User'] },
    { id: 'backup', label: 'Backup/Restore', icon: 'ri-cloud-line', roles: ['Admin', 'Owner'] },
    { id: 'delete-data', label: 'Delete Data', icon: 'ri-delete-bin-line', roles: ['Admin', 'Owner'] },
    { id: 'manage-users', label: 'Manage Users', icon: 'ri-user-settings-line', roles: ['Admin', 'Owner', 'User-Admin'] },
    { id: 'logs', label: 'Logs', icon: 'ri-file-text-line', roles: ['Admin', 'Owner', 'Manager', 'User-Admin'] }
  ];

  const handleTabClick = (tabId: string, tabLabel: string) => {
    setActiveTab(tabId);
    onLogAction('Navigate', `Switched to ${tabLabel} section`);
  };

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen flex flex-col`}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && <h1 className="text-xl font-bold">Accounts</h1>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-700 rounded cursor-pointer w-8 h-8 flex items-center justify-center"
          >
            <i className={`ri-menu-${isCollapsed ? 'unfold' : 'fold'}-line`}></i>
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="p-2 space-y-1">
          {filteredMenuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleTabClick(item.id, item.label)}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <i className={`${item.icon} ${isCollapsed ? 'text-lg' : 'mr-3'} w-5 h-5 flex items-center justify-center`}></i>
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}