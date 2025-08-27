'use client';

import Image from 'next/image';
import Count from '../main/Count';

import { useTranslation } from 'react-i18next';
import FactoryOperates from './FactoryOperates';

const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className='bg-[#DD4624] lg:h-[1511px] 2xl:h-[1611px] relative z-10'>
        <div className='flex flex-col lg:flex-row px-5 lg:px-[60px] py-16 2xl:px-[120px] lg:py-36'>
          <div className='w-full lg:w-1/2'>
            <Image 
              src="/assets/about1.png" 
              alt='About Us' 
              width={600}
              height={400}
              className='w-full h-full object-cover rounded-[15px]' 
            />
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
        <div className='flex justify-center items-center lg:mt-[-100px]'>
          <Count />
        </div>
      </div>
      <FactoryOperates />
    </>
  );
};

export default AboutUs;
