'use client';

import { usePathname } from 'next/navigation';
import ContactBanner from './about/ContactBanner';

const ConditionalContactBanner = () => {
  const pathname = usePathname();
  
  // Hide ContactBanner on admin pages
  if (pathname === '/signin' || pathname === '/dashboard') {
    return null;
  }
  
  return <ContactBanner />;
};

export default ConditionalContactBanner;
