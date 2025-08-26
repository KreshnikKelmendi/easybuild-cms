'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials
    if (username === 'easybuild' && password === 'easybuild123') {
      // Store authentication state (you can use localStorage or context)
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      setError('Invalid username or password. Use: easybuild / easybuild123');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#191716] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Website Button */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[#F3F4F4] hover:text-[#DD4726] transition-colors duration-300 mb-8"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Website</span>
          </Link>
        </div>

        {/* Sign In Form */}
        <div className="bg-[#2A2A2A] rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#F3F4F4] mb-2">Admin Panel</h2>
            <p className="text-gray-400">Sign in to access EasyBuild Dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-md text-red-400 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#F3F4F4] mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[#191716] border border-gray-600 rounded-md text-[#F3F4F4] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DD4726] focus:border-transparent transition-all duration-300"
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#F3F4F4] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#191716] border border-gray-600 rounded-md text-[#F3F4F4] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DD4726] focus:border-transparent transition-all duration-300"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#DD4726] focus:ring-[#DD4726] border-gray-600 rounded bg-[#191716]"
                  disabled={isLoading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>
              <Link href="#" className="text-sm text-[#DD4726] hover:text-[#B83A1E] transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#DD4726] hover:bg-[#B83A1E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DD4726] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
