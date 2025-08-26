'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ServicesInPage from '../components/services/ServicesInPage';
import ServiceDetail from '../components/services/ServiceDetail';

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
            <div className="space-y-8 py-0">
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
               services.map((service) => {
                 console.log('Processing service:', service);
                 console.log('Service stepImages:', service.stepImages);
                 console.log('Service stepImages type:', typeof service.stepImages);
                 console.log('Service stepImages length:', service.stepImages?.length);
                 
                 // Ensure service has required fields with fallbacks
                 const enhancedService = {
                   ...service,
                   description: service.description || { en: 'Description not available', de: 'Beschreibung nicht verfügbar', al: 'Përshkrimi nuk është i disponueshëm' },
                   description2: service.description2 || { en: 'Additional description not available', de: 'Zusätzliche Beschreibung nicht verfügbar', al: 'Përshkrimi shtesë nuk është i disponueshëm' },
                   stepImages: service.stepImages || []
                 };
                 
                 console.log('Enhanced service:', enhancedService);
                 console.log('Enhanced stepImages:', enhancedService.stepImages);
                 return <ServiceDetail key={service._id} service={enhancedService} />;
               })
             )}
           </div>
         </>
       )}
    </div>
  );
};

export default ServicesPage;
