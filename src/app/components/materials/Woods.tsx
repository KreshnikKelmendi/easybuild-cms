'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

interface Wood {
  _id: string;
  title: {
    en: string;
    de: string;
    al: string;
  };
  imageUrl: string;
  isActive: boolean;
  order: number;
}

const Woods = () => {
  const { t, i18n } = useTranslation();
  const [woods, setWoods] = useState<Wood[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWoods();
  }, []);

  const fetchWoods = async () => {
    try {
      const response = await fetch('/api/woods');
      const data = await response.json();
      
      if (data.success) {
        setWoods(data.data);
      }
    } catch (error) {
      console.error('Error fetching woods:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentLanguage = i18n.language as 'en' | 'de' | 'al';

  if (isLoading) {
    return (
      <div className='mt-6 lg:mt-20 flex flex-col items-center text-left lg:text-left mx-auto px-5 lg:px-0'>
        <div className='flex flex-col mb-10'>
          <p className='font-custom text-[#191716] text-left lg:text-center lg:tracking-normal text-[32px] lg:text-[48px] font-semibold font-zonapro'>
            {t('materials_that_we_use')}
          </p>
          <p className='lg:w-[548px] w-full text-left lg:text-center lg:tracking-normal font-custom lg:text-[20px] leading-[23.5px] mt-2 font-zonapro'>
            {t('second_materials_that_we_use')}
          </p>
        </div>
        <div className='flex justify-center items-center mt-6 lg:mt-16'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='mt-6 lg:mt-20 flex flex-col items-center lg:text-left mx-auto px-5 lg:px-0'>
      <div className='flex flex-col mb-10'>
        <p className='font-custom text-[#191716] text-left lg:text-center tracking-tighter lg:tracking-normal text-[32px] lg:text-[48px] font-semibold font-zonapro'>
          {t('materials_that_we_use')}
        </p>
        <p className='lg:w-[548px] w-full text-justify lg:text-center tracking-tighter lg:tracking-normal font-custom lg:text-[20px] leading-[23.5px] mt-2 font-zonapro'>
          {t('second_materials_that_we_use')}
        </p>
      </div>

      {woods.length === 0 ? (
        <div className='text-center mt-6 lg:mt-16'>
          <p className='text-gray-500 font-custom text-lg font-zonapro'>
            {t('no_materials_available')}
          </p>
        </div>
      ) : (
        <div className='grid lg:gap-10 gap-6 grid-cols-3 lg:grid-cols-7 w-full lg:px-16 2xl:px-36 justify-center items-center mt-6 lg:mt-16'>
          {woods.map((wood) => (
            <div key={wood._id} className='flex flex-col justify-center items-center'>
              <Image 
                src={wood.imageUrl} 
                alt={wood.title[currentLanguage]} 
                width={190}
                height={188}
                className='w-28 h-auto lg:w-40 lg:h-auto 2xl:w-[190px] 2xl:h-[188px] object-cover rounded-full' 
              />
              <p className='mt-4 text-center font-custom font-normal text-[24px] w-[140px] lg:w-[150px] 2xl:w-[160px] whitespace-nowrap overflow-hidden text-ellipsis font-zonapro'>
                {wood.title[currentLanguage]}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Woods;
