'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import ServiceDetail from '@/app/components/services/ServiceDetail';

interface Service {
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
  stepImages: Array<{
    image: string;
    titleKey: string;
  }>;
  isActive: boolean;
}

interface ServiceDetailsClientProps {
  serviceId: string;
}

const ServiceDetailsClient = ({ serviceId }: ServiceDetailsClientProps) => {
  const { i18n } = useTranslation();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/services/${serviceId}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to load service');
        }

        setService(data.data);
      } catch (err) {
        console.error('Failed to fetch service:', err);
        setError(
          i18n.language === 'de'
            ? 'Dienst konnte nicht geladen werden.'
            : i18n.language === 'al'
            ? 'Shërbimi nuk mund të ngarkohej.'
            : 'Unable to load the service.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId, i18n.language]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-[#DD4624]"></div>
        </div>
      );
    }

    if (error) {
      return (
        <p className="text-center text-[#DD4624] font-zonapro py-10">
          {error}
        </p>
      );
    }

    if (!service) {
      return (
        <p className="text-center text-[#191716] font-zonapro py-10">
          {i18n.language === 'de'
            ? 'Dienst nicht gefunden.'
            : i18n.language === 'al'
            ? 'Shërbimi nuk u gjet.'
            : 'Service not found.'}
        </p>
      );
    }

    const enhancedService = {
      ...service,
      description:
        service.description ||
        ({
          en: 'Description not available',
          de: 'Beschreibung nicht verfügbar',
          al: 'Përshkrimi nuk është i disponueshëm',
        } as Service['description']),
      description2:
        service.description2 ||
        ({
          en: 'Additional description not available',
          de: 'Zusätzliche Beschreibung nicht verfügbar',
          al: 'Përshkrimi shtesë nuk është i disponueshëm',
        } as Service['description2']),
      stepImages: service.stepImages || [],
    };

    return <ServiceDetail service={enhancedService} />;
  };

  return (
    <div className="min-h-screen px-5 lg:px-[60px] 2xl:px-[120px] py-12 lg:py-0 lg:pt-24">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <p className="text-[#DD4624] font-custom font-zonapro">
            {i18n.language === 'de'
              ? 'Dienstleistung'
              : i18n.language === 'al'
              ? 'Shërbimi'
              : 'Service'}
          </p>
          {service ? (
            <p className="text-3xl lg:text-5xl leading-tight font-custom1 text-black font-zonapro">
              {service.title?.[i18n.language as keyof typeof service.title] ||
                service.title?.en}
            </p>
          ) : (
            <p className="text-[32px] lg:text-[48px] font-custom1 text-black font-zonapro">
              {i18n.language === 'de'
                ? 'Details'
                : i18n.language === 'al'
                ? 'Detajet'
                : 'Details'}
            </p>
          )}
        </div>
        <Link
          href="/services"
          className="text-[#191716] border border-[#191716] px-6 py-3 rounded-full hover:bg-[#191716] hover:text-white transition-colors duration-300 font-zonapro"
        >
          {i18n.language === 'de'
            ? 'Zurück zu den Diensten'
            : i18n.language === 'al'
            ? 'Kthehu te shërbimet'
            : 'Back to services'}
        </Link>
      </div>

      <div className="mt-12">{renderContent()}</div>
    </div>
  );
};

export default ServiceDetailsClient;

