'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

interface StepByStepData {
  title: {
    en: string;
    de: string;
    al: string;
  };
  description: {
    en: string;
    de: string;
    al: string;
  };
  images: string[];
}

const StepByStep = () => {
  const { t, i18n } = useTranslation();
  const [stepByStepData, setStepByStepData] = useState<StepByStepData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStepByStepData();
  }, []);

  const fetchStepByStepData = async () => {
    try {
      const response = await fetch('/api/step-by-step');
      const data = await response.json();
      
      if (data.success && data.data) {
        const images = Array.isArray(data.data.images)
          ? data.data.images
          : Object.values(data.data.images || {}).filter((val: unknown): val is string => typeof val === 'string');
        setStepByStepData({ ...data.data, images });
      }
    } catch (error) {
      console.error('Error fetching step by step data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get current language
  const currentLang = i18n.language as 'en' | 'de' | 'al';

  // Fallback to English if current language is not available
  const getTitle = () => {
    if (!stepByStepData || !stepByStepData.title) return t('step_by_step');
    return stepByStepData.title[currentLang] || stepByStepData.title.en || t('step_by_step');
  };

  const getDescription = () => {
    if (!stepByStepData || !stepByStepData.description) return t('step_by_step_description');
    return stepByStepData.description[currentLang] || stepByStepData.description.en || t('step_by_step_description');
  };

  const images = stepByStepData?.images ?? [];
  const safeImages = (images.length
    ? images
    : ['/assets/step1.png', '/assets/step2.png', '/assets/step3.png']
  ).slice(0, 9); // show up to 9 items in grid

  // Show loading state
  if (isLoading) {
    return (
      <div className='w-full lg:px-[50px] 2xl:px-[110px] mt-16 lg:mt-32 px-5'>
        <div className='w-full flex flex-col lg:flex-row lg:gap-12'>
          {/* Left: Text Content */}
          <div className='w-full lg:w-1/2 flex flex-col justify-center'>
            <p className='text-[#DD4624] text-[18px] font-zonapro'>{t('services')}</p>
            <p className='text-[32px] lg:text-[64px] font-custom1 font-zonapro mt-2'>{t('step_by_step')}</p>
            <div className='w-full text-[16px] lg:text-[18px] font-custom tracking-tight lg:tracking-normal leading-[22.7px] font-normal text-[#191716] mt-4'>
              <p className="font-zonapro">{t('step_by_step_description')}</p>
            </div>
          </div>
          {/* Right: Images Grid */}
          <div className='w-full lg:w-1/2 mt-8 lg:mt-0 flex justify-center items-center'>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DD4624]"></div>
          </div>
        </div>
      </div>
    );
  }

  // If no data is available, show fallback content
  if (!stepByStepData) {
    return (
      <div className='w-full lg:px-[50px] 2xl:px-[110px] mt-16 lg:mt-32 px-5'>
        <div className='w-full flex flex-col lg:flex-row lg:gap-12'>
          {/* Left: Text Content */}
          <div className='w-full lg:w-1/2 flex flex-col justify-center'>
            <p className='text-[#DD4624] text-[18px] font-zonapro'>{t('services')}</p>
            <p className='text-[32px] lg:text-[64px] font-custom1 font-zonapro mt-2'>{t('step_by_step')}</p>
            <div className='w-full text-[16px] lg:text-[18px] font-custom tracking-tight lg:tracking-normal leading-[22.7px] font-normal text-[#191716] mt-4'>
              <p className="font-zonapro">{t('step_by_step_description')}</p>
            </div>
          </div>
          {/* Right: 9 Images Grid */}
          <div className='w-full lg:w-1/2 mt-8 lg:mt-0'>
            <div className='grid grid-cols-3 gap-3 lg:gap-4'>
              {safeImages.map((image, idx) => (
                <div
                  key={idx}
                  className='relative aspect-square rounded-[15px] overflow-hidden border border-[#191716]/10 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300'
                >
                  <Image 
                    src={image} 
                    alt={`Step ${idx + 1}`} 
                    fill
                    className='object-contain'
                  />
                  <div className='absolute bottom-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-zonapro text-[#191716] shadow'>
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full lg:px-[50px] 2xl:px-[110px] mt-16 lg:mt-32 px-5'>
      <div className='w-full flex flex-col lg:flex-row lg:gap-12'>
        {/* Left: Text Content */}
        <div className='w-full lg:w-1/2 flex flex-col justify-center'>
          <p className='text-[#DD4624] text-[18px] font-zonapro'>{t('services')}</p>
          <p className='text-[32px] lg:text-[64px] font-custom1 font-zonapro mt-2'>{getTitle()}</p>
          <div className='w-full text-[16px] lg:text-[18px] font-custom tracking-tight lg:tracking-normal leading-[22.7px] font-normal text-[#191716] mt-4'>
            <p className="font-zonapro">{getDescription()}</p>
          </div>
        </div>

        {/* Right: 9 Images Grid */}
        <div className='w-full lg:w-1/2 mt-8 lg:mt-0'>
          <div className='grid grid-cols-3 gap-3 lg:gap-4'>
            {safeImages.map((image, idx) => (
              <div
                key={idx}
                className='relative h-62 rounded-[15px] overflow-hidden border border-[#191716]/10 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300'
              >
                <Image 
                  src={image} 
                  alt={`Step ${idx + 1}`} 
                  fill
                  className='object-cover'
                />
                <div className='absolute bottom-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-zonapro text-[#191716] shadow'>
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StepByStep
