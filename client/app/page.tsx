'use client';

import { useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';
import { toast } from 'react-toastify';

import LoginForm from '@/components/LoginForm';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import NewEntry from '@/components/NewEntry';
import ViewEntries from '@/components/ViewEntries';
import Creditors from '@/components/Creditors';
import Inventory from '@/components/Inventory';
import Indent from '@/components/Indent';
import Savings from '@/components/Savings';
import BankAccounts from '@/components/BankAccounts';
import PigmyS from '@/components/PigmyS';
import PigmyR from '@/components/PigmyR';
import Staff from '@/components/Staff';
import Attendance from '@/components/Attendance';
import Salary from '@/components/Salary';
import Maintenance from '@/components/Maintenance';
import BackupRestore from '@/components/BackupRestore';
import DeleteData from '@/components/DeleteData';
import ManageUsers from '@/components/ManageUsers';
import Logs from '@/components/Logs';
import Analytics from '@/components/Analytics';
import RaiseTicket from '@/components/RaiseTicket';

/* ================= TYPES ================= */

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  details: string;
  ipAddress?: string;
  module: string;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: string;
  targetUsers: string[];
  isRead: boolean;
}

/* ================= COMPONENT ================= */

export default function Home() {

  /* ============ STATE ============ */

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [token, setToken] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [forceUpdate, setForceUpdate] = useState(0);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      message: 'System backup completed successfully',
      type: 'success',
      timestamp: new Date().toISOString(),
      targetUsers: ['admin'],
      isRead: false
    }
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      user: 'admin',
      userRole: 'Admin',
      action: 'System Login',
      details: 'Administrator logged into the system',
      ipAddress: '192.168.1.100',
      module: 'Login/Logout'
    }
  ]);


  /* ============ AUTO LOGIN (SESSION CHECK) ============ */

  useEffect(() => {

    const initAuth = async () => {

      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {

        try {

          const response = await authAPI.getMe();

          if (response.success) {

            setToken(storedToken);
            setUserRole(response.data.role);
            setCurrentUser(response.data.username);
            setIsLoggedIn(true);

            // Set default tab according to role on auto-login
            const roleLowerAuto = (response.data.role || '').toLowerCase();
            if (roleLowerAuto === 'admin') {
              setActiveTab('manage-users');
            } else {
              setActiveTab('dashboard');
            }

          } else {

            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }

        } catch (error) {

          console.error('Auth check failed:', error);

          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    };

    initAuth();

  }, []);


  /* ============ LOGIN ============ */

  const handleLogin = (username: string, role: string) => {

    const storedToken = localStorage.getItem('token');

    if (storedToken) {

      setToken(storedToken);
      setUserRole(role);
      setCurrentUser(username);
      setIsLoggedIn(true);

      addLog(
        'System Login',
        `${role} ${username} logged into the system`,
        'Login/Logout'
      );

      // Role-based default view
      const roleLower = (role || '').toLowerCase();
      if (roleLower === 'admin') {
        setActiveTab('manage-users');
        toast.success('Logged in as Admin — redirecting to Admin dashboard');
      } else if (roleLower === 'manager') {
        setActiveTab('dashboard');
        toast.success('Logged in as Manager — redirecting to Manager dashboard');
      } else {
        setActiveTab('dashboard');
        toast.success('Logged in as User — redirecting to User dashboard');
      }
    }
  };


  /* ============ LOGOUT ============ */

  const handleLogout = async () => {

    try {

      await authAPI.logout();

    } catch (error) {

      console.error('Logout API error:', error);

    } finally {

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      addLog(
        'System Logout',
        `${userRole} ${currentUser} logged out of the system`,
        'Login/Logout'
      );

      setIsLoggedIn(false);
      setUserRole('');
      setCurrentUser('');
      setToken('');
      setActiveTab('dashboard');
      setForceUpdate(prev => prev + 1);
    }
  };


  /* ============ LOG SYSTEM ============ */

  const addLog = (
    action: string,
    details: string,
    module: string = 'General'
  ) => {

    const newLog: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      user: currentUser,
      userRole,
      action,
      details,
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
      module
    };

    setLogs(prev => [newLog, ...prev]);
  };


  /* ============ NOTIFICATIONS ============ */

  const addNotification = (
    message: string,
    type: 'success' | 'info' | 'warning' | 'error',
    targetUsers: string[]
  ) => {

    const newNotification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      type,
      timestamp: new Date().toISOString(),
      targetUsers,
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    addLog(
      'Send Notification',
      `Notification sent: ${message}`,
      'System'
    );
  };


  /* ============ TAB TRACKING ============ */

  useEffect(() => {

    if (activeTab !== 'logs' && isLoggedIn) {

      addLog(
        'Navigate',
        `Accessed ${activeTab.replace('-', ' ')}`,
        'Navigation'
      );
    }

  }, [activeTab, isLoggedIn]);


  /* ============ DEBUG ============ */

  useEffect(() => {

    console.log('App State:', {
      isLoggedIn,
      userRole,
      currentUser,
      token,
      activeTab
    });

  }, [isLoggedIn, userRole, currentUser, token, activeTab]);


  /* ============ LOGIN PAGE ============ */

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }


  /* ============ CONTENT RENDER ============ */

  const renderContent = () => {

    switch (activeTab) {

      case 'dashboard':
        return <Dashboard
          userRole={userRole}
          currentUser={currentUser}
          onLogAction={addLog}
          notifications={notifications}
        />;

      case 'analytics':
        return <Analytics
          userRole={userRole}
          currentUser={currentUser}
          onLogAction={addLog}
        />;

      case 'new-entry':
        return <NewEntry
          userRole={userRole}
          currentUser={currentUser}
          onLogAction={addLog}
        />;

      case 'view-entries':
        return <ViewEntries
          userRole={userRole}
          currentUser={currentUser}
          onLogAction={addLog}
        />;

      case 'creditors':
        return <Creditors
          userRole={userRole}
          currentUser={currentUser}
          onLogAction={addLog}
        />;

      case 'inventory':
        return <Inventory
          userRole={userRole}
          currentUser={currentUser}
          onLogAction={addLog}
        />;

      case 'indent':
        return <Indent
          userRole={userRole}
          currentUser={currentUser}
          onLogAction={addLog}
          onNotification={addNotification}
        />;

      case 'savings':
        return <Savings
          userRole={userRole}
          currentUser={currentUser}
          onLogAction={addLog}
        />;

      case 'bank-accounts':
        return <BankAccounts
          userRole={userRole}
          currentUser={currentUser}
          onLogAction={addLog}
        />;

      case 'staff':
        return <Staff
          userRole={userRole}
          currentUser={currentUser}
          onLogAction={addLog}
        />;

      case 'attendance':
        return <Attendance
          userRole={userRole}
          currentUser={currentUser}
          onLogAction={addLog}
        />;

      case 'salary':
        return <Salary
          userRole={userRole}
          currentUser={currentUser}
          onLogAction={addLog}
        />;

      case 'maintenance':
        return <Maintenance
          userRole={userRole}
          currentUser={currentUser}
          onLogAction={addLog}
        />;

      case 'raise-ticket':
        return <RaiseTicket
          userRole={userRole}
          currentUser={currentUser}
          onLogAction={addLog}
        />;

      case 'backup':
        return <BackupRestore
          userRole={userRole}
          currentUser={currentUser}
          onLogAction={addLog}
        />;

      case 'delete-data':
        return <DeleteData
          userRole={userRole}
          currentUser={currentUser}
          onLogAction={addLog}
        />;

      case 'manage-users':
        return <ManageUsers />;

      case 'logs':
        return <Logs
          userRole={userRole}
          currentUser={currentUser}
          logs={logs}
        />;

      default:
        return null;
    }
  };


  /* ============ UI ============ */

  return (

    <div
      className="flex h-screen bg-gray-100"
      key={forceUpdate}
    >

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        onLogAction={addLog}
      />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="bg-white shadow-sm border-b px-6 py-4">

          <div className="flex justify-between items-center">

            <div>
              <h2 className="text-lg font-semibold capitalize">
                {activeTab.replace('-', ' ')}
              </h2>

              <p className="text-sm text-gray-600">
                Welcome, {currentUser} ({userRole})
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>

          </div>

        </header>


        {/* MAIN */}
        <main className="flex-1 overflow-y-auto">

          {renderContent()}

        </main>

      </div>

    </div>
  );
}
