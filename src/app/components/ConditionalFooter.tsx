'use client';

import { usePathname } from 'next/navigation';
import Footer from './footer/Footer';

const ConditionalFooter = () => {
  const pathname = usePathname();
  
  // Hide Footer on admin pages
  if (pathname === '/signin' || pathname === '/dashboard') {
    return null;
  }
  
  return <Footer />;
};

export default ConditionalFooter;
