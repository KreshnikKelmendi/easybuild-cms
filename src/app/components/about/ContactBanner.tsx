"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ContactBanner = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isContactPage = pathname === "/contact";

  if (isContactPage) {
    return null; // Return null to hide the component
  }

  return (
    <section className="flex items-center justify-center mt-20 lg:mt-32">
      <div className="lg:px-[50px] 2xl:px-[119px] w-full text-center lg:text-left">
        <div className="relative z-10 overflow-hidden rounded-[15px] bg-[#DD4624] lg:h-[208px] flex items-center py-12 lg:py-0">
          <div className="flex flex-col lg:flex-row items-center w-full lg:px-20">
            <div className="w-full px-4 lg:w-1/2 flex flex-col justify-center lg:justify-start">
              <p className="block mb-4 font-semibold text-white font-custom1 text-[32px] leading-[37.6px]">
                {t('contactBanner')}
              </p>
              <p className="block mb-4 font-semibold text-white font-custom1 text-[32px] leading-[37.6px]">{t('second_contactBanner')}</p>
            </div>
            <div className="w-full px-4 lg:w-1/2 flex justify-center lg:justify-end">
              <Link
                href="/contact"
                onClick={() => window.scrollTo({ top: 0, left: 0 })}
                className="inline-flex py-3 my-1 text-[18px] font-medium transition bg-[#191716] text-[#F3F4F4] rounded-[8px] w-[200px] text-center h-[51px] justify-center items-center hover:bg-shadow-1 text-primary px-7 hover:bg-white hover:text-[#191716] font-custom"
              >
                {t('get_started')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactBanner;
