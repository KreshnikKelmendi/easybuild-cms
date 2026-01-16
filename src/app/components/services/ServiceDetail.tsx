'use client';

import React, { useState } from 'react';
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
    exteriorWall?: boolean;
    interiorWall?: boolean;
    exteriorWallImages?: Array<{ image: string; title?: string }>;
    interiorWallImages?: Array<{ image: string; title?: string }>;
    customWalls?: Array<{ name: string; images: Array<{ image: string; title?: string }> }>;
  };
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);

  // Debug: Log custom walls
  React.useEffect(() => {
    console.log('ServiceDetail - service:', service);
    console.log('ServiceDetail - customWalls:', service?.customWalls);
  }, [service]);

  const openFullScreen = (image: string) => {
    if (!image || image.trim() === '') return;
    setSelectedImage(image);
    setIsFullScreenOpen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreenOpen(false);
    setSelectedImage(null);
  };

  if (!service) {
    return <div className="text-center py-10 font-zonapro">Service not available</div>;
  }

  return (
    <section className="space-y-12">
      <div className="bg-[#DD4624] rounded-[32px] lg:h-[60vh] border border-[#191716]/10 overflow-hidden flex items-center justify-start">
        <div className="flex flex-col lg:flex-row items-center justify-start gap-10 w-full p-4 lg:p-0 lg:pl-6">
          <div className="w-full lg:w-1/2 flex flex-col gap-5 items-start text-left">
            <p className="text-xs uppercase tracking-[0.4em] text-white font-zonapro">
              {t('services')}
            </p>
            <h1 className="text-2xl lg:text-3xl font-custom1 text-left text-white leading-tight font-zonapro">
              {service.title?.[currentLanguage as keyof typeof service.title] ||
                service.title?.en ||
                (currentLanguage === 'de'
                  ? 'Dienstleistungstitel'
                  : currentLanguage === 'al'
                  ? 'Titulli i Shërbimit'
                  : 'Service Title')}
            </h1>
            
            {/* Wall Options Badges */}
            {(service.exteriorWall || service.interiorWall) && (
              <div className="flex flex-wrap gap-2 mt-3">
                {service.exteriorWall && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold border border-white/30 font-zonapro">
                    {currentLanguage === 'de' ? 'Außenwand' : 
                     currentLanguage === 'al' ? 'Mur i Jashtëm' : 
                     'Exterior Wall'}
                  </span>
                )}
                {service.interiorWall && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold border border-white/30 font-zonapro">
                    {currentLanguage === 'de' ? 'Innenwand' : 
                     currentLanguage === 'al' ? 'Mur i Brendshëm' : 
                     'Interior Wall'}
                  </span>
                )}
              </div>
            )}
            
            <div className="grid gap-3">
              <p className="text-sm lg:text-base leading-tight text-gray-200 font-custom font-zonapro">
                {service.description?.[currentLanguage as keyof typeof service.description] ||
                  service.description?.en ||
                  (currentLanguage === 'de'
                    ? 'Beschreibung nicht verfügbar'
                    : currentLanguage === 'al'
                    ? 'Përshkrimi nuk është i disponueshëm'
                    : 'Description not available')}
              </p>
              <p className="text-sm lg:text-base leading-tight text-gray-200 font-custom font-zonapro">
                {service.description2?.[currentLanguage as keyof typeof service.description2] ||
                  service.description2?.en ||
                  (currentLanguage === 'de'
                    ? 'Zusätzliche Beschreibung nicht verfügbar'
                    : currentLanguage === 'al'
                    ? 'Përshkrimi shtesë nuk është i disponueshëm'
                    : 'Additional description not available')}
              </p>
            </div>
          </div>
          <div className="w-full lg:w-1/2  flex items-center justify-center p-0 lg:p-0 rounded-2xl">
            <div className="w-full ">
              <div 
                className="relative w-full h-full lg:h-[60vh] rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => openFullScreen(service.image || '/assets/image1.png')}
              >
                <Image
                  src={service.image || '/assets/image1.png'}
                  width={600}
                  height={420}
                  className="w-full h-full lg:h-[60vh] object-contain rounded-2xl transition-transform duration-300 group-hover:scale-105"
                  alt={
                    service.title?.[currentLanguage as keyof typeof service.title] ||
                    service.title?.en ||
                    (currentLanguage === 'de'
                      ? 'Dienstleistung'
                      : currentLanguage === 'al'
                      ? 'Shërbim'
                      : 'Service')
                  }
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-black/70 backdrop-blur-sm rounded-xl p-3 text-center">
                    <svg className="w-6 h-6 text-white mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <p className="text-white text-xs font-semibold font-zonapro">Click to view full screen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {service.stepImages && service.stepImages.filter(step => step.image && step.titleKey).length > 0 && (
        <div className="bg-white rounded-[32px] border border-[#191716]/10 p-6 lg:p-12">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#DD4624] font-zonapro">
              {t('how_we_build')}
            </p>
            <h2 className="text-[28px] lg:text-[40px] font-custom1 leading-tight mt-2 text-[#191716] font-zonapro">
              {t('step_by_step')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
            {service.stepImages.filter(step => step.image && step.titleKey).map((item, index) => (
              <div
                key={`${item.image}-${index}`}
                className="rounded-2xl overflow-hidden bg-[#DD4624] cursor-pointer group"
                onClick={() => openFullScreen(item.image)}
              >
                <div className="relative h-[320px] lg:h-[360px]">
                  <Image
                    src={item.image}
                    width={400}
                    height={280}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    alt={item.titleKey || `Step ${index + 1}`}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                      <svg className="w-5 h-5 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <p className="text-[18px] font-custom1 text-white font-zonapro">
                    {item.titleKey ||
                      (currentLanguage === 'de'
                        ? `Schritt ${index + 1}`
                        : currentLanguage === 'al'
                        ? `Hapi ${index + 1}`
                        : `Step ${index + 1}`)}
                  </p>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#DD4624] font-zonapro">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exterior Wall Images Section */}
      {service.exteriorWall && service.exteriorWallImages && service.exteriorWallImages.length > 0 && (
        <div className="bg-white rounded-[32px] border border-[#191716]/10 p-6 lg:p-12">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#DD4624] font-zonapro">
              {currentLanguage === 'de' ? 'Außenwand' : 
               currentLanguage === 'al' ? 'Mur i Jashtëm' : 
               'Exterior Wall'}
            </p>
            <h2 className="text-[28px] lg:text-[40px] font-custom1 leading-tight mt-2 text-[#191716] font-zonapro">
              {currentLanguage === 'de' ? 'Außenwand' : 
               currentLanguage === 'al' ? 'Mur i Jashtëm' : 
               'Exterior Wall'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6 mt-8">
            {service.exteriorWallImages
              .filter((img) => {
                const image = typeof img === 'string' ? img : img.image;
                return image && image.trim() !== '';
              })
              .map((img, index) => {
                const image = typeof img === 'string' ? img : img.image;
                const title = typeof img === 'string' ? '' : (img.title || '');
                if (!image || image.trim() === '') return null;
                return (
                  <div
                    key={`exterior-${index}`}
                    className="rounded-2xl overflow-hidden cursor-pointer group relative"
                    onClick={() => openFullScreen(image)}
                  >
                    <div className="relative h-[320px] lg:h-[360px]">
                      <Image
                        src={image}
                        width={400}
                        height={280}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        alt={title || `Exterior wall ${index + 1}`}
                      />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-black/70 backdrop-blur-sm rounded-xl p-2">
                        <svg className="w-5 h-5 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {title && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-800 text-center font-zonapro">{title}</p>
                    </div>
                  )}
                </div>
                );
              })
              .filter(Boolean)}
          </div>
        </div>
      )}

      {/* Interior Wall Images Section */}
      {service.interiorWall && service.interiorWallImages && service.interiorWallImages.length > 0 && (
        <div className="bg-white rounded-[32px] border border-[#191716]/10 p-6 lg:p-12">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#DD4624] font-zonapro">
              {currentLanguage === 'de' ? 'Innenwand' : 
               currentLanguage === 'al' ? 'Mur i Brendshëm' : 
               'Interior Wall'}
            </p>
            <h2 className="text-[28px] lg:text-[40px] font-custom1 leading-tight mt-2 text-[#191716] font-zonapro">
              {currentLanguage === 'de' ? 'Innenwand' : 
               currentLanguage === 'al' ? 'Mur i Brendshëm' : 
               'Interior Wall'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {service.interiorWallImages
              .filter((img) => {
                const image = typeof img === 'string' ? img : img.image;
                return image && image.trim() !== '';
              })
              .map((img, index) => {
                const image = typeof img === 'string' ? img : img.image;
                const title = typeof img === 'string' ? '' : (img.title || '');
                if (!image || image.trim() === '') return null;
                return (
                  <div
                    key={`interior-${index}`}
                    className="rounded-2xl overflow-hidden cursor-pointer group relative"
                    onClick={() => openFullScreen(image)}
                  >
                    <div className="relative h-[320px] lg:h-[360px]">
                      <Image
                        src={image}
                        width={400}
                        height={280}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        alt={title || `Interior wall ${index + 1}`}
                      />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-black/70 backdrop-blur-sm rounded-xl p-2">
                        <svg className="w-5 h-5 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {title && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-800 text-center font-zonapro">{title}</p>
                    </div>
                  )}
                </div>
                );
              })
              .filter(Boolean)}
          </div>
        </div>
      )}

      {/* Custom Walls Sections */}
      {service.customWalls && Array.isArray(service.customWalls) && service.customWalls.length > 0 && service.customWalls.map((customWall, wallIndex) => {
        const validImages = customWall.images?.filter((img) => {
          const image = typeof img === 'string' ? img : img.image;
          return image && image.trim() !== '';
        }) || [];
        
        if (validImages.length === 0) return null;

        return (
          <div key={`custom-wall-${wallIndex}`} className="bg-white rounded-[32px] border border-[#191716]/10 p-6 lg:p-12">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#DD4624] font-zonapro">
                {customWall.name}
              </p>
              <h2 className="text-[28px] lg:text-[40px] font-custom1 leading-tight mt-2 text-[#191716] font-zonapro">
                {customWall.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {validImages.map((img, index) => {
                const image = typeof img === 'string' ? img : img.image;
                const title = typeof img === 'string' ? '' : (img.title || '');
                if (!image || image.trim() === '') return null;
                return (
                  <div
                    key={`custom-wall-${wallIndex}-img-${index}`}
                    className="rounded-2xl overflow-hidden cursor-pointer group relative"
                    onClick={() => openFullScreen(image)}
                  >
                    <div className="relative h-[320px] lg:h-[360px]">
                      <Image
                        src={image}
                        width={400}
                        height={280}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        alt={title || `${customWall.name} ${index + 1}`}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-black/70 backdrop-blur-sm rounded-xl p-2">
                          <svg className="w-5 h-5 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {title && (
                      <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-800 text-center font-zonapro">{title}</p>
                      </div>
                    )}
                  </div>
                );
              }).filter(Boolean)}
            </div>
          </div>
        );
      })}

      {/* Full Screen Image Modal */}
      {isFullScreenOpen && selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeFullScreen}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeFullScreen}
              className="absolute top-4 right-4 z-10 bg-black/20 backdrop-blur-sm hover:bg-white/30 text-black rounded-full p-3 transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Full Screen Image */}
            <div 
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Full Screen View"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServiceDetail;
