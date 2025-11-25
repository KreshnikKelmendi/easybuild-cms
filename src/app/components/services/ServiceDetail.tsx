'use client';

import React from 'react';
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
  const currentLanguage = i18n.language;

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
              <Image
                src={service.image || '/assets/image1.png'}
                width={600}
                height={420}
                className="w-full h-full lg:h-[60vh] object-cover rounded-2xl"
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
            </div>
          </div>
        </div>
      </div>

      {service.stepImages && service.stepImages.length > 0 && (
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
            {service.stepImages.map((item, index) => (
              <div
                key={`${item.image}-${index}`}
                className="rounded-2xl overflow-hidden bg-[#DD4624]"
              >
                <Image
                  src={item.image}
                  width={400}
                  height={280}
                  className="w-full h-[320px] lg:h-[360px] object-cover"
                  alt={item.titleKey || `Step ${index + 1}`}
                />
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
    </section>
  );
};

export default ServiceDetail;
