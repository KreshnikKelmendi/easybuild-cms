'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

const Count = () => {
  const { t } = useTranslation()

  const items = [
    t('quality_innovation'),
    t('quality_efficiency'),
    t('quality_staff'),
  ]

  return (
    <div className="w-full rounded-[15px] bg-[#191716]/90 px-6 py-5 backdrop-blur-sm lg:px-10 lg:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {items.map((label, index) => (
          <div
            key={label}
            className={`flex flex-1 items-center justify-start gap-3 lg:justify-center ${
              index > 0 ? 'lg:border-l lg:border-white/10 lg:pl-8' : ''
            }`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DD4624] lg:h-9 lg:w-9">
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span className="font-zonapro text-[15px] leading-snug text-[#F3F4F4] lg:text-center lg:text-[17px]">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Count
