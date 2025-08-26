'use client';

import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

interface StepImage {
  image: string;
  titleKey: string;
}

interface ServiceDetailProps {
  service: {
    _id: string;
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
    description2: {
      en: string;
      de: string;
      al: string;
    };
    image: string;
    stepImages: StepImage[];
  };
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service }) => {
  const { t, i18n } = useTranslation();
  const [showMore, setShowMore] = useState(false);
  const { ref: hereRef, inView: hereInView } = useInView({ triggerOnce: true });
  const { ref: moreContentRef, inView: moreContentInView } = useInView({ triggerOnce: true });
  
  // Get current language
  const currentLanguage = i18n.language;

  useEffect(() => {
    if (hereInView) {
      gsap.from(".animate-here", {
        x: 300,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
      });
    }
    if (moreContentInView) {
      gsap.from(".animate-more", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power4.out",
      });
    }
  }, [hereInView, moreContentInView]);

  // Add safety check for service
  if (!service) {
    return <div className="text-center py-10">Service not available</div>;
  }

  const handleToggle = () => {
    setShowMore(prevState => !prevState);
  };

  return (
    <>
      <div className='w-full flex flex-col lg:flex-row h-full p-2 gap-x-[10px] gap-y-[10px] lg:gap-y-0 overflow-hidden'>
        <div className='lg:w-1/2'>
          <div className='w-full'>
            <Image 
              src={service.image || '/assets/image1.png'} 
              width={400}
              height={628}
              className='w-full lg:h-[628px] object-cover rounded-[15px]' 
              alt={service.title?.[currentLanguage as keyof typeof service.title] || service.title?.en || 
               (currentLanguage === 'de' ? 'Dienstleistung' : 
                currentLanguage === 'al' ? 'Shërbim' : 
                'Service')} 
            />
          </div>
        </div>
        <div className='lg:w-1/2 bg-[#DD4624] lg:h-[628px] rounded-[15px] flex flex-col w-full justify-center items-center overflow-hidden'>
          <div className='text-[#F3F4F4] 2xl:w-[628px] py-6 lg:py-0 px-5 lg:px-16 2xl:px-0 animate-here' ref={hereRef}>
            <p className='text-[32px] lg:text-[64px] font-custom1 lg:leading-[75.2px]'>
              {service.title?.[currentLanguage as keyof typeof service.title] || service.title?.en || 
               (currentLanguage === 'de' ? 'Dienstleistungstitel' : 
                currentLanguage === 'al' ? 'Titulli i Shërbimit' : 
                'Service Title')}
            </p>
            <p className='font-custom font-normal text-[18px] leading-[21.15px] pt-6'>
              {service.description?.[currentLanguage as keyof typeof service.description] || service.description?.en || 
               (currentLanguage === 'de' ? 'Beschreibung nicht verfügbar' : 
                currentLanguage === 'al' ? 'Përshkrimi nuk është i disponueshëm' : 
                'Description not available')}
            </p>
            <p className='font-custom font-normal text-[18px] leading-[21.15px] pt-4'>
              {service.description2?.[currentLanguage as keyof typeof service.description2] || service.description2?.en || 
               (currentLanguage === 'de' ? 'Zusätzliche Beschreibung nicht verfügbar' : 
                currentLanguage === 'al' ? 'Përshkrimi shtesë nuk është i disponueshëm' : 
                'Additional description not available')}
            </p>
            <button
              className='w-full lg:w-[200px] bg-[#191716] py-3 rounded-[8px] hover:bg-[#DD4624] hover:duration-500 mt-6'
              onClick={handleToggle}
            >
              {showMore ? 
                (currentLanguage === 'de' ? 'Weniger anzeigen' : 
                 currentLanguage === 'al' ? 'Shfaq më pak' : 'View Less') : 
                (currentLanguage === 'de' ? 'Mehr anzeigen' : 
                 currentLanguage === 'al' ? 'Shfaq më shumë' : 'View More')
              }
            </button>
          </div>
        </div>
      </div>

      <div className='w-full'>
        {showMore && (
          <>
            <div ref={moreContentRef} className='animate-more mt-4 px-2 lg:px-[40px] 2xl:px-[80px]'>
              <p className='font-custom font-normal text-[18px] leading-[21.15px] text-[#DD4624] uppercase'>
                {t('how_we_build')}
              </p>
              <div className='flex flex-col lg:flex-row justify-start items-start lg:items-center'>
                <p className='text-[32px] lg:text-[64px] font-custom font-semibold'>{t('step_by_step')}</p>
                <p className='w-full lg:w-[501px] h-[92px] font-custom text-[18px] leading-[22.7px] text-[#191716] mt-4 lg:ml-20'>
                  {t('step_by_step_desc')}
                </p>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 overflow-x-auto pb-6'>
                {service.stepImages && service.stepImages.length > 0 ? (
                  service.stepImages.map((item, index) => (
                    <div key={index} className='w-full flex-shrink-0'>
                      <Image 
                        src={item.image} 
                        width={400}
                        height={447}
                        className='w-full lg:h-[447px] object-cover rounded-[15px]' 
                        alt={item.titleKey || `Step ${index + 1}`} 
                      />
                      <p className='text-[20px] font-custom1 mt-1'>{item.titleKey || `Step ${index + 1}`}</p>
                    </div>
                  ))
                ) : (
                  <div className='col-span-full text-center py-10'>
                    <p className='text-gray-500'>
                      {currentLanguage === 'de' ? 'Schritt-für-Schritt-Prozessbilder nicht verfügbar' : 
                       currentLanguage === 'al' ? 'Imazhet e procesit hap pas hapi nuk janë të disponueshme' : 
                       'Step-by-step process images not available'}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className='w-full flex justify-center mt-4'>
                             <button
                 className='w-full lg:w-[200px] bg-[#191716] text-white py-3 rounded-[8px] hover:bg-[#DD4624] hover:duration-500'
                 onClick={handleToggle}
               >
                 {currentLanguage === 'de' ? 'Weniger anzeigen' : 
                  currentLanguage === 'al' ? 'Shfaq më pak' : 'View Less'}
               </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ServiceDetail;
