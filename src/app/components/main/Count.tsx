'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const CheckIcon = () => (
  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#191716] lg:h-10 lg:w-10">
    <svg className="h-4 w-4 text-[#DD4624] lg:h-5 lg:w-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  </div>
);

const Count = () => {
  const { t } = useTranslation();

  const items = [
    t('quality_innovation'),
    t('quality_efficiency'),
    t('quality_staff'),
  ];

  return (
    <div className="relative flex flex-col items-center gap-y-8 rounded-b-[15px] bg-[#DD4624] px-8 py-10 font-sans lg:flex-row lg:items-center lg:justify-between lg:gap-x-12 lg:gap-y-0 lg:px-[70px] lg:py-16 2xl:gap-x-16 2xl:px-[120px]">
      {items.map((label) => (
        <div
          key={label}
          className="flex w-full max-w-[320px] items-center justify-start gap-4 text-left lg:max-w-none lg:flex-1 lg:justify-start"
        >
          <CheckIcon />
          <span className="font-zonapro text-[17px] leading-snug text-[#F3F4F4] lg:text-[22px] lg:leading-[28.8px]">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Count;
