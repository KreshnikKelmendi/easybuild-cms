'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { gsap } from 'gsap';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';

interface Service {
  _id: string;
  title: {
    en: string;
    de: string;
    al: string;
  };
  image: string;
  hoverImage?: string;
  isActive: boolean;
}

const OurServices = () => {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLargeDevice, setIsLargeDevice] = useState(false);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const servicesSectionRef = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  const servicesPerPage = 3;

  useEffect(() => {
    fetchServices();
    checkDeviceSize();
    
    const handleResize = () => {
      checkDeviceSize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Refetch services when language changes to trigger re-render
  useEffect(() => {
    // This will trigger a re-render when language changes
    // The services don't need to be refetched, but we need to update the display
    console.log('Language changed to:', i18n.language);
  }, [i18n.language]);

  const checkDeviceSize = () => {
    setIsLargeDevice(window.innerWidth >= 1024); // lg breakpoint
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Helper function to get title in current language
  const getTitleInCurrentLanguage = (service: Service) => {
    const currentLang = i18n.language;
    console.log('Current language:', currentLang, 'Service title:', service.title);
    switch (currentLang) {
      case 'de':
        return service.title.de;
      case 'al':
        return service.title.al;
      default:
        return service.title.en;
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(services.length / servicesPerPage);
  const startIndex = (currentPage - 1) * servicesPerPage;
  const endIndex = startIndex + servicesPerPage;
  const currentServices = services.slice(startIndex, endIndex);

  // Handle page change with smooth scroll
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Smooth scroll to services section
    if (servicesSectionRef.current) {
      servicesSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleMouseEnter = (index: number) => {
    console.log('Mouse Enter:', index, 'Service:', currentServices[index]);
    setHoveredIndex(index);
    gsap.to(imageRefs.current[index], {
      scale: 1.05,
      duration: 0.5,
      ease: 'power4.inOut',
    });
  };

  const handleMouseLeave = (index: number) => {
    console.log('Mouse Leave:', index);
    setHoveredIndex(null);
    gsap.to(imageRefs.current[index], {
      scale: 1,
      duration: 0.8,
      ease: 'power4.inOut',
    });
  };

  useEffect(() => {
    if (inView) {
      gsap.fromTo(
        serviceRefs.current,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          stagger: 0.2,
        }
      );
    }
  }, [inView, currentPage]);

  return (
    <div className='bg-[#F3F4F4] px-5 lg:px-[60px] 2xl:px-[120px] py-12 lg:py-24 h-auto relative'>
      <p className='text-[#DD4624] font-custom font-normal text-left'>{t('services')}</p>
      <p className='text-[32px] lg:text-[64px] font-custom1 text-black text-left'>{t('our_services')}</p>
      <p className='max-w-full lg:max-w-[451px] leading-[22.7px] text-[18px] text-[#191716] font-custom font-normal mt-4 mx-auto lg:mx-0 text-left'>
        {t('serviceDescription')}
      </p>
      
      {/* Services Grid */}
      <div ref={servicesSectionRef} className='grid grid-cols-1 lg:grid-cols-3 gap-y-12 lg:gap-x-12 mt-16'>
        {currentServices.map((service, index) => (
          <div
            key={service._id}
            ref={(el) => {
              serviceRefs.current[index] = el;
            }}
            className='w-full'
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <img
              ref={(el) => {
                imageRefs.current[index] = el;
              }}
              src={(() => {
                const imageSrc = hoveredIndex === index && service.hoverImage ? service.hoverImage : service.image;
                console.log(`Service ${index} - Hovered: ${hoveredIndex === index}, HoverImage: ${service.hoverImage}, FinalSrc: ${imageSrc}`);
                return imageSrc;
              })()}
              alt={getTitleInCurrentLanguage(service)}
              className='w-full h-60 lg:h-[489px] object-cover rounded-lg transition-all duration-500 ease-in-out'
            />
            <div className='block'>
              <p className='text-[20px] 2xl:text-[25px] font-custom font-semibold mt-6 lg:mt-9 flex items-center justify-start text-black hover:text-[#DD4624] hover:scale-110 hover:duration-500'>
                {getTitleInCurrentLanguage(service)} <FaArrowRight className='ml-4 bg-[#DD4624] rounded-full text-white p-[5px]' />
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination - Only show on large devices when there are more than 3 services */}
      {isLargeDevice && totalPages > 1 && (
        <div className='flex justify-center items-center mt-16 space-x-2'>
          {/* Previous button */}
          {currentPage > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className='px-4 py-2 text-[#DD4624] hover:text-[#B83A1E] transition-colors duration-300 font-custom'
            >
              ← Previous
            </button>
          )}

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-full transition-all duration-300 font-custom ${
                currentPage === page
                  ? 'bg-[#DD4624] text-white scale-110'
                  : 'bg-white text-[#191716] hover:bg-[#DD4624] hover:text-white hover:scale-105'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next button */}
          {currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className='px-4 py-2 text-[#DD4624] hover:text-[#B83A1E] transition-colors duration-300 font-custom'
            >
              Next →
            </button>
          )}
        </div>
      )}

      {/* Mobile pagination indicator - show current page info */}
      {!isLargeDevice && totalPages > 1 && (
        <div className='flex justify-center items-center mt-8 text-[#191716] font-custom'>
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
};

export default OurServices;
