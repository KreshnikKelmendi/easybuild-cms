'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toDisplayImageUrl } from '@/lib/blobUrl'

interface Service {
  _id: string
  title: {
    en: string
    de: string
    al: string
  }
  description: {
    en: string
    de: string
    al: string
  }
  image: string
  hoverImage?: string
  exteriorWall?: boolean
  interiorWall?: boolean
  customWalls?: Array<{ name: string; images: Array<{ image: string; title?: string }> }>
  isActive: boolean
}

interface ServiceCardProps {
  service: Service
  title: string
  description: string
  viewLabel: string
  wallLabels: string[]
  onClick: () => void
}

const ServiceCard = ({
  service,
  title,
  description,
  viewLabel,
  wallLabels,
  onClick,
}: ServiceCardProps) => (
  <article className="group cursor-pointer" onClick={onClick}>
    <div className="relative mb-5 aspect-[3/4] overflow-hidden rounded-2xl bg-[#eceae4]">
      <Image
        src={toDisplayImageUrl(service.image)}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className={`object-cover transition-all duration-700 ease-out group-hover:scale-[1.05] ${
          service.hoverImage ? 'group-hover:opacity-0' : ''
        }`}
      />
      {service.hoverImage && (
        <Image
          src={toDisplayImageUrl(service.hoverImage)}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:opacity-100"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#191716]/90 via-[#191716]/55 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />

      <div className="absolute inset-x-0 bottom-0 translate-y-full p-5 transition-transform duration-500 ease-out group-hover:translate-y-0">
        <p className="mb-3 line-clamp-3 font-zonapro text-sm leading-relaxed text-[#F3F4F4]">
          {description}
        </p>
        {wallLabels.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {wallLabels.map((label) => (
              <span
                key={label}
                className="rounded-full bg-white/15 px-2.5 py-1 font-zonapro text-xs text-[#F3F4F4]"
              >
                {label}
              </span>
            ))}
          </div>
        )}
        <span className="inline-flex font-zonapro text-sm font-medium text-[#DD4726]">
          {viewLabel}
        </span>
      </div>
    </div>

    <div className="flex items-baseline justify-between gap-4">
      <h3 className="font-zonapro text-lg font-semibold leading-tight text-[#1a1a1a] transition-colors duration-300 group-hover:text-[#DD4726] sm:text-xl">
        {title}
      </h3>
      <span className="shrink-0 font-zonapro text-sm font-normal text-[#666666] lg:hidden">
        {viewLabel}
      </span>
    </div>
  </article>
)

const OurServices = () => {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'de' | 'al'>('en')
  const [currentSlide, setCurrentSlide] = useState(0)

  const useCarousel = services.length > 3
  const itemsPerSlide = useCarousel ? 4 : services.length

  const slides = useMemo(() => {
    if (!useCarousel) return [services]

    const chunks: Service[][] = []
    for (let i = 0; i < services.length; i += itemsPerSlide) {
      chunks.push(services.slice(i, i + itemsPerSlide))
    }
    return chunks
  }, [services, useCarousel, itemsPerSlide])

  const gridClass = useCarousel
    ? 'grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 xl:gap-8'
    : 'grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:gap-8'

  useEffect(() => {
    setCurrentLanguage(i18n.language as 'en' | 'de' | 'al')
  }, [i18n.language])

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    setCurrentSlide(0)
  }, [services.length])

  useEffect(() => {
    if (!useCarousel || slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [useCarousel, slides.length])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      const data = await response.json()

      if (data.success) {
        setServices(data.data.filter((service: Service) => service.isActive))
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const getCurrentLanguageText = (textObj: { en: string; de: string; al: string }) => {
    return textObj[currentLanguage] || textObj.en
  }

  const getWallLabels = (service: Service) => {
    const labels: string[] = []

    if (service.exteriorWall) {
      labels.push(
        currentLanguage === 'de'
          ? 'Außenwand'
          : currentLanguage === 'al'
            ? 'Mur i Jashtëm'
            : 'Exterior Wall'
      )
    }

    if (service.interiorWall) {
      labels.push(
        currentLanguage === 'de'
          ? 'Innenwand'
          : currentLanguage === 'al'
            ? 'Mur i Brendshëm'
            : 'Interior Wall'
      )
    }

    service.customWalls?.forEach((wall) => {
      if (wall.name?.trim()) labels.push(wall.name.trim())
    })

    return labels
  }

  const handleServiceClick = (serviceId: string) => {
    router.push(`/services/${serviceId}`)
  }

  const goToSlide = (index: number) => setCurrentSlide(index)
  const goToPrevious = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  const goToNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length)

  const renderCarousel = () => (
    <>
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slideServices, slideIndex) => (
            <div key={slideIndex} className="w-full shrink-0">
              <div className={gridClass}>
                {slideServices.map((service) => (
                  <ServiceCard
                    key={service._id}
                    service={service}
                    title={getCurrentLanguageText(service.title)}
                    description={getCurrentLanguageText(service.description)}
                    viewLabel={t('readMore')}
                    wallLabels={getWallLabels(service)}
                    onClick={() => handleServiceClick(service._id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {useCarousel && slides.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={goToPrevious}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#191716]/15 text-[#191716] transition-colors duration-300 hover:border-[#DD4726] hover:bg-[#DD4726] hover:text-white"
            aria-label="Previous slide"
          >
            <FaChevronLeft size={14} />
          </button>

          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'w-8 bg-[#DD4726]' : 'w-2 bg-[#191716]/20'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goToNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#191716]/15 text-[#191716] transition-colors duration-300 hover:border-[#DD4726] hover:bg-[#DD4726] hover:text-white"
            aria-label="Next slide"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      )}
    </>
  )

  if (services.length === 0) {
    return (
      <section className="bg-[#F3F4F4] px-5 py-12 lg:px-[60px] lg:py-24 2xl:px-[120px]">
        <p className="font-zonapro text-center text-[#666666]">{t('serviceDescription')}</p>
      </section>
    )
  }

  return (
    <section className="bg-[#F3F4F4] py-16 lg:py-20">
      {/* Mobile header */}
      <div className="px-6 lg:hidden">
        <p className="font-zonapro text-left text-[#DD4624]">{t('services')}</p>
        <p className="mt-3 font-zonapro text-left text-[32px] font-semibold text-black">{t('our_services')}</p>
        <p className="mt-6 max-w-full font-zonapro text-[18px] leading-[26px] text-[#191716]">
          {t('serviceDescription')}
        </p>
      </div>

      {/* Mobile layout */}
      <div className="mt-14 px-6 lg:hidden">{renderCarousel()}</div>

      {/* Large devices — projects-style layout */}
      <div className="mx-auto hidden px-5 lg:flex lg:flex-row lg:items-start lg:gap-12 lg:px-[60px] xl:gap-16 2xl:px-[120px]">
        <div className="flex shrink-0 items-start lg:py-6">
          <h2 className="font-zonapro text-[3.25rem] font-normal leading-none tracking-tight text-[#1a1a1a] [writing-mode:vertical-rl] rotate-180">
            {t('our_services')}
          </h2>
        </div>

        <div className="min-w-0 flex-1">{renderCarousel()}</div>
      </div>
    </section>
  )
}

export default OurServices
