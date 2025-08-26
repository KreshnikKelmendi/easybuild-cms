'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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

const ProjectsOnHomePage = () => {
  const { i18n } = useTranslation()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'de' | 'al'>('en')
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    setCurrentLanguage(i18n.language as 'en' | 'de' | 'al')
  }, [i18n.language])

  useEffect(() => {
    fetchProjects()
  }, [])

  // Auto-advance carousel when there are more than 4 projects
  useEffect(() => {
    if (projects.length > 4) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.ceil(projects.length / 4))
      }, 3000) // Change slide every 3 seconds

      return () => clearInterval(interval)
    }
  }, [projects.length])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      
      console.log('Projects API response:', data)
      
      if (data.success) {
        const activeProjects = data.data.filter((project: Project) => project.isActive)
        console.log('Active projects:', activeProjects)
        setProjects(activeProjects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const getCurrentLanguageText = (textObj: { en: string; de: string; al: string }) => {
    return textObj[currentLanguage] || textObj.en
  }

  // Function to limit text to 75 words
  const limitTo75Words = (text: string) => {
    const words = text.split(' ')
    if (words.length <= 75) return text
    return words.slice(0, 75).join(' ') + '...'
  }

  // Function to handle project click
  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }

  if (projects.length === 0) {
    return (
      <div className="bg-white py-0 lg:py-24">
        <div className="mx-auto px-5 lg:px-[60px] 2xl:px-[120px]">
          <div className="text-center">
            <div className="bg-gray-100 rounded-lg p-8 border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-lg font-medium mb-2">No projects available</p>
                <p className="text-sm">Projects will appear here once they are created in the admin panel.</p>
                <div className="mt-4 text-xs text-gray-400">
                  <p>Debug info: projects.length = {projects.length}</p>
                  <p>Check browser console for API response details</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Function to get projects for current slide
  const getProjectsForSlide = (slideIndex: number) => {
    const startIndex = slideIndex * 4
    return projects.slice(startIndex, startIndex + 4)
  }

  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="mx-auto px-5 lg:px-[60px] 2xl:px-[120px]">

        {/* Projects Display */}
        <div className="mx-auto z-50">
          <div className="flex items-center justify-center w-full h-full py-26 sm:py-8">
            {/* Desktop and large size devices - 4 projects in a row */}
            <div className="lg:block hidden w-full">
              {projects.length <= 4 ? (
                // Static grid for 4 or fewer projects
                <div className="grid grid-cols-4 gap-4">
                  {projects.map((project) => (
                    <div 
                      key={project._id} 
                      className="flex flex-shrink-0 relative w-full cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => handleProjectClick(project._id)}
                    >
                      {project.mainImage ? (
                        <Image 
                          src={project.mainImage} 
                          alt={getCurrentLanguageText(project.title)} 
                          width={400}
                          height={613}
                          className="object-cover object-center w-full h-[613px] rounded-[15px]" 
                        />
                      ) : (
                        <div className="w-full h-[613px] rounded-[15px] bg-gray-200 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p>No image available</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute w-full h-full p-6">
                        <div className="flex flex-col h-full justify-end text-center pb-6 lg:text-[24px] font-custom font-normal text-white">
                          <p className="text-xl lg:text-[24px] font-custom font-normal leading-5 lg:leading-6">{getCurrentLanguageText(project.title)}</p>
                          <p className="text-[20px] mt-[3px]">{limitTo75Words(getCurrentLanguageText(project.description))}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Carousel for more than 4 projects
                <div className="relative overflow-hidden">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {Array.from({ length: Math.ceil(projects.length / 4) }).map((_, slideIndex) => (
                      <div key={slideIndex} className="flex-shrink-0 w-full">
                        <div className="grid grid-cols-4 gap-4">
                          {getProjectsForSlide(slideIndex).map((project) => (
                            <div 
                              key={project._id} 
                              className="flex flex-shrink-0 relative w-full cursor-pointer hover:scale-105 transition-transform duration-300"
                              onClick={() => handleProjectClick(project._id)}
                            >
                              {project.mainImage ? (
                                <Image 
                                  src={project.mainImage} 
                                  alt={getCurrentLanguageText(project.title)} 
                                  width={400}
                                  height={400}
                                  className="object-cover object-center w-full h-[65vh] rounded-[15px]" 
                                />
                              ) : (
                                <div className="w-full h-[613px] rounded-[15px] bg-gray-200 flex items-center justify-center">
                                  <div className="text-center text-gray-500">
                                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p>No image available</p>
                                  </div>
                                </div>
                              )}
                              <div className="absolute w-full h-full p-6">
                                <div className="flex flex-col h-full justify-end text-center pb-6 lg:text-[24px] font-custom font-normal text-white">
                                  <p className="text-xl lg:text-[24px] font-custom font-normal leading-5 lg:leading-6">{getCurrentLanguageText(project.title)}</p>
                                  <p className="text-[20px] mt-[3px]">{limitTo75Words(getCurrentLanguageText(project.description))}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tablet and medium size devices - 2 projects in a row */}
            <div className="lg:hidden md:block hidden w-full">
              {projects.length <= 2 ? (
                // Static grid for 2 or fewer projects
                <div className="grid grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <div 
                      key={project._id} 
                      className="flex flex-shrink-0 relative w-full cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => handleProjectClick(project._id)}
                    >
                      {project.mainImage ? (
                        <Image 
                          src={project.mainImage} 
                          alt={getCurrentLanguageText(project.title)} 
                          width={400}
                          height={384}
                          className="object-cover object-center w-full h-96" 
                        />
                      ) : (
                        <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p>No image available</p>
                          </div>
                        </div>
                      )}
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">{getCurrentLanguageText(project.title)}</h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">{limitTo75Words(getCurrentLanguageText(project.description))}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Carousel for more than 2 projects
                <div className="relative overflow-hidden">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {Array.from({ length: Math.ceil(projects.length / 2) }).map((_, slideIndex) => (
                      <div key={slideIndex} className="flex-shrink-0 w-full">
                        <div className="grid grid-cols-2 gap-6">
                          {projects.slice(slideIndex * 2, slideIndex * 2 + 2).map((project) => (
                            <div 
                              key={project._id} 
                              className="flex flex-shrink-0 relative w-full cursor-pointer hover:scale-105 transition-transform duration-300"
                              onClick={() => handleProjectClick(project._id)}
                            >
                              {project.mainImage ? (
                                <Image 
                                  src={project.mainImage} 
                                  alt={getCurrentLanguageText(project.title)} 
                                  width={400}
                                  height={384}
                                  className="object-cover object-center w-full h-96" 
                                />
                              ) : (
                                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                                  <div className="text-center text-gray-500">
                                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p>No image available</p>
                                  </div>
                                </div>
                              )}
                              <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                                <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">{getCurrentLanguageText(project.title)}</h2>
                                <div className="flex h-full items-end pb-6">
                                  <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">{limitTo75Words(getCurrentLanguageText(project.description))}</h3>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile and Small size Devices - 1 project at a time */}
            <div className="block md:hidden w-full">
              {projects.length <= 1 ? (
                // Static display for 1 project
                <div className="space-y-6">
                  {projects.map((project) => (
                    <div 
                      key={project._id} 
                      className="flex flex-shrink-0 relative w-full cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => handleProjectClick(project._id)}
                    >
                      {project.mainImage ? (
                        <Image 
                          src={project.mainImage} 
                          alt={getCurrentLanguageText(project.title)} 
                          width={400}
                          height={384}
                          className="object-cover object-center w-full h-96 rounded-[15px]" 
                        />
                      ) : (
                        <div className="w-full h-96 rounded-[15px] bg-gray-200 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p>No image available</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute w-full h-full p-6">
                        <div className="flex flex-col h-full justify-end text-center pb-6 text-white">
                          <p className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6">{getCurrentLanguageText(project.title)}</p>
                          <p className="text-[20px] mt-[3px]">{limitTo75Words(getCurrentLanguageText(project.description))}</p>
                        </div>
                                                      {/* Additional Images Grid */}
                              {project.additionalImages && project.additionalImages.length > 0 && (
                                <div className="absolute top-4 right-4">
                                  <div className="grid grid-cols-2 gap-2">
                                    {project.additionalImages.slice(0, 4).map((image, imgIndex) => (
                                      <div
                                        key={imgIndex}
                                        className="w-12 h-12 rounded-lg overflow-hidden shadow-lg border-2 border-white bg-gray-100"
                                      >
                                        <Image
                                          src={image}
                                          alt={`${getCurrentLanguageText(project.title)} ${imgIndex + 1}`}
                                          width={48}
                                          height={48}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Carousel for more than 1 project
                <div className="relative overflow-hidden">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {projects.map((project, slideIndex) => (
                      <div key={slideIndex} className="flex-shrink-0 w-full">
                        <div className="space-y-6">
                          <div 
                            className="flex flex-shrink-0 relative w-full cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() => handleProjectClick(project._id)}
                          >
                            {project.mainImage ? (
                              <Image 
                                src={project.mainImage} 
                                alt={getCurrentLanguageText(project.title)} 
                                width={400}
                                height={384}
                                className="object-cover object-center w-full h-96 rounded-[15px]" 
                              />
                            ) : (
                              <div className="w-full h-96 rounded-[15px] bg-gray-200 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                  <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <p>No image available</p>
                                </div>
                              </div>
                            )}
                            <div className="absolute w-full h-full p-6">
                              <div className="flex flex-col h-full justify-end text-center pb-6 text-white">
                                <p className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6">{getCurrentLanguageText(project.title)}</p>
                                <p className="text-[20px] mt-[3px]">{limitTo75Words(getCurrentLanguageText(project.description))}</p>
                              </div>
                              {/* Additional Images Grid */}
                              {project.additionalImages && project.additionalImages.length > 0 && (
                                <div className="absolute top-4 right-4">
                                  <div className="grid grid-cols-2 gap-2">
                                    {project.additionalImages.slice(0, 4).map((image, imgIndex) => (
                                      <div
                                        key={imgIndex}
                                        className="w-12 h-12 rounded-lg overflow-hidden shadow-lg border-2 border-white bg-gray-100"
                                      >
                                        <Image
                                          src={image}
                                          alt={`${getCurrentLanguageText(project.title)} ${imgIndex + 1}`}
                                          width={48}
                                          height={48}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectsOnHomePage
