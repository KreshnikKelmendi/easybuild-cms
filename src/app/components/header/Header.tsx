'use client';

import React, { useEffect, useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const Header = () => {
  const [nav, setNav] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const [isFixed, setFixed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let prevScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > prevScrollY && isFixed) {
        // Scrolling down and header is fixed
        setFixed(false);
      } else if (currentScrollY <= prevScrollY && !isFixed) {
        // Scrolling up and header is not fixed
        setFixed(true);
      }

      prevScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isFixed]);

  const handleNav = () => {
    setNav(!nav);
    window.scrollTo(0, 0);
  };

  const changeLanguage = (lng: string) => {
    setLoading(true);
    setTimeout(() => {
      i18n.changeLanguage(lng).finally(() => setLoading(false));
    }, 1000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  // Hide header on signin page and dashboard
  if (pathname === '/signin' || pathname === '/dashboard') {
    return null;
  }

  return (
    <div className={`w-full top-0 z-50 flex justify-center items-center h-24 lg:h-[127px] mx-auto px-5 text-[#F3F4F4] bg-[#191716] ${
      isFixed ? 'sticky top-0 left-0 right-0 w-full z-50 flex justify-center items-center h-24 lg:h-[127px] mx-auto px-5 text-[#F3F4F4] bg-[#191716]' : ''
    }`}>
      {/* Logo and navigation for large devices */}
      <div className='hidden lg:flex justify-center items-center space-x-2 relative'>
        {/* Left-side navigation links */}
        <ul className='flex items-center lg:space-x-[70px] 2xl:space-x-[160px] text-[18px] uppercase font-custom font-light'>
          <Link href="/" onClick={scrollToTop} className='cursor-pointer duration-300 hover:text-[#DD4624]'>
            {t('Home')}
          </Link>
          <Link href="/about" onClick={scrollToTop} className='cursor-pointer duration-300 hover:text-[#DD4624]'>
            {t('About')}
          </Link>
          <Link href="/services" onClick={scrollToTop} className='cursor-pointer duration-300 hover:text-[#DD4624]'>
            {t('Services')}
          </Link>
          <Link href="/" onClick={scrollToTop}>
            <svg width="154" height="44" viewBox="0 0 154 44" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          </Link>

          <Link href="/projects" onClick={scrollToTop} className='cursor-pointer duration-300 hover:text-[#DD4624]'>
            {t('Projects')}
          </Link>
          <Link href="/contact" onClick={scrollToTop} className='cursor-pointer duration-300 hover:text-[#DD4624]'>
            {t('Contact')}
          </Link>
          <div className="relative group">
            <button className="flex items-center gap-2 cursor-pointer duration-300 hover:text-[#DD4726] uppercase text-sm">
              <Image 
                src={`https://flagcdn.com/w20/${i18n.language === 'en' ? 'gb' : i18n.language === 'de' ? 'de' : 'al'}.png`}
                alt={`${i18n.language} flag`}
                width={20}
                height={16}
                className="w-5 h-4 rounded-sm"
              />
              <span>{i18n.language.toUpperCase()}</span>
              <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full right-0 mt-2 bg-[#191716] border border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-[140px] z-50">
              <div className="py-2">
                <button
                  onClick={() => changeLanguage('en')}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-800 transition-colors ${
                    i18n.language === 'en' ? 'text-[#DD4726] bg-gray-800' : 'text-[#F3F4F4]'
                  }`}
                >
                  <Image src="https://flagcdn.com/w20/gb.png" alt="English flag" width={20} height={16} className="w-5 h-4 rounded-sm" />
                  <span>English</span>
                </button>
                <button
                  onClick={() => changeLanguage('de')}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-800 transition-colors ${
                    i18n.language === 'de' ? 'text-[#DD4726] bg-gray-800' : 'text-[#F3F4F4]'
                  }`}
                >
                  <Image src="https://flagcdn.com/w20/de.png" alt="German flag" width={20} height={16} className="w-5 h-4 rounded-sm" />
                  <span>Deutsch</span>
                </button>
                <button
                  onClick={() => changeLanguage('al')}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-800 transition-colors ${
                    i18n.language === 'al' ? 'text-[#DD4726] bg-gray-800' : 'text-[#F3F4F4]'
                  }`}
                >
                  <Image src="https://flagcdn.com/w20/al.png" alt="Albanian flag" width={20} height={16} className="w-5 h-4 rounded-sm" />
                  <span>Shqip</span>
                </button>
                
                {/* Divider */}
                <div className="border-t border-gray-700 my-2"></div>
                
                {/* Profile Option */}
                <Link href="/signin" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#F3F4F4] hover:bg-gray-800 hover:text-[#DD4726] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile</span>
                </Link>
              </div>
            </div>
          </div>
          
        </ul>
        
      </div>

      {/* Logo and navigation for mobile devices */}
      <div className='flex lg:hidden justify-between items-center w-full'>
        <Link href="/" onClick={scrollToTop}>
          <svg width="154" height="44" viewBox="0 0 154 44" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        </Link>
        <div onClick={handleNav}>
          {nav ? <AiOutlineClose size={30} color='#F3F4F4' /> : <AiOutlineMenu size={30} color='#F3F4F4' />}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <ul className={
        nav
          ? 'fixed lg:hidden font-custom1 text-2xl left-0 top-0 w-full h-full bg-[#191716] mt-3 z-50'
          : ' w-[100%] fixed top-0 bottom-0 left-[-100%]'
        }>
        {/* Mobile Logo and Close Icon */}
        <div className='flex justify-between items-center mx-4 my-2'>
          <svg width="154" height="44" viewBox="0 0 154 44" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <AiOutlineClose color='#F3F4F4' size={30} onClick={handleNav} className='cursor-pointer' />
        </div>
        
        {/* Mobile Navigation Items */}
        <div className='flex flex-col h-screen justify-center items-center mt-[-65px] text-[#F3F4F4] uppercase'>
          <Link onClick={handleNav} href="/" className='p-4 text-center hover:text-black cursor-pointer border-gray-600'>
            {t('Home')}
          </Link>
          <Link onClick={handleNav} href="/about" className='p-4 text-center hover:text-black cursor-pointer border-gray-600'>
            {t('About')}
          </Link>
          <Link onClick={handleNav} href="/services" className='p-4 text-center hover:text-black cursor-pointer border-gray-600'>
            {t('Services')}
          </Link>
          <Link onClick={handleNav} href="/projects" className='p-4 text-center hover:text-black cursor-pointer border-gray-600'>
            {t('Projects')}
          </Link>
          <Link onClick={handleNav} href="/contact" className='p-4 text-center hover:text-black cursor-pointer border-gray-600'>
            {t('Contact')}
          </Link>
          <div className='mt-16'>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  changeLanguage('en');
                  handleNav();
                }}
                className={`px-3 py-2 rounded-md transition-colors ${
                  i18n.language === 'en' 
                    ? 'text-[#DD4726] bg-gray-800' 
                    : 'text-[#F3F4F4] hover:text-[#DD4726]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => {
                  changeLanguage('de');
                  handleNav();
                }}
                className={`px-3 py-2 rounded-md transition-colors ${
                  i18n.language === 'de' 
                    ? 'text-[#DD4726] bg-gray-800' 
                    : 'text-[#F3F4F4] hover:text-[#DD4726]'
                }`}
              >
                DE
              </button>
              <button
                onClick={() => {
                  changeLanguage('al');
                  handleNav();
                }}
                className={`px-3 py-2 rounded-md transition-colors ${
                  i18n.language === 'al' 
                    ? 'text-[#DD4726] bg-gray-800' 
                    : 'text-[#F3F4F4] hover:text-[#DD4726]'
                }`}
              >
                AL
              </button>
            </div>
            
            {/* Mobile User Icon */}
            <div className="mt-8 flex justify-center">
              <Link href="/signin" className="flex items-center justify-center w-12 h-12 rounded-full bg-[#DD4726] hover:bg-[#B83A1E] transition-colors duration-300 cursor-pointer">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </ul>
      
      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DD4726]"></div>
        </div>
      )}
    </div>
  );
};

export default Header;
