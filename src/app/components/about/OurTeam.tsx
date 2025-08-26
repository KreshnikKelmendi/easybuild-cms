'use client'
import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const OurTeam = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col lg:flex-row items-center px-5 lg:px-[60px] 2xl:px-[120px] mt-16 lg:mt-28">
      <div 
        className="bg-[#DD4624] w-full text-white p-8 z-10 lg:h-[463px] rounded-[15px] flex items-center lg:mr-[-20%]"
      >
        <div className='lg:pl-8'>
          <h2 className="text-[32px] lg:text-[64px] font-custom1 font-extrabold text-[#191716]">{t('ourTeam')}</h2>
          <div className='lg:w-[675px] text-[18px] text-[#F3F4F4] font-custom mt-6'>
            <p>{t('firstDescriptionTeam')}</p>
            <p className="mt-4">{t('secondDescriptionTeam')}</p>
          </div>
        </div>
      </div>
      <div className='w-full'>
        <Image 
          src="/assets/ourteam1.png"
          alt="Team" 
          width={1067}
          height={874}
          className="lg:w-[1067px] lg:h-[874px] object-cover rounded-[15px]"
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

export default OurTeam;
