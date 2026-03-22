// BME/client/components/LoginForm.tsx (modified)

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api'; // Import API client
import { toast } from 'react-toastify';

interface LoginFormProps {
  onLogin: (username: string, role: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'Admin'|'Manager'|'User'>('User');
  const [isClient, setIsClient] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const response = await authAPI.login({ username, password });
      
      if (response.success) {
        // Store token and user data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Call parent login handler (role-aware)
        onLogin(username, response.data.user.role);
      } else {
        setLoginError(response.message || 'Invalid credentials');
      }
    } catch (error: any) {
      setLoginError(error.message || 'Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    if (password !== confirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setSignupError('Please enter a valid email address');
      return;
    }

    if (username.length < 3) {
      setSignupError('Username must be at least 3 chars');
      return;
    }

    if (!/^\d{6}$/.test(password)) {
      setSignupError('Password must be exactly 6 numeric digits');
      return;
    }

    setIsSigningUp(true);
    try {
      const response = await authAPI.register({ username, email, password, role });
      if (response.success) {
        // Show success toast and allow immediate login
        toast.success(response.message || 'Registration successful. You may now log in.');
        setSignupSuccess(response.message || 'Registration successful. You may now log in.');
        setShowSignup(false);
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        setRole('User');
      } else {
        setSignupError(response.message || 'Registration failed');
      }
    } catch (error: any) {
      setSignupError(error.message || 'Registration failed. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsSigningUp(false);
    }
  };

  // Rest of component remains the same...
  // (forgot password handler, UI rendering, etc.)


  const [forgotEmail, setForgotEmail] = useState('');

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
      toast.error('Please enter a valid email');
      return;
    }

    try {
      const res = await authAPI.forgotPassword({ email: forgotEmail });
      // If a token is returned, route user directly to reset page (no email).
      if (res && res.token) {
        router.push(`/reset-password?token=${res.token}`);
        return;
      }

      setResetMessage(res.message || 'If that email is registered, a reset link has been sent.');
      setShowForgotPassword(false);
      setForgotEmail('');
      toast.success(res.message || 'Password reset token generated');
    } catch (err: any) {
      console.error('Forgot password error:', err);
      toast.error(err.message || 'Failed to send reset link');
    }
  };

  // Show nothing until client-side rendering is complete
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-600 mb-4" style={{ fontFamily: 'Times New Roman, serif' }}>
              SREE RANGAVILAS HOTEL
            </h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Accounts Dashboard</h2>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-600 mb-4" style={{ fontFamily: 'Times New Roman, serif' }}>
            SREE RANGAVILAS HOTEL
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Accounts Dashboard</h2>
          <p className="text-gray-600">Sign in to access your account</p>
          {signupSuccess && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg">
              <p className="text-sm">{signupSuccess}</p>
            </div>
          )}
        </div>

        {!showForgotPassword ? (
          !showSignup ? (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{loginError}</p>
                </div>
              )}

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setLoginError('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 whitespace-nowrap cursor-pointer"
              >
                Sign In
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer whitespace-nowrap"
                >
                  Forgot your password?
                </button>
              </div>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setShowSignup(true); setLoginError(''); setSignupError(''); }}
                    className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                  >
                    Sign up
                  </button>
                </p>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Admin: admin / cse2025</div>
                  <div>User: user / user123</div>
                  <div>Manager: manager / manager123</div>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="mt-8 space-y-6">
              {signupError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{signupError}</p>
                </div>
              )}

              <div>
                <label htmlFor="username-signup" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username-signup"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setSignupError('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email-signup"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSignupError('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your email address"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="User">User</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password-signup"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setSignupError('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 whitespace-nowrap cursor-pointer"
                >
                  {isSigningUp ? 'Creating...' : 'Create Account'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowSignup(false); setSignupError(''); setPassword(''); setConfirmPassword(''); }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200 whitespace-nowrap cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )
        ) : (
          <form onSubmit={handleForgotPassword} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 whitespace-nowrap cursor-pointer"
              >
                Retest Password
              </button>
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200 whitespace-nowrap cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
