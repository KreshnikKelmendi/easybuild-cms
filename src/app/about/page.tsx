import React from 'react';
import BannerAbout from '../components/about/BannerAbout';
import AboutUs from '../components/about/AboutUs';
import OurTeam from '../components/about/OurTeam';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <BannerAbout />
      <AboutUs />
      <OurTeam />
    </div>
  );
};

export default AboutPage;
