'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import SplitType from 'split-type';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';

import { useTranslation } from 'react-i18next';
import Quality from './Quality';

interface BannerData {
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
}

const Banner = () => {
  const { t, i18n } = useTranslation();
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await fetch('/api/banner');
        const data = await response.json();
        
        if (data.success && data.data) {
          setBannerData(data.data);
        }
      } catch (error) {
        console.error('Error fetching banner data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannerData();
  }, []);



  useEffect(() => {
    if (inView && titleRef.current && bannerData) {
      const splitText = new SplitType(titleRef.current);

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(
        splitText.chars,
        { opacity: 0, y: '+=50', skewY: 10 },
        { opacity: 1, y: 0, skewY: 0, stagger: 0.05, duration: 0.8 }
      );
    }
  }, [inView, bannerData]);

  // Get current language content
  const currentLang = i18n.language as 'en' | 'de' | 'al';
  const fallbackLang = 'en';

  const getLocalizedContent = (field: { [key: string]: string } | undefined, lang: string) => {
    return field?.[lang] || field?.[fallbackLang] || '';
  };

  return (
    <div className='relative w-full h-[70vh] lg:h-[800px] bg-[#191716]'>
      {bannerData?.image ? (
        <Image 
          src={bannerData.image}
          alt='Banner background' 
          fill
          className='object-cover'
          priority
        />
      ) : null}
      <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#772613] to-[#000000] opacity-50'></div>
      

      <div className='absolute top-0 left-0 w-full h-full flex items-center text-white lg:px-[50px] 2xl:px-[100px]'>
        <div ref={ref}>
          {!isLoading && (
            bannerData ? (
              <>
                <h1 ref={titleRef} className='text-4xl lg:text-[85px] font-bold lg:w-[1061px] lg:leading-[99.87px] px-5 font-zonapro'>
                  {getLocalizedContent(bannerData.title, currentLang)}
                </h1>
                <p className='lg:w-[651px] w-full lg:text-justify text-[18px] mt-8 leading-[21.15px] tracking-tighter px-5 font-zonapro'>
                  {getLocalizedContent(bannerData.subtitle, currentLang)}
                </p>
                <div className='flex flex-col lg:flex-row gap-y-4 mt-10 gap-x-4 px-5'>
                  <Link href="/projects" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>
                    <button className='w-full lg:w-[200px] bg-[#191716] py-3 rounded-[8px] hover:bg-[#DD4624] hover:duration-500 text-white font-zonapro'>{t('firstButton')}</button>
                  </Link>
                  <Link href="/contact" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>
                    <button className='px-8 w-full lg:w-[220px] bg-[#DD4624] py-3 rounded-[8px] hover:bg-[#191716] hover:duration-500 text-white font-zonapro'>{t('secondButton')}</button>
                  </Link>
                </div>
              </>
            ) : (
              <div className='text-center'>
                <h1 className='text-4xl lg:text-[85px] font-bold lg:w-[1061px] lg:leading-[99.87px] px-5 font-zonapro'>
                  {t('firstBanner')}
                </h1>
                <p className='lg:w-[651px] w-full lg:text-justify text-[18px] mt-8 leading-[21.15px] tracking-tighter px-5 font-zonapro'>
                  {t('secondBanner')}
                </p>
                <div className='flex flex-col lg:flex-row gap-y-4 mt-10 gap-x-4 px-5'>
                  <Link href="/projects" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>
                    <button className='w-full lg:w-[200px] bg-[#191716] py-3 rounded-[8px] hover:bg-[#DD4624] hover:duration-500 text-white font-zonapro'>{t('firstButton')}</button>
                  </Link>
                  <Link href="/contact" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>
                    <button className='px-8 w-full lg:w-[220px] bg-[#DD4624] py-3 rounded-[8px] hover:bg-[#191716] hover:duration-500 text-white font-zonapro'>{t('secondButton')}</button>
                  </Link>
                </div>
              </div>
            )
          )}
        </div>
        <div className='bg-[#191716] hidden w-full lg:w-[541px] 2xl:w-[541px] lg:h-[260px] p-6 rounded-[15px] lg:flex justify-center items-center absolute lg:right-[60px] 2xl:right-[100px] lg:bottom-[-60px] 2xl:bottom-[-125px] z-40'>
          <Quality />
        </div>
      </div>
    </div>
  );
}

export default Banner;
