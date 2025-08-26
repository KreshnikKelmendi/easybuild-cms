'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaTiktok, FaWhatsapp, FaTelegram } from 'react-icons/fa';

const Contact = () => {
  const { t } = useTranslation();
  const [socialMedia, setSocialMedia] = useState([]);
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
    const iconMap: { [key: string]: any } = {
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

  return (
    <div className='w-full flex flex-col lg:flex-row justify-center items-center lg:h-[607px] bg-[#191716] text-[#F3F4F4] px-5 lg:px-[50px] 2xl:px-[110px]'>
      <div className='lg:w-1/2 flex flex-col justify-center h-full'>
        <p className='text-[32px] lg:text-[85px] font-custom1'>{t('get_in_touch')}</p>
        <p className='2xl:w-[619px] mb-8 text-[18px] font-custom leading-[21.15px] lg:pr-16 2xl:pr-0'>
          {t('contact_desc1')}
        </p>
        <ul className='space-y-8 text-[15px] font-custom font-normal lg:mt-14'>
          {isLoading ? (
            <li className='flex gap-10 py-4'>
              <div className='animate-pulse bg-gray-600 w-[37px] h-[37px] rounded'></div>
              <div className='animate-pulse bg-gray-600 w-[37px] h-[37px] rounded'></div>
              <div className='animate-pulse bg-gray-600 w-[37px] h-[37px] rounded'></div>
            </li>
          ) : socialMedia.length > 0 ? (
            <li className='flex gap-10 py-4'>
              {socialMedia.map((social: any) => (
                <a 
                  key={social._id} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className='hover:text-gray-400 transition-colors duration-300'
                  title={social.platform}
                >
                  {getIconComponent(social.icon)}
                </a>
              ))}
            </li>
          ) : (
            <li className='flex gap-10 py-4 text-gray-400'>
              <p className='text-sm'>No social media links available. Please add them from the admin panel.</p>
            </li>
          )}
        </ul>
      </div>
      <div className='lg:w-1/2 bg-[#F3F4F4] w-full rounded-[15px] h-[570px] flex flex-col justify-center items-center mt-8 lg:mt-0'>
        <form className='space-y-16 text-[#191716] w-full px-5 lg:px-10 font-custom'>
          <div className='relative'>
            <input
              type="text"
              id="name"
              name="name"
              className='peer block w-full bg-[#F3F4F4] border-b-[3px] border-[#191716] py-2 px-3 placeholder-transparent focus:border-transparent focus:outline-none'
              required
              placeholder='Your Name'
            />
            <label
              htmlFor="name"
              className='absolute top-2 mt-[-6px] text-[#191716] duration-300 transform -translate-y-4 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-[20px]'
            >
              Your Name
            </label>
          </div>
          <div className='relative'>
            <input
              type="email"
              id="email"
              name="email"
              className='peer block w-full bg-[#F3F4F4] border-b-[3px] border-[#191716] py-2 px-3 placeholder-transparent focus:border-transparent focus:outline-none'
              required
              placeholder='Your Email'
            />
            <label
              htmlFor="email"
              className='absolute top-0 left-0 mt-[-6px] text-[#191716] duration-300 transform -translate-y-4 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-[20px]'
            >
              Your Email
            </label>
          </div>
          <div className='relative'>
            <textarea
              id="message"
              name="message"
              rows={4}
              className='peer block w-full bg-[#F3F4F4] border-b-[3px] border-[#191716] py-2 px-3 placeholder-transparent focus:border-transparent focus:outline-none resize-none'
              required
              placeholder='Your Message'
            />
            <label
              htmlFor="message"
              className='absolute top-2 text-[#191716] mt-[-6px] duration-300 transform -translate-y-4 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-[20px]'
            >
              Your Message
            </label>
          </div>
          <button
            className='w-full lg:w-[200px] py-3 rounded-[8px] bg-[#DD4624] hover:duration-500 mt-16 text-[18px] text-[#F3F4F4] font-custom'
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
