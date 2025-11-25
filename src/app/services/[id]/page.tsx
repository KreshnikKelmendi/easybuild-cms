import ServiceDetailsClient from './ServiceDetailsClient';

interface ServicePageProps {
  params: Promise<{ id: string }>;
}

const ServiceDetailsPage = async ({ params }: ServicePageProps) => {
  const { id } = await params;

  return <ServiceDetailsClient serviceId={id} />;
};

export default ServiceDetailsPage;

