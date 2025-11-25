'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import ServicesInPage from '../components/services/ServicesInPage';

interface Service {
  _id: string;
  title: {
    en: string;
    de: string;
    al: string;
  };
  description?: {
    en: string;
    de: string;
    al: string;
  };
  description2?: {
    en: string;
    de: string;
    al: string;
  };
  image: string;
  stepImages?: Array<{
    image: string;
    titleKey: string;
  }>;
  isActive: boolean;
}

const ServicesPage = () => {
  const { i18n } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      
      if (data.success) {
        console.log('Fetched services:', data.data);
        setServices(data.data.filter((service: Service) => service.isActive));
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ServicesInPage />
      
                    {loading ? (
         <div className="flex justify-center items-center py-20">
           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#DD4624]"></div>
         </div>
               ) : (
      <>
        {/* Services Content */}
        <div className="pt-16 px-5 lg:px-[60px] 2xl:px-[120px]">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <p className="text-[#DD4624] font-custom font-zonapro uppercase tracking-[0.3em]">
                {i18n.language === 'de'
                  ? 'Unsere Dienstleistungen'
                  : i18n.language === 'al'
                  ? 'Shërbimet tona'
                  : 'Our services'}
              </p>
              <h2 className="text-[36px] lg:text-[72px] font-custom1 text-[#191716] font-zonapro leading-tight">
                {i18n.language === 'de'
                  ? 'Lösungen, die wir liefern'
                  : i18n.language === 'al'
                  ? 'Zgjidhje që ofrojmë'
                  : 'Solutions we deliver'}
              </h2>
            </div>
            <p className="lg:max-w-[420px] text-lg text-[#191716]/80 font-custom font-zonapro">
              {i18n.language === 'de'
                ? 'Jeder Service folgt einem sorgfältigen Ablauf, unterstützt durch visuelle Dokumentation unserer Arbeitsschritte.'
                : i18n.language === 'al'
                ? 'Çdo shërbim ndjek një proces të kujdesshëm, i dokumentuar me imazhe nga hapat tanë të punës.'
                : 'Each service follows a carefully crafted process backed by visual documentation of every step.'}
            </p>
          </div>

          <div className="mt-14">
            {services.length === 0 ? (
             <div className="text-center py-20">
               <h2 className="text-2xl font-bold text-gray-800 mb-4">
                 {i18n.language === 'de' ? 'Keine Dienstleistungen verfügbar' : 
                  i18n.language === 'al' ? 'Asnjë Shërbim i Disponueshëm' : 
                  'No Services Available'}
               </h2>
               <p className="text-gray-600 mb-6">
                 {i18n.language === 'de' ? 'Derzeit sind keine Dienstleistungen zum Anzeigen verfügbar.' : 
                  i18n.language === 'al' ? 'Aktualisht nuk ka shërbime për t\'u shfaqur.' : 
                  'There are currently no services to display.'}
               </p>
               <div className="space-y-4">
                 <p className="text-sm text-gray-500">
                   {i18n.language === 'de' ? 'Um Dienstleistungen hinzuzufügen:' : 
                    i18n.language === 'al' ? 'Për të shtuar shërbime:' : 
                    'To add services:'}
                 </p>
                 <ol className="text-sm text-gray-500 list-decimal list-inside space-y-2">
                   <li>
                     {i18n.language === 'de' ? 'Gehen Sie zum Admin-Dashboard' : 
                      i18n.language === 'al' ? 'Shkoni te admin dashboard' : 
                      'Go to the admin dashboard'}
                   </li>
                   <li>
                     {i18n.language === 'de' ? 'Navigieren Sie zur Dienstleistungsverwaltung' : 
                      i18n.language === 'al' ? 'Navigoni te Menaxhimi i Shërbimeve' : 
                      'Navigate to Service Management'}
                   </li>
                   <li>
                     {i18n.language === 'de' ? 'Erstellen Sie neue Dienstleistungen mit allen erforderlichen Feldern' : 
                      i18n.language === 'al' ? 'Krijoni shërbime të reja me të gjitha fushat e kërkuara' : 
                      'Create new services with all required fields'}
                   </li>
                   <li>
                     {i18n.language === 'de' ? 'Oder verwenden Sie den Seed-Endpunkt:' : 
                      i18n.language === 'al' ? 'Ose përdorni endpoint-in seed:' : 
                      'Or use the seed endpoint:'} <code className="bg-gray-100 px-2 py-1 rounded">POST /api/seed-services</code>
                   </li>
                 </ol>
               </div>
             </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
               {services.map((service) => {
                 const lang = i18n.language as keyof Service['title'];
                 const title =
                   service.title?.[lang] ||
                   service.title?.en ||
                   (lang === 'de'
                     ? 'Dienstleistung'
                     : lang === 'al'
                     ? 'Shërbim'
                     : 'Service');
                 const description =
                   service.description?.[lang] ||
                   service.description?.en ||
                   (lang === 'de'
                     ? 'Beschreibung nicht verfügbar'
                     : lang === 'al'
                     ? 'Përshkrimi nuk është i disponueshëm'
                     : 'Description not available');
                const description2 =
                  service.description2?.[lang] ||
                  service.description2?.en ||
                  (lang === 'de'
                    ? 'Zusätzliche Beschreibung nicht verfügbar'
                    : lang === 'al'
                    ? 'Përshkrimi shtesë nuk është i disponueshëm'
                    : 'Additional description not available');
                 return (
                   <div
                     key={service._id}
                     className="bg-white rounded-[28px] shadow-md overflow-hidden flex flex-col"
                   >
                    <div className="relative">
                      <Image
                        src={service.image || '/assets/service-page-1.png'}
                        alt={title}
                        width={800}
                        height={520}
                        className="w-full h-[260px] object-cover"
                      />
                    </div>

                     <div className="p-6 flex flex-col flex-1">
                       <p className="text-xs uppercase tracking-[0.1em] leading-tight text-[#DD4624] font-zonapro">
                         {i18n.language === 'de'
                           ? 'Dienstleistung'
                           : i18n.language === 'al'
                           ? 'Shërbimi'
                           : 'Service'}
                       </p>
                       <h3 className="text-2xl font-custom1 text-[#191716] leading-tight mt-3 font-zonapro">
                         {title}
                       </h3>
                       <p className="text-[16px] text-[#191716]/80 font-custom leading-tight font-zonapro mt-4">
                         {description}
                       </p>
                       <p className="text-[15px] text-[#191716]/60 font-custom font-zonapro leading-tight mt-3 flex-1">
                         {description2}
                       </p>

                       <Link
                         href={`/services/${service._id}`}
                         className="inline-flex items-center justify-between bg-[#191716] text-white px-5 py-3 rounded-2xl mt-6 font-zonapro hover:bg-[#DD4624] transition-colors"
                       >
                         {i18n.language === 'de'
                           ? 'Details anzeigen'
                           : i18n.language === 'al'
                           ? 'Shiko detajet'
                           : 'View details'}
                         <FaArrowRight />
                       </Link>
                     </div>
                   </div>
                 );
               })}
              </div>
            )}
          </div>
        </div>
      </>
      )}
    </div>
  );
};

export default ServicesPage;
