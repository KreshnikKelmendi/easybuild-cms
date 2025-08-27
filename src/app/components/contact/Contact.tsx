'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaTiktok, FaWhatsapp, FaTelegram, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { IconType } from 'react-icons';

// Define the social media interface
interface SocialMedia {
  _id: string;
  platform: string;
  icon: string;
  url: string;
  isActive: boolean;
  order: number;
}

const Contact = () => {
  const { t } = useTranslation();
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  // Auto-hide modal after 5 seconds (5000ms)
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
        setSubmitStatus('idle');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
        setShowModal(true);
      } else {
        const errorData = await response.json();
        setSubmitStatus('error');
        setSubmitMessage(errorData.error || 'Failed to send message. Please try again.');
        setShowModal(true);
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
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

  const closeModal = () => {
    setShowModal(false);
    setSubmitStatus('idle');
  };

  return (
    <>
      <div className='w-full flex flex-col lg:flex-row justify-center items-center lg:h-[607px] bg-[#191716] text-[#F3F4F4] px-5 lg:px-[50px] 2xl:px-[110px]'>
        <div className='lg:w-1/2 flex flex-col justify-center h-full'>
          <p className='text-[32px] lg:text-[85px] font-custom1 font-zonapro'>{t('get_in_touch')}</p>
          <p className='2xl:w-[619px] mb-8 text-[18px] font-custom leading-[21.15px] lg:pr-16 2xl:pr-0 font-zonapro'>
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
                {socialMedia.map((social: SocialMedia) => (
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
                <p className='text-sm font-zonapro'>No social media links available. Please add them from the admin panel.</p>
              </li>
            )}
          </ul>
        </div>
        <div className='lg:w-1/2 bg-[#F3F4F4] w-full rounded-[15px] h-[570px] flex flex-col justify-center items-center mt-8 lg:mt-0'>
          <form onSubmit={handleSubmit} className='space-y-16 text-[#191716] w-full px-5 lg:px-10 font-custom'>
            <div className='relative'>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className='peer block w-full bg-[#F3F4F4] border-b-[3px] border-[#191716] py-2 px-3 placeholder-transparent focus:border-transparent focus:outline-none font-zonapro'
                required
                placeholder='Your Name'
              />
              <label
                htmlFor="name"
                className='absolute top-2 mt-[-6px] text-[#191716] duration-300 transform -translate-y-4 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-[20px] font-zonapro'
              >
                Your Name
              </label>
            </div>
            <div className='relative'>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className='peer block w-full bg-[#F3F4F4] border-b-[3px] border-[#191716] py-2 px-3 placeholder-transparent focus:outline-none font-zonapro'
                required
                placeholder='Your Email'
              />
              <label
                htmlFor="email"
                className='absolute top-0 left-0 mt-[-6px] text-[#191716] duration-300 transform -translate-y-4 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-[20px] font-zonapro'
              >
                Your Email
              </label>
            </div>
            <div className='relative'>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className='peer block w-full bg-[#F3F4F4] border-b-[3px] border-[#191716] py-2 px-3 placeholder-transparent focus:outline-none resize-none font-zonapro'
                required
                placeholder='Your Message'
              />
              <label
                htmlFor="message"
                className='absolute top-2 text-[#191716] mt-[-6px] duration-300 transform -translate-y-4 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-[20px] font-zonapro'
              >
                Your Message
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full lg:w-[200px] py-3 rounded-[8px] bg-[#DD4624] hover:duration-500 mt-16 text-[18px] text-[#F3F4F4] font-custom font-zonapro ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#B83A1E]'
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      {/* Success/Error Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={closeModal}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl p-8 mx-4 max-w-md w-full transform transition-all duration-300 scale-100 opacity-100">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <FaTimes size={20} />
            </button>
            
            {/* Icon */}
            <div className="flex justify-center mb-6">
              {submitStatus === 'success' ? (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle size={32} className="text-green-600" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTimes size={32} className="text-red-600" />
                </div>
              )}
            </div>
            
            {/* Title */}
            <h3 className={`text-xl font-semibold text-center mb-4 font-zonapro ${
              submitStatus === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {submitStatus === 'success' ? 'Message Sent!' : 'Error Occurred'}
            </h3>
            
            {/* Message */}
            <p className="text-gray-600 text-center mb-6 font-zonapro leading-relaxed">
              {submitMessage}
            </p>
            
            {/* Action Button */}
            <button
              onClick={closeModal}
              className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 font-zonapro ${
                submitStatus === 'success' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {submitStatus === 'success' ? 'Great!' : 'Try Again'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Contact;
