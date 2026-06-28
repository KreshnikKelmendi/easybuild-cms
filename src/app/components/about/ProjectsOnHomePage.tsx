'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { toDisplayImageUrl } from '@/lib/blobUrl'

interface Project {
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
  mainImage: string
  additionalImages: string[]
  isActive: boolean
}

interface ProjectCardProps {
  project: Project
  title: string
  description: string
  viewLabel: string
  onClick: () => void
}

const ProjectCard = ({ project, title, description, viewLabel, onClick }: ProjectCardProps) => (
  <article className="group cursor-pointer" onClick={onClick}>
    <div className="relative mb-5 aspect-[3/4] overflow-hidden rounded-2xl bg-[#eceae4]">
      {project.mainImage ? (
        <Image
          src={toDisplayImageUrl(project.mainImage)}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[#999999]">
          <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#191716]/90 via-[#191716]/55 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />

      <div className="absolute inset-x-0 bottom-0 translate-y-full p-5 transition-transform duration-500 ease-out group-hover:translate-y-0">
        <p className="mb-3 line-clamp-3 font-zonapro text-sm leading-relaxed text-[#F3F4F4]">
          {description}
        </p>
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

const SeeAllButton = ({ label, onClick }: { label: string; onClick: () => void }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <div ref={ref} className="mt-10 flex justify-center lg:justify-end">
      <button
        type="button"
        onClick={onClick}
        className={`group inline-flex cursor-pointer items-center gap-2 font-zonapro text-sm font-medium text-[#191716] transition-all duration-700 ease-out hover:text-[#DD4726] ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <span className="border-b border-transparent pb-0.5 transition-colors duration-300 group-hover:border-[#DD4726]">
          {label}
        </span>
        <svg
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5 19L19 5" />
          <path d="M11 5h8v8" />
        </svg>
      </button>
    </div>
  )
}

const CarouselControls = ({
  total,
  current,
  onPrevious,
  onNext,
  onGoTo,
}: {
  total: number
  current: number
  onPrevious: () => void
  onNext: () => void
  onGoTo: (index: number) => void
}) => {
  if (total <= 1) return null

  return (
    <div className="mt-8 flex w-full items-center justify-between lg:w-auto lg:justify-center lg:gap-4">
      <button
        type="button"
        onClick={onPrevious}
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#191716]/15 text-[#191716] transition-colors duration-300 hover:border-[#DD4726] hover:bg-[#DD4726] hover:text-white"
        aria-label="Previous slide"
      >
        <FaChevronLeft size={14} />
      </button>

      <div className="flex flex-1 items-center justify-center gap-2 lg:flex-none">
        {Array.from({ length: total }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onGoTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === index ? 'w-8 bg-[#DD4726]' : 'w-2 bg-[#191716]/20'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onNext}
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#191716]/15 text-[#191716] transition-colors duration-300 hover:border-[#DD4726] hover:bg-[#DD4726] hover:text-white"
        aria-label="Next slide"
      >
        <FaChevronRight size={14} />
      </button>
    </div>
  )
}

const ProjectsOnHomePage = () => {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'de' | 'al'>('en')
  const [mobileSlide, setMobileSlide] = useState(0)
  const [desktopSlide, setDesktopSlide] = useState(0)

  const useDesktopCarousel = projects.length > 3
  const desktopItemsPerSlide = useDesktopCarousel ? 4 : projects.length

  const desktopSlides = useMemo(() => {
    if (!useDesktopCarousel) return [projects]

    const chunks: Project[][] = []
    for (let i = 0; i < projects.length; i += desktopItemsPerSlide) {
      chunks.push(projects.slice(i, i + desktopItemsPerSlide))
    }
    return chunks
  }, [projects, useDesktopCarousel, desktopItemsPerSlide])

  const desktopGridClass = useDesktopCarousel
    ? 'grid grid-cols-4 gap-6 xl:gap-8'
    : 'grid grid-cols-3 gap-6 xl:gap-8'

  useEffect(() => {
    setCurrentLanguage(i18n.language as 'en' | 'de' | 'al')
  }, [i18n.language])

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    setMobileSlide(0)
    setDesktopSlide(0)
  }, [projects.length])

  useEffect(() => {
    if (projects.length <= 1) return

    const interval = setInterval(() => {
      setMobileSlide((prev) => (prev + 1) % projects.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [projects.length])

  useEffect(() => {
    if (!useDesktopCarousel || desktopSlides.length <= 1) return

    const interval = setInterval(() => {
      setDesktopSlide((prev) => (prev + 1) % desktopSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [useDesktopCarousel, desktopSlides.length])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()

      if (data.success) {
        setProjects(data.data.filter((project: Project) => project.isActive))
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const getCurrentLanguageText = (textObj: { en: string; de: string; al: string }) => {
    return textObj[currentLanguage] || textObj.en
  }

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }

  const handleSeeAllProjects = () => {
    router.push('/projects')
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  const renderProjectCard = (project: Project) => {
    const title = getCurrentLanguageText(project.title)
    const description = getCurrentLanguageText(project.description)

    return (
      <ProjectCard
        key={project._id}
        project={project}
        title={title}
        description={description}
        viewLabel={t('viewProject')}
        onClick={() => handleProjectClick(project._id)}
      />
    )
  }

  if (projects.length === 0) {
    return (
      <section className="px-5 py-12 lg:px-[60px] lg:py-24 2xl:px-[120px]">
        <p className="font-zonapro text-center text-[#666666]">{t('projectsDescription')}</p>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-36">
      {/* Mobile header */}
      <div className="px-6 lg:hidden">
        <p className="font-zonapro text-left text-[#DD4624]">{t('Projects')}</p>
        <p className="mt-3 font-zonapro text-left text-[32px] font-semibold text-black">{t('ourProjects')}</p>
        <p className="mt-6 max-w-full font-zonapro text-[18px] leading-[26px] text-[#191716]">
          {t('projectsDescription')}
        </p>
      </div>

      {/* Mobile layout */}
      <div className="mt-14 px-6 lg:hidden">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${mobileSlide * 100}%)` }}
          >
            {projects.map((project) => (
              <div key={project._id} className="w-full shrink-0 px-1">
                {renderProjectCard(project)}
              </div>
            ))}
          </div>
        </div>

        <CarouselControls
          total={projects.length}
          current={mobileSlide}
          onPrevious={() => setMobileSlide((prev) => (prev - 1 + projects.length) % projects.length)}
          onNext={() => setMobileSlide((prev) => (prev + 1) % projects.length)}
          onGoTo={setMobileSlide}
        />

        <SeeAllButton label={t('seeAll')} onClick={handleSeeAllProjects} />
      </div>

      {/* Large devices */}
      <div className="mx-auto hidden px-5 lg:flex lg:flex-row lg:items-start lg:gap-12 lg:px-[60px] xl:gap-16 2xl:px-[120px]">
        <div className="flex shrink-0 items-start lg:py-6">
          <h2 className="font-zonapro text-[3.25rem] font-normal leading-none tracking-tight text-[#1a1a1a] [writing-mode:vertical-rl] rotate-180">
            {t('ourProjects')}
          </h2>
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${desktopSlide * 100}%)` }}
            >
              {desktopSlides.map((slideProjects, slideIndex) => (
                <div key={slideIndex} className="w-full shrink-0">
                  <div className={desktopGridClass}>
                    {slideProjects.map((project) => renderProjectCard(project))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <CarouselControls
            total={desktopSlides.length}
            current={desktopSlide}
            onPrevious={() =>
              setDesktopSlide((prev) => (prev - 1 + desktopSlides.length) % desktopSlides.length)
            }
            onNext={() => setDesktopSlide((prev) => (prev + 1) % desktopSlides.length)}
            onGoTo={setDesktopSlide}
          />

          <SeeAllButton label={t('seeAll')} onClick={handleSeeAllProjects} />
        </div>
      </div>
    </section>
  )
}

export default ProjectsOnHomePage
