'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaTiktok, FaWhatsapp, FaTelegram } from 'react-icons/fa';
import { IconType } from 'react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Define the social media interface
interface SocialMedia {
  _id: string;
  platform: string;
  icon: string;
  url: string;
  isActive: boolean;
  order: number;
}

const Footer = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  const fetchSocialMedia = async () => {
    try {
      const response = await fetch('/api/social-media');
      if (response.ok) {
        const data = await response.json();
        setSocialMedia(data);
      }
    } catch (error) {
      console.error('Error fetching social media:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: IconType } = {
      'FaFacebookF': FaFacebookF,
      'FaInstagram': FaInstagram,
      'FaTwitter': FaTwitter,
      'FaLinkedin': FaLinkedin,
      'FaYoutube': FaYoutube,
      'FaTiktok': FaTiktok,
      'FaWhatsapp': FaWhatsapp,
      'FaTelegram': FaTelegram,
    };
    
    const IconComponent = iconMap[iconName];
    if (IconComponent) {
      return <IconComponent size={37} color="#F3F4F4" />;
    }
    return null;
  };

  // Hide footer on signin page and dashboard
  if (pathname === '/signin' || pathname === '/dashboard') {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <footer className='lg:h-[615px] bg-[#191716] text-white px-5 lg:px-[50px] 2xl:px-[120px] py-8 flex flex-col lg:flex-row justify-between items-start lg:items-center mt-[-35px] lg:mt-[-100px]'>
      <div className='flex flex-col lg:flex-row lg:items-start gap-16 lg:gap-24'>
        {/* Logo Section */}
        <div className='flex flex-col lg:items-start mt-16'>
          <svg width="202" height="58" viewBox="0 0 202 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_61_401)">
              <path d="M59.6175 33.1128V49.9753L51.9206 57.2744H0V44.9755H47.0843L59.6175 33.1128Z" fill="#DD4726"/>
              <path d="M55.2697 21.3679L40.953 34.8972H0V22.5982H36.1124L55.2697 4.49658V21.3679Z" fill="#DD4726"/>
              <path d="M44.132 0.221191H0V12.5202H31.1192L44.132 0.221191Z" fill="#DD4726"/>
              <path d="M154.702 9.34414V7.14524H137.35V11.7306H157.135L159.333 14.3527V23.3839C158.396 24.2739 157.881 24.7408 156.948 25.6308H134.777L132.671 23.1047V18.7505H137.35V20.9494H154.702V16.364H134.773L132.667 13.8815V4.71075C133.6 3.82072 134.119 3.3539 135.052 2.46387H157.131L159.329 5.08596V9.34414H154.698H154.702Z" fill="white"/>
              <path d="M125.794 25.6263L123.465 21.2634H109.423L107.099 25.6263L101.678 25.6045L114.495 2.45068H118.524L131.114 25.6263H125.802H125.794ZM116.483 8.11371L111.634 17.1667H121.254L116.483 8.11371Z" fill="white"/>
              <path d="M197.007 3.14448V5.88437H196.174V3.14448H195.153V2.46387H198.014V3.14448H197.007ZM201.219 5.88437C201.219 5.6575 201.25 3.35826 201.25 3.35826L200.517 5.88437H199.745L199.043 3.32772C199.043 3.32772 199.096 5.60514 199.096 5.88437H198.315V2.46387H199.436L200.168 4.92453L200.879 2.46387H202V5.88437H201.219Z" fill="white"/>
              <path d="M188.704 2.45947H182.908L174.797 12.1407L166.69 2.45947H160.894L172.481 16.2898V25.6133H177.13V16.2767L188.704 2.45947Z" fill="white"/>
              <path d="M75.2338 2.45947V2.46384V25.6264H98.5514V20.9363H79.8955V16.3814H98.5514V11.7001H79.8955V7.14521H98.5514V2.46384V2.45947H75.2338Z" fill="white"/>
              <path d="M142.239 55.0188V31.8955H146.914V50.3636H164.309V55.0188H142.239Z" fill="white"/>
              <path d="M139.116 31.8955H134.437V55.0144H139.116V31.8955Z" fill="white"/>
              <path d="M126.635 31.8955V50.3636H110.212V31.8955H105.533V52.4796C106.588 53.4787 107.177 54.0415 108.233 55.045H128.615C129.666 54.0415 131.315 52.4796 131.315 52.4796V31.8955H126.635Z" fill="white"/>
              <path d="M102.411 42.3275H99.9774L101.111 41.1234V34.4263L98.7127 31.8784L75.2294 31.8959V55.0584L98.7345 55.0453L102.406 51.1449V42.3275H102.411ZM96.964 50.364H79.8999V45.6826H98.2941V48.9373L96.964 50.364ZM79.8999 41.0012V36.586H96.9945V39.4873L96.9727 39.5135L95.5642 41.0056H79.8999V41.0012Z" fill="white"/>
              <path d="M190.937 31.8915L167.431 31.8784V55.0671L190.937 55.0541L195.153 50.6083V36.3373L190.937 31.8915ZM191.015 48.4225L189.17 50.364H172.093V36.5729H189.157L191.011 38.5275V48.4225H191.015Z" fill="white"/>
            </g>
            <defs>
              <clipPath id="clip0_61_401">
                <rect width="202" height="57.0534" fill="white" transform="translate(0 0.221191)"/>
              </clipPath>
            </defs>
          </svg>
        </div>

        <div className='lg:ml-16 lg:mt-16'>
          <p className='text-[15px] font-custom font-bold mb-8 text-[#F3F4F4] font-zonapro'>MENU</p>
          <ul className='text-[15px] font-custom font-normal'>
            <Link href="/" onClick={scrollToTop} className='cursor-pointer duration-300 hover:text-[#DD4624]'>
              <li className='mb-8'><span className='hover:text-gray-400 font-zonapro'>{t('Home')}</span></li>
            </Link>
            <Link href="/" onClick={scrollToTop} className='cursor-pointer duration-300 hover:text-[#DD4624]'>
              <li className='mb-8'><span className='hover:text-gray-400 font-zonapro'>{t('About')}</span></li>
            </Link>
            <Link href="/" onClick={scrollToTop} className='cursor-pointer duration-300 hover:text-[#DD4624]'>
              <li className='mb-8'><span className='hover:text-gray-400 font-zonapro'>{t('Services')}</span></li>
            </Link>
            <Link href="/" onClick={scrollToTop} className='cursor-pointer duration-300 hover:text-[#DD4624]'>
              <li className='mb-8'><span className='hover:text-gray-400 font-zonapro'>{t('Projects')}</span></li>
            </Link>
            <Link href="/" onClick={scrollToTop} className='cursor-pointer duration-300 hover:text-[#DD4624]'>
              <li><span className='hover:text-gray-400 font-zonapro'>{t('Contact')}</span></li>
            </Link>
          </ul>
        </div>

        {/* Product Section */}
        <div className='lg:ml-16 lg:mt-16'>
          <p className='text-[15px] font-custom font-bold mb-8 text-[#F3F4F4] font-zonapro'>{t('services')}</p>
          <ul className='space-y-8 text-[15px] font-custom font-normal'>
            <li><span className='hover:text-gray-400 font-zonapro'>{t('title_wooden_frame_construction')}</span></li>
            <li><span className='hover:text-gray-400 font-zonapro'>{t('title_cross_laminated_timber')}</span></li>
            <li><span className='hover:text-gray-400 font-zonapro'>{t('title_modular_construction')}</span></li>
          </ul>
        </div>

        {/* Get in Touch Section */}
        <div className='lg:mt-16'>
          <p className='text-[15px] font-custom font-bold mb-8 text-[#F3F4F4] uppercase font-zonapro'>{t('firstBanner')}</p>
          <ul className='space-y-8 text-[15px] font-custom font-normal'>
            <li><span className='hover:text-gray-400 font-zonapro'>{t('aboutUsDescription')}</span></li>
            <li className='flex gap-10 py-4'>
              {isLoading ? (
                <>
                  <div className='animate-pulse bg-gray-600 w-[64px] h-[64px] rounded-full'></div>
                  <div className='animate-pulse bg-gray-600 w-[64px] h-[64px] rounded-full'></div>
                  <div className='animate-pulse bg-gray-600 w-[64px] h-[64px] rounded-full'></div>
                </>
              ) : socialMedia.length > 0 ? (
                socialMedia.map((social: SocialMedia) => (
                  <a 
                    key={social._id} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className='hover:text-gray-400 hover:bg-[#DD4624] hover:rounded-full flex items-center justify-center w-[64px] h-[64px] transition-all duration-300'
                    title={social.platform}
                  >
                    {getIconComponent(social.icon)}
                  </a>
                ))
              ) : (
                <div className='text-gray-400 text-sm font-zonapro'>No social media links available</div>
              )}
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
