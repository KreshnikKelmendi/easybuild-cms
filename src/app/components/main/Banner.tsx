'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import SplitType from 'split-type';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';

import { useTranslation } from 'react-i18next';
import { toDisplayImageUrl } from '@/lib/blobUrl';

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

  const currentLang = i18n.language as 'en' | 'de' | 'al';
  const fallbackLang = 'en';

  const getLocalizedContent = (field: { [key: string]: string } | undefined, lang: string) => {
    return field?.[lang] || field?.[fallbackLang] || '';
  };

  const getMobileSubtitle = (text: string, maxLength = 90) => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trim()}...`;
  };

  return (
    <div className="relative w-full h-[70vh] bg-[#191716] lg:h-[800px]">
      {bannerData?.image ? (
        <Image
          src={toDisplayImageUrl(bannerData.image)}
          alt="Banner background"
          fill
          className="object-cover"
          priority
        />
      ) : null}
      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-[#772613] to-[#000000] opacity-50" />

      <div className="absolute top-0 left-0 flex h-full w-full items-center text-white lg:px-[50px] 2xl:px-[100px]">
        <div ref={ref}>
          {!isLoading &&
            (bannerData ? (
              <>
                <h1
                  ref={titleRef}
                  className="px-5 font-zonapro text-4xl font-bold lg:w-[1061px] lg:text-[85px] lg:leading-[99.87px]"
                >
                  {getLocalizedContent(bannerData.title, currentLang)}
                </h1>
                <p className="mt-8 w-full px-5 font-zonapro text-[18px] leading-[21.15px] tracking-tighter lg:w-[651px] lg:text-justify">
                  <span className="lg:hidden">
                    {getMobileSubtitle(getLocalizedContent(bannerData.subtitle, currentLang))}
                  </span>
                  <span className="hidden lg:inline">
                    {getLocalizedContent(bannerData.subtitle, currentLang)}
                  </span>
                </p>
                <div className="mt-10 flex flex-col gap-x-4 gap-y-4 px-5 lg:flex-row">
                  <Link
                    href="/projects"
                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                  >
                    <button
                      type="button"
                      className="w-full rounded-[8px] bg-[#191716] py-3 font-zonapro text-white hover:bg-[#DD4624] hover:duration-500 lg:w-[200px]"
                    >
                      {t('firstButton')}
                    </button>
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                  >
                    <button
                      type="button"
                      className="w-full rounded-[8px] bg-[#DD4724] px-8 py-3 font-zonapro text-white hover:bg-[#191716] hover:duration-500 lg:w-[220px]"
                    >
                      {t('secondButton')}
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center">
                <h1 className="px-5 font-zonapro text-4xl font-bold lg:w-[1061px] lg:text-[85px] lg:leading-[99.87px]">
                  {t('firstBanner')}
                </h1>
                <p className="mt-8 w-full px-5 font-zonapro text-[18px] leading-[21.15px] tracking-tighter lg:w-[651px] lg:text-justify">
                  <span className="lg:hidden">{getMobileSubtitle(t('secondBanner'))}</span>
                  <span className="hidden lg:inline">{t('secondBanner')}</span>
                </p>
                <div className="mt-10 flex flex-col gap-x-4 gap-y-4 px-5 lg:flex-row">
                  <Link
                    href="/projects"
                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                  >
                    <button
                      type="button"
                      className="w-full rounded-[8px] bg-[#191716] py-3 font-zonapro text-white hover:bg-[#DD4624] hover:duration-500 lg:w-[200px]"
                    >
                      {t('firstButton')}
                    </button>
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                  >
                    <button
                      type="button"
                      className="w-full rounded-[8px] bg-[#DD4724] px-8 py-3 font-zonapro text-white hover:bg-[#191716] hover:duration-500 lg:w-[220px]"
                    >
                      {t('secondButton')}
                    </button>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
