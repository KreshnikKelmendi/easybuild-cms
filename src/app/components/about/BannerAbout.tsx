'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import SplitType from 'split-type';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

interface AboutBannerData {
  title: {
    en: string;
    de: string;
    al: string;
  };
  subtitle: {
    en: string;
    de: string;
    al: string;
  };
  image: string;
  video: string;
}

const BannerAbout = () => {
  const { t, i18n } = useTranslation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const textRef = useRef(null);
  const headingRef = useRef(null);
  const [bannerData, setBannerData] = useState<AboutBannerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch banner data from API
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await fetch('/api/about-banner');
        const data = await response.json();
        
        if (data.success && data.data) {
          setBannerData(data.data);
        } else {
          console.warn('No about banner data found, using fallback');
        }
      } catch (error) {
        console.error('Error fetching about banner:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannerData();
  }, []);

  useEffect(() => {
    if (inView && headingRef.current && textRef.current) {
      const splitHeading = new SplitType(headingRef.current, { types: 'words' });
      const splitText = new SplitType(textRef.current, { types: 'lines' });

      gsap.from(splitHeading.words, {
        opacity: 0,
        y: 90,
        stagger: 0.1,
        duration: 1,
        ease: 'power2.out',
      });

      gsap.from(splitText.lines, {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 1,
        ease: 'power2.out',
      });

      gsap.fromTo(
        '.banner-image',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          delay: 0.5,
          ease: 'power2.out',
        }
      );
    }
  }, [inView]);

  // Get current language or default to 'en'
  const currentLang = i18n.language as 'en' | 'de' | 'al' || 'en';
  
  // Get dynamic content with fallbacks
  const title = bannerData?.title?.[currentLang] || t('aboutUs');
  const subtitle = bannerData?.subtitle?.[currentLang] || t('secondBannerAbout');
  const imageSrc = bannerData?.image || "/assets/aboutBannerImage.png";
  const videoSrc = bannerData?.video || "/assets/EASY_BUILD_1 (1).mp4";

  // Show loading state
  if (isLoading) {
    return (
      <div className='w-full relative h-fit lg:h-[665px] flex flex-col lg:flex-row items-center bg-uberuns'>
        <div className='w-full h-[665px] flex items-center justify-center'>
          <div className='text-white text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
            <p className='font-zonapro'>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full relative h-fit lg:h-[665px] flex flex-col lg:flex-row items-center bg-uberuns'>
      {/* Image Section - Left Side with Text Overlay */}
      <div className='lg:w-1/2 w-full h-[45vh] lg:h-[665px] relative '>
        <Image
          className='w-full h-full object-cover banner-image'
          src={imageSrc}
          alt="About Us Banner"
          width={800}
          height={665}
        />
        {/* Text Overlay */}
        <div className='absolute inset-0 bg-[#191716] flex items-center justify-center'>
          <div ref={ref} className='text-white px-4 lg:px-8'>
            <p
              className='font-custom1 text-[32px] lg:text-[85px] mb-4 capitalize font-zonapro'
              ref={headingRef}
            >
              {title}
            </p>
            <p
              className='lg:w-[500px] text-[16px] lg:text-[18px] font-custom font-medium leading-[21.15px] mx-auto font-zonapro'
              ref={textRef}
            >
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Video Section - Right Side */}
      <div className='lg:w-1/2 w-full h-[50vh] lg:h-[665px]'>
        <video
          className='w-full h-[50vh] lg:h-[665px] object-cover'
          playsInline
          autoPlay
          loop
          muted
          preload="auto"
          controls={false}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default BannerAbout;
