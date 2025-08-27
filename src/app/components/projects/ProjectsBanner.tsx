'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useInView } from 'react-intersection-observer';
import SplitType from 'split-type';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const ProjectsBanner = () => {
  const { t } = useTranslation();
  const { ref: bannerRef, inView: bannerInView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const titleRef = useRef<HTMLParagraphElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (bannerInView && titleRef.current && textRef.current) {
      const splitTitle = new SplitType(titleRef.current, { types: 'words' });
      const splitText = new SplitType(textRef.current, { types: 'lines' });

      gsap.from(splitTitle.words, {
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
        '.service-image',
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
  }, [bannerInView]);

  return (
    <div
      ref={bannerRef}
      className='lg:h-[556px] bg-[#DD4624] px-4 lg:px-[50px] 2xl:px-[100px]'
    >
      <div className='flex flex-col lg:flex-row items-center'>
        <div className='lg:w-1/2 text-white'>
          <p
            ref={titleRef}
            className='text-[32px] lg:text-[85px] font-custom1 font-zonapro'
          >
            {t('Projects')}
          </p>
          <p
            ref={textRef}
            className='lg:text-[18px] 2xl:w-[651px] leading-[21.15px] font-custom mt-4 font-zonapro'
          >
            {t('projects_desc1')}
          </p>
        </div>

        <div className='lg:w-1/2 2xl:mr-[50px] py-12'>
          <div className='relative w-full lg:h-[449px] service-image'>
            <Image
              src="/assets/image1.png"
              alt="Projects Banner"
              fill
              className='object-contain'
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsBanner;
