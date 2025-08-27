'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BannerManager from '../components/admin/BannerManager';
import ServiceManager from '../components/admin/ServiceManager';
import ProjectManager from '../components/admin/ProjectManager';
import WoodsManager from '../components/admin/WoodsManager';
import SocialMediaManager from '../components/admin/SocialMediaManager';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const storedUsername = localStorage.getItem('username');

    if (!isAuthenticated || !storedUsername) {
      router.push('/signin');
      return;
    }

    setUsername(storedUsername);
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    router.push('/signin');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#191716] via-[#2A2A2A] to-[#191716] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[#DD4726] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-3xl font-bold text-[#F3F4F4] mt-8 mb-4 font-zonapro">Loading Admin Panel</h2>
          <p className="text-gray-400 text-lg font-zonapro">Please wait while we prepare your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#191716] flex">
      {/* Left Sidebar */}
      <div className="w-72 bg-gradient-to-b from-[#2A2A2A] to-[#1F1F1F] border-r border-gray-800 shadow-2xl">
        {/* Logo and Header */}
        <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-[#2A2A2A] to-[#1F1F1F]">
          <div className="flex items-center justify-center">
            <svg width="82" height="82" viewBox="0 0 154 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_56_327)">
                <path d="M45.451 25.0759V37.9315L39.583 43.4962H0V34.1198H35.896L45.451 25.0759Z" fill="#DD4726"/>
                <path d="M42.1363 16.1219L31.2216 26.4363H0V17.0599H27.5312L42.1363 3.25964V16.1219Z" fill="#DD4726"/>
                <path d="M33.6452 0H0V9.37644H23.7245L33.6452 0Z" fill="#DD4726"/>
                <path d="M117.941 6.95501V5.27862H104.712V8.77442H119.796L121.472 10.7734V17.6586C120.757 18.3371 120.365 18.693 119.653 19.3716H102.751L101.145 17.4457V14.1262H104.712V15.8026H117.941V12.3068H102.748L101.142 10.4142V3.42263C101.853 2.74409 102.249 2.38819 102.96 1.70966H119.793L121.469 3.70868V6.95501H117.938H117.941Z" fill="white"/>
                <path d="M95.9022 19.3682L94.1268 16.042H83.4215L81.6495 19.3682L77.517 19.3516L87.2881 1.69965H90.36L99.9582 19.3682H95.9088H95.9022ZM88.8041 6.017L85.1071 12.9188H92.4412L88.8041 6.017Z" fill="white"/>
                <path d="M150.193 2.22854V4.31736H149.558V2.22854H148.78V1.70966H150.961V2.22854H150.193ZM153.405 4.31736C153.405 4.1444 153.428 2.39152 153.428 2.39152L152.87 4.31736H152.281L151.746 2.36824C151.746 2.36824 151.786 4.10449 151.786 4.31736H151.191V1.70966H152.045L152.604 3.58561L153.146 1.70966H154V4.31736H153.405Z" fill="white"/>
                <path d="M143.863 1.7063H139.445L133.261 9.08705L127.081 1.7063H122.662L131.496 12.2502V19.3582H135.04V12.2402L143.863 1.7063Z" fill="white"/>
                <path d="M57.3564 1.7063V1.70962V19.3682H75.1332V15.7926H60.9105V12.3201H75.1332V8.7511H60.9105V5.27859H75.1332V1.70962V1.7063H57.3564Z" fill="white"/>
                <path d="M108.439 41.7766V24.1479H112.003V38.2275H125.265V41.7766H108.439Z" fill="white"/>
                <path d="M106.059 24.1479H102.492V41.7732H106.059V24.1479Z" fill="white"/>
                <path d="M96.5438 24.1479V38.2275H84.0233V24.1479H80.4559V39.8407C81.2605 40.6024 81.7093 41.0315 82.5139 41.7965H98.0532C98.8544 41.0315 100.111 39.8407 100.111 39.8407V24.1479H96.5438Z" fill="white"/>
                <path d="M78.0755 32.1008H76.2204L77.0848 31.1827V26.0771L75.2562 24.1346L57.3531 24.1479V41.8065L75.2729 41.7965L78.0722 38.8229V32.1008H78.0755ZM73.9231 38.2276H60.9138V34.6586H74.9371V37.1399L73.9231 38.2276ZM60.9138 31.0896V27.7235H73.9463V29.9354L73.9297 29.9554L72.8559 31.0929H60.9138V31.0896Z" fill="white"/>
                <path d="M145.565 24.1446L127.646 24.1346V41.8131L145.565 41.8032L148.78 38.4138V27.5339L145.565 24.1446ZM145.625 36.7474L144.219 38.2276H131.2V27.7136H144.209L145.622 29.2037V36.7474H145.625Z" fill="white"/>
              </g>
              <defs>
                <clipPath id="clip0_56_327">
                  <rect width="154" height="43.4962" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-lg font-semibold text-[#F3F4F4] font-zonapro">Admin Panel</h2>
            <p className="text-sm text-gray-400 font-zonapro">Welcome, {username}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2 font-zonapro">Navigation</h3>
                          <Link 
                href="/" 
                className="flex items-center gap-3 px-4 py-3 text-[#F3F4F4] hover:bg-[#DD4726]/10 hover:text-[#DD4726] rounded-xl transition-all duration-300 text-sm font-medium group cursor-pointer font-zonapro"
              >
              <div className="p-2 bg-gray-700/50 rounded-lg group-hover:bg-[#DD4726]/20 transition-colors duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              Go to Website
            </Link>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2 font-zonapro">Content Management</h3>
            <button 
              onClick={() => setActiveTab('banner')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-[#F3F4F4] hover:bg-[#DD4726]/10 hover:text-[#DD4726] rounded-xl transition-all duration-300 text-sm font-medium group cursor-pointer font-zonapro ${
                activeTab === 'banner' ? 'bg-[#DD4726]/20 text-[#DD4726] border border-[#DD4726]/30' : ''
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors duration-300 ${
                activeTab === 'banner' ? 'bg-[#DD4726]/20' : 'bg-gray-700/50 group-hover:bg-[#DD4726]/20'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              Banners
            </button>
            <button 
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-[#F3F4F4] hover:bg-[#DD4726]/10 hover:text-[#DD4726] rounded-xl transition-all duration-300 text-sm font-medium group cursor-pointer font-zonapro ${
                activeTab === 'services' ? 'bg-[#DD4726]/20 text-[#DD4726] border border-[#DD4726]/30' : ''
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors duration-300 ${
                activeTab === 'services' ? 'bg-[#DD4726]/20' : 'bg-gray-700/50 group-hover:bg-[#DD4726]/20'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              Services
            </button>
            <button 
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-[#F3F4F4] hover:bg-[#DD4726]/10 hover:text-[#DD4726] rounded-xl transition-all duration-300 text-sm font-medium group cursor-pointer font-zonapro ${
                activeTab === 'projects' ? 'bg-[#DD4726]/20 text-[#DD4726] border border-[#DD4726]/30' : ''
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors duration-300 ${
                activeTab === 'projects' ? 'bg-[#DD4726]/20' : 'bg-gray-700/50 group-hover:bg-[#DD4726]/20'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              Projects
            </button>
            <button 
              onClick={() => setActiveTab('woods')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-[#F3F4F4] hover:bg-[#DD4726]/10 hover:text-[#DD4726] rounded-xl transition-all duration-300 text-sm font-medium group cursor-pointer font-zonapro ${
                activeTab === 'woods' ? 'bg-[#DD4726]/20 text-[#DD4726] border border-[#DD4726]/30' : ''
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors duration-300 ${
                activeTab === 'woods' ? 'bg-[#DD4726]/20' : 'bg-gray-700/50 group-hover:bg-[#DD4726]/20'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m-6 0h6m-6 0a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V6a2 2 0 00-2-2m-6 0V2a1 1 0 011-1h4a1 1 0 011 1v2" />
                </svg>
              </div>
              Woods
            </button>
            <button 
              onClick={() => setActiveTab('social-media')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-[#F3F4F4] hover:bg-[#DD4726]/10 hover:text-[#DD4726] rounded-xl transition-all duration-300 text-sm font-medium group cursor-pointer font-zonapro ${
                activeTab === 'social-media' ? 'bg-[#DD4726]/20 text-[#DD4726] border border-[#DD4726]/30' : ''
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors duration-300 ${
                activeTab === 'social-media' ? 'bg-[#DD4726]/20' : 'bg-gray-700/50 group-hover:bg-[#DD4726]/20'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m-6 0h6m-6 0a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V6a2 2 0 00-2-2m-6 0V2a1 1 0 011-1h4a1 1 0 011 1v2" />
                </svg>
              </div>
              Social Media
            </button>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-red-900/20 hover:text-red-400 rounded-xl transition-all duration-300 border border-gray-700 hover:border-red-700 text-sm font-medium group cursor-pointer font-zonapro"
          >
            <div className="p-2 bg-gray-700/50 rounded-lg group-hover:bg-red-900/20 transition-colors duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#F3F4F4] mb-2 font-zonapro">Welcome to Admin Panel</h1>
            <p className="text-gray-400 font-zonapro">You have successfully signed in to the EasyBuild administration system.</p>
          </div>

          {/* Tab Content */}
          {activeTab === 'dashboard' && (
            <div className="bg-[#2A2A2A] rounded-lg p-8 border border-gray-700 text-center">
              <div className="w-20 h-20 bg-[#DD4726] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#F3F4F4] mb-4 font-zonapro">Authentication Successful!</h2>
              <p className="text-gray-400 mb-6 font-zonapro">You are now logged in as an administrator.</p>
              <Link 
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#DD4726] hover:bg-[#B83A1E] text-white rounded-lg transition-colors duration-300 font-zonapro"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go to Website
              </Link>
            </div>
          )}

          {activeTab === 'banner' && (
            <div className="bg-[#2A2A2A] rounded-lg border border-gray-700">
              <BannerManager />
            </div>
          )}

          {activeTab === 'services' && (
            <div className="bg-[#2A2A2A] rounded-lg border border-gray-700">
              <ServiceManager />
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="bg-[#2A2A2A] rounded-lg border border-gray-700">
              <ProjectManager />
            </div>
          )}

          {activeTab === 'woods' && (
            <div className="bg-[#2A2A2A] rounded-lg border border-gray-700">
              <WoodsManager />
            </div>
          )}

          {activeTab === 'social-media' && (
            <div className="bg-[#2A2A2A] rounded-lg border border-gray-700">
              <SocialMediaManager />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
