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
  images: {
    step1: string;
    step2: string;
    step3: string;
  };
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
        setStepByStepData(data.data);
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

  // Safe image getter with fallbacks
  const getImageSrc = (step: 'step1' | 'step2' | 'step3') => {
    if (!stepByStepData || !stepByStepData.images) {
      return `/assets/${step}.png`;
    }
    return stepByStepData.images[step] || `/assets/${step}.png`;
  };

  // Show loading state or fallback content
  if (isLoading) {
    return (
      <div className='w-full lg:px-[50px] 2xl:px-[110px] mt-16 lg:mt-32 px-5'>
        <div className='w-full flex flex-col lg:flex-row lg:justify-between'>
          <div className='flex flex-col justify-center'>
            <p className='text-[#DD4624] text-[18px] font-zonapro'>{t('services')}</p>
            <p className='text-[32px] lg:text-[64px] font-custom1 font-zonapro'>{t('step_by_step')}</p>
            <div className='lg:w-[601px] w-full text-[16px] lg:text-[18px] font-custom lg:text-left tracking-tight lg:tracking-normal leading-[22.7px] font-normal text-[#191716]'>
              <p className="font-zonapro">{t('step_by_step_description')}</p>
            </div>
          </div>
          <div className='flex justify-center items-center mt-6 lg:mt-0'>
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
        <div className='w-full flex flex-col lg:flex-row lg:justify-between'>
          <div className='flex flex-col justify-center'>
            <p className='text-[#DD4624] text-[18px] font-zonapro'>{t('services')}</p>
            <p className='text-[32px] lg:text-[64px] font-custom1 font-zonapro'>{t('step_by_step')}</p>
            <div className='lg:w-[601px] w-full text-[16px] lg:text-[18px] font-custom lg:text-left tracking-tight lg:tracking-normal leading-[22.7px] font-normal text-[#191716]'>
              <p className="font-zonapro">{t('step_by_step_description')}</p>
            </div>
          </div>
          <div className='lg:hidden flex overflow-x-scroll mt-6'>
            <div className='flex flex-nowrap'>
              <Image 
                src="/assets/step1.png" 
                alt="Step 1" 
                width={292} 
                height={447} 
                className='w-[292px] h-[447px] object-cover rounded-[15px] mr-4' 
              />
              <Image 
                src="/assets/step2.png" 
                alt="Step 2" 
                width={292} 
                height={447} 
                className='w-[292px] h-[447px] object-cover rounded-[15px] mr-4' 
              />
              <Image 
                src="/assets/step3.png" 
                alt="Step 3" 
                width={292} 
                height={447} 
                className='w-[292px] h-[447px] object-cover rounded-[15px]' 
              />
            </div>
          </div>
          <div className='hidden lg:grid lg:grid-cols-3 gap-4 mt-6 lg:mt-0'>
            <Image 
              src="/assets/step1.png" 
              alt="Step 1" 
              width={292} 
              height={447} 
              className='w-full h-96 lg:w-[292px] lg:h-[447px] object-cover rounded-[15px]' 
            />
            <Image 
              src="/assets/step2.png" 
              alt="Step 2" 
              width={292} 
              height={447} 
              className='w-full h-96 lg:w-[292px] lg:h-[447px] object-cover rounded-[15px]' 
            />
            <Image 
              src="/assets/step3.png" 
              alt="Step 3" 
              width={292} 
              height={447} 
              className='w-full h-96 lg:w-[292px] lg:h-[447px] object-cover rounded-[15px]' 
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full lg:px-[50px] 2xl:px-[110px] mt-16 lg:mt-32 px-5'>
      <div className='w-full flex flex-col lg:flex-row lg:justify-between'>
        <div className='flex flex-col justify-center'>
          <p className='text-[#DD4624] text-[18px] font-zonapro'>{t('services')}</p>
          <p className='text-[32px] lg:text-[64px] font-custom1 font-zonapro'>{getTitle()}</p>
          <div className='lg:w-[601px] w-full text-[16px] lg:text-[18px] font-custom lg:text-left tracking-tight lg:tracking-normal leading-[22.7px] font-normal text-[#191716]'>
            <p className="font-zonapro">{getDescription()}</p>
          </div>
        </div>

        <div className='lg:hidden flex overflow-x-scroll mt-6'>
          <div className='flex flex-nowrap'>
            <Image 
              src={getImageSrc('step1')} 
              alt="Step 1" 
              width={292} 
              height={447} 
              className='w-[292px] h-[447px] object-cover rounded-[15px] mr-4' 
            />
            <Image 
              src={getImageSrc('step2')} 
              alt="Step 2" 
              width={292} 
              height={447} 
              className='w-[292px] h-[447px] object-cover rounded-[15px] mr-4' 
            />
            <Image 
              src={getImageSrc('step3')} 
              alt="Step 3" 
              width={292} 
              height={447} 
              className='w-[292px] h-[447px] object-cover rounded-[15px]' 
            />
          </div>
        </div>

        <div className='hidden lg:grid lg:grid-cols-3 gap-4 mt-6 lg:mt-0'>
          <Image 
            src={getImageSrc('step1')} 
            alt="Step 1" 
            width={292} 
            height={447} 
            className='w-full h-96 lg:w-[292px] lg:h-[447px] object-cover rounded-[15px]' 
          />
          <Image 
            src={getImageSrc('step2')} 
            alt="Step 2" 
            width={292} 
            height={447} 
            className='w-full h-96 lg:w-[292px] lg:h-[447px] object-cover rounded-[15px]' 
          />
          <Image 
            src={getImageSrc('step3')} 
            alt="Step 3" 
            width={292} 
            height={447} 
            className='w-full h-96 lg:w-[292px] lg:h-[447px] object-cover rounded-[15px]' 
          />
        </div>
      </div>
    </div>
  )
}

export default StepByStep
