'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface TeamData {
  title: {
    en: string;
    de: string;
    al: string;
  };
  firstDescription: {
    en: string;
    de: string;
    al: string;
  };
  secondDescription: {
    en: string;
    de: string;
    al: string;
  };
  image: string;
}

const OurTeam = () => {
  const { t, i18n } = useTranslation();
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const response = await fetch('/api/team');
      const data = await response.json();
      
      if (data.success && data.data) {
        setTeamData(data.data);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get current language code
  const currentLang = i18n.language as 'en' | 'de' | 'al';

  // Fallback to translation keys if no dynamic data
  const title = teamData?.title?.[currentLang] || t('ourTeam');
  const firstDescription = teamData?.firstDescription?.[currentLang] || t('firstDescriptionTeam');
  const secondDescription = teamData?.secondDescription?.[currentLang] || t('secondDescriptionTeam');
  const imageSrc = teamData?.image || '/assets/ourteam1.png';

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row items-center px-5 lg:px-[60px] 2xl:px-[120px] mt-16 lg:mt-28">
        <div className="bg-gray-200 w-full h-[463px] rounded-[15px] animate-pulse flex items-center lg:mr-[-20%]">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-500">Loading team section...</div>
          </div>
        </div>
        <div className="w-full h-[874px] bg-gray-200 rounded-[15px] animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-center px-5 lg:px-[60px] 2xl:px-[120px] mt-16 lg:mt-28">
      <div 
        className="bg-[#DD4624] w-full text-white p-8 z-10 lg:h-[463px] rounded-[15px] flex items-center lg:mr-[-20%]"
      >
        <div className='lg:pl-8'>
          <h2 className="text-[32px] lg:text-[64px] font-custom1 font-extrabold text-[#191716]">{title}</h2>
          <div className='lg:w-[675px] text-[18px] text-[#F3F4F4] font-custom mt-6'>
            <p>{firstDescription}</p>
            <p className="mt-4">{secondDescription}</p>
          </div>
        </div>
      </div>
      <div className='w-full'>
        <Image 
          src={imageSrc}
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
