'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AboutUs = () => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of images for the slider
  const images = [
    '/assets/IMG_3864.JPG',
    '/assets/IMG_3865.png',
    '/assets/IMG_3866.JPG',
    '/assets/about1.png',
    '/assets/aboutBannerImage.png',
    '/assets/ourteam1.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <div className='bg-[#DD4624] relative z-10'>
        <div className='flex flex-col lg:flex-row px-5 lg:px-[60px] py-16 2xl:px-[120px] lg:py-36'>
          <div className='w-full lg:w-1/2 relative overflow-hidden rounded-[15px] h-[400px] lg:h-[600px] 2xl:h-[700px]'>
            {images.map((image, index) => (
              <Image 
                key={image}
                src={image} 
                alt={`About Us ${index + 1}`} 
                width={1500}
                height={1500}
                className={`w-full h-full object-cover rounded-[15px] transition-opacity duration-1000 absolute inset-0 min-h-[400px] ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            
            {/* Image indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className='w-full lg:w-1/2 flex flex-col lg:justify-center mt-0 lg:mt-0 lg:pl-[50px] 2xl:pl-[100px] lg:py-5 2xl:py-0'>
            <p className='font-custom1 text-[32px] lg:text-[60px] 2xl:text-[64px] text-[#F3F3F3] lg:leading-[67px] 2xl:leading-[75.2px] mt-6 font-zonapro'>
              {t('aboutUsDescription')}
            </p>
            <p className='text-[18px] font-normal leading-[21.15px] text-[#F3F4F4] w-full 2xl:w-[667px] mt-6 font-zonapro'>
              {t('firstDescription')}
            </p>
            <p className='text-[18px] font-normal leading-[21.15px] text-[#F3F4F4] w-full 2xl:w-[667px] mt-4 font-zonapro'>
              {t('mission_firstDescription')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
