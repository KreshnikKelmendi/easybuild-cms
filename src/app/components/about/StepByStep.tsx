'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { FaFacebookF, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { IconType } from 'react-icons'
import { toDisplayImageUrl } from '@/lib/blobUrl'

interface StepByStepData {
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
  images: string[]
}

interface SocialMedia {
  _id: string
  platform: string
  icon: string
  url: string
  isActive: boolean
  order: number
}

const STEP_SOCIAL_PLATFORMS = ['instagram', 'facebook', 'linkedin'] as const
const IMAGE_COUNT = 6

const iconMap: Record<string, IconType> = {
  FaFacebookF: FaFacebookF,
  FaInstagram: FaInstagram,
  FaLinkedin: FaLinkedin,
}

const getSocialIcon = (social: SocialMedia) => {
  if (social.icon && iconMap[social.icon]) return iconMap[social.icon]

  const platform = social.platform.toLowerCase()
  if (platform.includes('instagram')) return FaInstagram
  if (platform.includes('facebook')) return FaFacebookF
  if (platform.includes('linkedin')) return FaLinkedin

  return FaInstagram
}

const pickStepSocialLinks = (socialMedia: SocialMedia[]) =>
  STEP_SOCIAL_PLATFORMS.map((name) =>
    socialMedia.find((sm) => sm.platform.toLowerCase() === name && sm.isActive)
  ).filter((sm): sm is SocialMedia => Boolean(sm))

const SocialLinks = ({ links }: { links: SocialMedia[] }) => {
  if (links.length === 0) return null

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      {links.map((social) => {
        const Icon = getSocialIcon(social)
        return (
          <a
            key={social._id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#191716]/10 px-3 py-1.5 font-zonapro text-xs text-[#666666] transition-all duration-300 hover:border-[#DD4624] hover:text-[#DD4624]"
            title={social.platform}
          >
            <Icon className="text-sm" />
            {social.platform}
          </a>
        )
      })}
    </div>
  )
}

const StepImageCard = ({
  image,
  idx,
  linkUrl,
}: {
  image: string
  idx: number
  linkUrl: string
}) => (
  <a
    href={linkUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative block aspect-[4/5] overflow-hidden"
  >
    <Image
      src={toDisplayImageUrl(image)}
      alt={`Step ${idx + 1}`}
      fill
      sizes="(max-width: 1024px) 30vw, 180px"
      className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.06]"
    />
  </a>
)

const StepGallery = ({
  images,
  linkUrl,
}: {
  images: string[]
  linkUrl: string
}) => (
  <div className="grid grid-cols-3 gap-3 sm:gap-4">
    {images.map((image, idx) => (
      <StepImageCard key={idx} image={image} idx={idx} linkUrl={linkUrl} />
    ))}
  </div>
)

const StepByStep = () => {
  const { t, i18n } = useTranslation()
  const [stepByStepData, setStepByStepData] = useState<StepByStepData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [socialLinks, setSocialLinks] = useState<SocialMedia[]>([])

  const currentLang = i18n.language as 'en' | 'de' | 'al'

  const imageLinkUrl =
    socialLinks.find((sm) => sm.platform.toLowerCase() === 'instagram')?.url ||
    socialLinks[0]?.url ||
    'https://www.instagram.com/easybuildks/'

  useEffect(() => {
    fetchStepByStepData()
    fetchSocialLinks()
  }, [])

  const fetchStepByStepData = async () => {
    try {
      const response = await fetch('/api/step-by-step')
      const data = await response.json()

      if (data.success && data.data) {
        const images = Array.isArray(data.data.images)
          ? data.data.images
          : Object.values(data.data.images || {}).filter((val: unknown): val is string => typeof val === 'string')
        setStepByStepData({ ...data.data, images })
      }
    } catch (error) {
      console.error('Error fetching step by step data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSocialLinks = async () => {
    try {
      const response = await fetch('/api/social-media')
      if (response.ok) {
        const socialMedia: SocialMedia[] = await response.json()
        setSocialLinks(pickStepSocialLinks(socialMedia))
      }
    } catch (error) {
      console.error('Error fetching social media:', error)
    }
  }

  const getTitle = () => {
    if (!stepByStepData?.title) return t('step_by_step')
    return stepByStepData.title[currentLang] || stepByStepData.title.en || t('step_by_step')
  }

  const getDescription = () => {
    if (!stepByStepData?.description) return t('step_by_step_description')
    return (
      stepByStepData.description[currentLang] ||
      stepByStepData.description.en ||
      t('step_by_step_description')
    )
  }

  const safeImages = (
    stepByStepData?.images?.length
      ? stepByStepData.images
      : ['/assets/step1.png', '/assets/step2.png', '/assets/step3.png']
  ).slice(0, IMAGE_COUNT)

  const loadingSpinner = (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#DD4624]/30 border-t-[#DD4624]" />
    </div>
  )

  const gallery = isLoading ? loadingSpinner : <StepGallery images={safeImages} linkUrl={imageLinkUrl} />

  return (
    <section className="py-14 lg:pt-40 lg:pb-24">
      <div className="px-5 lg:px-[60px] 2xl:px-[120px]">
        {/* Mobile */}
        <div className="lg:hidden">
          <h2 className="text-left font-zonapro text-[32px] font-semibold leading-tight text-[#191716]">
            {getTitle()}
          </h2>
          <p className="mt-4 text-left font-zonapro text-base leading-relaxed text-[#666666]">{getDescription()}</p>
          <SocialLinks links={socialLinks} />
          <div className="mt-8">{gallery}</div>
        </div>

        {/* Desktop — text block + images side by side, vertically centered */}
        <div className="hidden lg:flex lg:w-full lg:items-center lg:gap-10 xl:gap-14">
          <div className="flex w-1/2 flex-col justify-center">
            <h2 className="font-zonapro text-[2.5rem] font-normal leading-tight tracking-tight text-[#1a1a1a] xl:text-[3rem]">
              {getTitle()}
            </h2>
            <p className="mt-5 font-zonapro text-base leading-relaxed text-[#666666] xl:text-lg">
              {getDescription()}
            </p>
            <SocialLinks links={socialLinks} />
          </div>

          <div className="w-1/2 min-w-0">{gallery}</div>
        </div>
      </div>
    </section>
  )
}

export default StepByStep
