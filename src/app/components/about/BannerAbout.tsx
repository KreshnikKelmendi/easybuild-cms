'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SplitType from 'split-type';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

const BannerAbout = () => {
  const { t } = useTranslation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const textRef = useRef(null);
  const headingRef = useRef(null);

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

  return (
    <div className='w-full relative h-fit lg:h-[665px] flex flex-col lg:flex-row items-center bg-uberuns'>
      {/* Image Section - Left Side with Text Overlay */}
      <div className='lg:w-1/2 w-full h-[45vh] lg:h-[665px] relative '>
        <Image
          className='w-full h-full object-cover banner-image'
          src="/assets/aboutBannerImage.png"
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
              {t('aboutUs')}
            </p>
            <p
              className='lg:w-[500px] text-[16px] lg:text-[18px] font-custom font-medium leading-[21.15px] mx-auto font-zonapro'
              ref={textRef}
            >
              {t('secondBannerAbout')}
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
          <source src="/assets/EASY_BUILD_1 (1).mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default BannerAbout;
