'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import Count from '../main/Count'

const AboutUsOnHomePage = () => {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleScrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.play().catch(() => {
      // Autoplay may be blocked until user interaction on some browsers.
    })
  }, [])

  return (
    <section className="relative w-full min-h-[90vh] overflow-hidden pb-44 sm:pb-48 lg:min-h-screen lg:pb-52">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      >
        <source src="/assets/easybuild-factory.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-r from-[#191716]/92 via-[#191716]/65 to-[#191716]/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#191716]/40 via-transparent to-[#191716]/20" />

      <div className="relative z-10 flex min-h-[90vh] items-center px-5 py-20 lg:min-h-screen lg:px-[60px] lg:py-28 2xl:px-[120px]">
        <div className="w-full max-w-3xl">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-12 bg-[#DD4726]" />
            <p className="font-zonapro text-sm font-medium uppercase tracking-[0.2em] text-[#DD4726]">
              {t('aboutUs')}
            </p>
          </div>

          <h2 className="font-zonapro text-3xl font-normal leading-tight text-[#F3F4F4] sm:text-4xl lg:text-[56px] lg:leading-[1.15] 2xl:text-[64px]">
            {t('aboutUsDescription')}
          </h2>

          <p className="mt-6 max-w-2xl font-zonapro text-sm text-[#F3F4F4]/90 lg:text-sm ">
            {t('firstDescription')}
          </p>

          <p className="mt-4 max-w-2xl font-zonapro text-sm text-[#F3F4F4]/80 lg:text-sm">
            {t('secondDescription')}
          </p>

          <Link href="/about" onClick={handleScrollToTop} className="mt-8 inline-block">
            <button
              type="button"
              className="rounded-lg bg-[#DD4726] px-8 py-3.5 font-zonapro text-sm font-medium uppercase tracking-wide text-[#F3F4F4] transition-all duration-300 hover:bg-[#F3F4F4] hover:text-[#191716]"
            >
              {t('readMore')}
            </button>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-6 lg:px-[60px] lg:pb-10 2xl:px-[120px]">
        <Count />
      </div>
    </section>
  )
}

export default AboutUsOnHomePage
