'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import { toDisplayImageUrl } from '@/lib/blobUrl'

interface Wood {
  _id: string
  title: {
    en: string
    de: string
    al: string
  }
  imageUrl: string
  isActive: boolean
  order: number
}

interface WoodCardProps {
  wood: Wood
  title: string
}

const MobileWoodCard = ({ wood, title }: WoodCardProps) => (
  <article className="group flex flex-col items-center justify-center">
    <div className="relative h-24 w-24 overflow-hidden rounded-full sm:h-28 sm:w-28">
      <Image
        src={toDisplayImageUrl(wood.imageUrl)}
        alt={title}
        fill
        sizes="112px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <p className="mt-4 w-full max-w-[160px] text-center font-zonapro text-base font-normal leading-snug text-[#F3F4F4]">
      {title}
    </p>
  </article>
)

const DesktopWoodCard = ({ wood, title }: WoodCardProps) => (
  <article className="group flex items-center gap-5 rounded-[15px] bg-[#191716]/10 p-5 transition-all duration-300 hover:bg-[#191716]/20">
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[15px] ring-2 ring-[#F3F4F4]/20 transition-all duration-300 group-hover:ring-[#F3F4F4]/45 xl:h-24 xl:w-24">
      <Image
        src={toDisplayImageUrl(wood.imageUrl)}
        alt={title}
        fill
        sizes="96px"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>
    <h3 className="font-zonapro text-lg font-normal leading-snug text-[#F3F4F4] xl:text-xl">
      {title}
    </h3>
  </article>
)

const Woods = () => {
  const { t, i18n } = useTranslation()
  const [woods, setWoods] = useState<Wood[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const currentLanguage = i18n.language as 'en' | 'de' | 'al'

  useEffect(() => {
    fetchWoods()
  }, [])

  const fetchWoods = async () => {
    try {
      const response = await fetch('/api/woods')
      const data = await response.json()

      if (data.success) {
        setWoods(data.data)
      }
    } catch (error) {
      console.error('Error fetching woods:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const header = (
    <div className="mb-10 max-w-3xl lg:mb-12">
      <h2 className="font-zonapro text-[2.25rem] font-normal leading-tight text-[#F3F4F4] sm:text-4xl lg:text-[48px] lg:leading-[1.1]">
        {t('materials_that_we_use')}
      </h2>
      <p className="mt-4 max-w-2xl font-zonapro text-base leading-relaxed text-[#F3F4F4]/90 lg:mt-6 lg:text-lg">
        {t('second_materials_that_we_use')}
      </p>
    </div>
  )

  const loadingState = (
    <div className="flex items-center justify-center py-16">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#F3F4F4]/30 border-t-[#F3F4F4]" />
    </div>
  )

  const emptyState = (
    <p className="py-16 text-center font-zonapro text-lg text-[#F3F4F4]/80">
      {t('no_materials_available')}
    </p>
  )

  return (
    <section className="w-full">
      {/* Mobile */}
      <div className="px-5 py-10 lg:hidden">
        <div className="overflow-hidden rounded-[15px] bg-[#DD4624] px-6 py-12">
          {header}

          {isLoading ? (
            loadingState
          ) : woods.length === 0 ? (
            emptyState
          ) : (
            <div className="grid grid-cols-2 gap-8">
              {woods.map((wood) => (
                <MobileWoodCard
                  key={wood._id}
                  wood={wood}
                  title={wood.title[currentLanguage]}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop — rounded container, horizontal cards */}
      <div className="hidden px-[60px] py-16 lg:block 2xl:px-[120px] 2xl:py-20">
        <div className="w-full overflow-hidden rounded-[15px] bg-[#DD4624] px-10 py-14 2xl:px-16 2xl:py-16">
          {header}

          {isLoading ? (
            loadingState
          ) : woods.length === 0 ? (
            emptyState
          ) : (
            <div className="grid grid-cols-3 gap-6 xl:gap-8">
              {woods.map((wood) => (
                <DesktopWoodCard
                  key={wood._id}
                  wood={wood}
                  title={wood.title[currentLanguage]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Woods
