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

const BannerSpinner = ({ label }: { label: string }) => (
  <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#191716]/50 backdrop-blur-[2px]">
    <div className="flex flex-col items-center gap-4">
      <p className="font-zonapro text-sm uppercase tracking-[0.25em] text-[#F3F4F4] animate-pulse">
        {label}
      </p>
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-[#DD4624]/15" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#DD4624] border-r-[#DD4624]/40" />
        <div className="h-3 w-3 animate-pulse rounded-full bg-[#DD4624]" />
      </div>
    </div>
  </div>
);

const Banner = () => {
  const { t, i18n } = useTranslation();
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageReady, setImageReady] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const titleRef = useRef<HTMLHeadingElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const fetchBannerData = async () => {
      try {
        const response = await fetch('/api/banner', {
          priority: 'high',
        } as RequestInit);
        const data = await response.json();

        if (!cancelled && data.success && data.data) {
          setBannerData(data.data);
        }
      } catch (error) {
        console.error('Error fetching banner data:', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchBannerData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !bannerData?.image) {
      setImageReady(true);
    } else if (bannerData?.image) {
      setImageReady(false);
    }
  }, [isLoading, bannerData?.image]);

  useEffect(() => {
    if (!inView || !titleRef.current || animatedRef.current) return;
    if (isLoading || (bannerData?.image && !imageReady)) return;

    animatedRef.current = true;
    const splitText = new SplitType(titleRef.current);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(
      splitText.chars,
      { opacity: 0, y: '+=50', skewY: 10 },
      { opacity: 1, y: 0, skewY: 0, stagger: 0.05, duration: 0.8 }
    );
  }, [inView, bannerData, isLoading, imageReady]);

  const currentLang = i18n.language as 'en' | 'de' | 'al';
  const fallbackLang = 'en';

  const getLocalizedContent = (field: { [key: string]: string } | undefined, lang: string) => {
    return field?.[lang] || field?.[fallbackLang] || '';
  };

  const getMobileSubtitle = (text: string, maxLength = 88) => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trim()}...`;
  };

  const title = bannerData
    ? getLocalizedContent(bannerData.title, currentLang)
    : t('firstBanner');

  const subtitle = bannerData
    ? getLocalizedContent(bannerData.subtitle, currentLang)
    : t('secondBanner');

  const showSpinner = isLoading || (Boolean(bannerData?.image) && !imageReady);

  return (
    <div className="relative h-screen w-full bg-[#191716] lg:h-screen">
      {bannerData?.image ? (
        <Image
          src={toDisplayImageUrl(bannerData.image)}
          alt="Banner background"
          fill
          className={`object-cover transition-opacity duration-500 ${imageReady ? 'opacity-100' : 'opacity-0'}`}
          priority
          onLoad={() => setImageReady(true)}
          onError={() => setImageReady(true)}
        />
      ) : null}

      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-[#772613] to-[#000000] opacity-50" />

      {showSpinner && <BannerSpinner label={t('loading')} />}

      <div className="absolute top-0 left-0 flex h-full w-full items-end pb-32 text-white sm:pb-24 lg:items-center lg:pb-0 lg:px-[50px] 2xl:px-[100px]">
        <div
          ref={ref}
          className={`w-full transition-opacity duration-500 lg:w-auto ${showSpinner ? 'opacity-0' : 'opacity-100'}`}
        >
          <h1
            ref={titleRef}
            className="px-5 font-zonapro text-4xl font-bold lg:w-[1061px] lg:text-[85px] lg:leading-[99.87px]"
          >
            {title}
          </h1>
          <p className="mt-8 w-full px-5 font-zonapro text-[18px] leading-[21.15px] tracking-tighter lg:w-[651px] lg:text-justify">
            <span className="lg:hidden">{getMobileSubtitle(subtitle)}</span>
            <span className="hidden lg:inline">{subtitle}</span>
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 px-5 lg:flex lg:flex-row">
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
                className="w-full rounded-[8px] bg-[#DD4624] px-8 py-3 font-zonapro text-white hover:bg-[#191716] hover:duration-500 lg:w-[220px]"
              >
                {t('secondButton')}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
