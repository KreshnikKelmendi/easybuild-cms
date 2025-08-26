'use client'

import React, { useState, useEffect } from 'react'
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
  createdAt: string
  updatedAt: string
}

const ProjectManager = () => {
  const [message, setMessage] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'de' | 'al'>('en')
  const [formData, setFormData] = useState<{
    title: { en: string; de: string; al: string }
    description: { en: string; de: string; al: string }
    mainImage: string
    additionalImages: string[]
  }>({
    title: { en: '', de: '', al: '' },
    description: { en: '', de: '', al: '' },
    mainImage: '',
    additionalImages: []
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      
      if (data.success) {
        setProjects(data.data)
      }
    } catch {
      console.error('Error fetching projects')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [field, lang] = name.split('.')
              if ((field === 'title' || field === 'description') && (lang === 'en' || lang === 'de' || lang === 'al')) {
          setFormData(prev => ({
            ...prev,
            [field]: {
              ...(prev[field as keyof typeof prev] as { en: string; de: string; al: string }),
              [lang]: value
            }
          }))
        }
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'additional' = 'main') => {
    const files = e.target.files
    if (files) {
      if (type === 'main') {
        const file = files[0]
        if (file && file.type.startsWith('image/')) {
          setIsUploading(true)
          
          try {
            const formData = new FormData()
            formData.append('file', file)
            
            const response = await fetch('/api/upload-image-cloudinary', {
              method: 'POST',
              body: formData,
            })
            
            const data = await response.json()
            
            if (data.success) {
              setFormData(prev => ({
                ...prev,
                mainImage: data.data.path
              }))
              setMessage('Main image uploaded successfully!')
            } else {
              setMessage(data.message || 'Failed to upload image')
            }
          } catch {
            setMessage('Error uploading image')
          } finally {
            setIsUploading(false)
          }
        } else {
          setMessage('Please select an image file (PNG, JPG, etc.)')
        }
      } else {
        // Handle additional images
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
        if (imageFiles.length > 0) {
          setIsUploading(true)
          
          try {
            const uploadedImages: string[] = []
            
            for (const file of imageFiles) {
              const formData = new FormData()
              formData.append('file', file)
              
              const response = await fetch('/api/upload-image-cloudinary', {
                method: 'POST',
                body: formData,
              })
              
              const data = await response.json()
              
              if (data.success) {
                uploadedImages.push(data.data.path)
              }
            }
            
            if (uploadedImages.length > 0) {
              setFormData(prev => ({
                ...prev,
                additionalImages: [...prev.additionalImages, ...uploadedImages]
              }))
              setMessage(`${uploadedImages.length} additional image(s) uploaded successfully!`)
            }
          } catch {
            setMessage('Error uploading additional images')
          } finally {
            setIsUploading(false)
          }
        } else {
          setMessage('Please select image files (PNG, JPG, etc.)')
        }
      }
    }
  }

  const removeAdditionalImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    // Check if all required fields are filled
    if (!formData.title.en || !formData.title.de || !formData.title.al) {
      setMessage('Please fill in titles for all languages')
      setIsLoading(false)
      return
    }

    if (!formData.description.en || !formData.description.de || !formData.description.al) {
      setMessage('Please fill in descriptions for all languages')
      setIsLoading(false)
      return
    }

    if (!formData.mainImage) {
      setMessage('Please upload a main image')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Project created successfully!')
        fetchProjects()
        // Reset form
        setFormData({
          title: { en: '', de: '', al: '' },
          description: { en: '', de: '', al: '' },
          mainImage: '',
          additionalImages: []
        })
      } else {
        setMessage(data.message || 'Failed to create project')
      }
    } catch {
      setMessage('An error occurred while creating the project')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/projects?id=${id}`, {
          method: 'DELETE',
        })

        const data = await response.json()

        if (data.success) {
          setMessage('Project deleted successfully!')
          fetchProjects()
        } else {
          setMessage(data.message || 'Failed to delete project')
        }
      } catch {
        setMessage('Error deleting project')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: { en: '', de: '', al: '' },
      description: { en: '', de: '', al: '' },
      mainImage: '',
      additionalImages: []
    })
  }

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'al', name: 'Shqip', flag: '🇦🇱' }
  ]

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl">
      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-center shadow-sm ${
          message.includes('successfully') 
            ? 'bg-green-50 text-black border border-green-200' 
            : 'bg-red-50 text-black border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Project Creation Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-black mb-4 text-center">
          🏗️ Create New Project
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Language Tabs */}
          <div className="flex justify-center mb-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setCurrentLanguage(lang.code as 'en' | 'de' | 'al')}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                    currentLanguage === lang.code
                      ? 'bg-white text-black shadow-sm'
                      : 'text-black hover:text-gray-700'
                  }`}
                >
                  {lang.flag} {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-black">
              Project Title ({languages.find(l => l.code === currentLanguage)?.name})
            </label>
            <input
              type="text"
              name={`title.${currentLanguage}`}
              value={formData.title[currentLanguage]}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black placeholder-gray-500"
              placeholder={`Enter title in ${languages.find(l => l.code === currentLanguage)?.name}`}
              required
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-black">
              Project Description ({languages.find(l => l.code === currentLanguage)?.name})
            </label>
            <textarea
              name={`description.${currentLanguage}`}
              value={formData.description[currentLanguage]}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black placeholder-gray-500 resize-none"
              placeholder={`Enter description in ${languages.find(l => l.code === currentLanguage)?.name}`}
              required
            />
          </div>

          {/* Main Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-black">
              Main Project Image *
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-200">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'main')}
                disabled={isUploading}
                className="hidden"
                id="main-image-upload"
              />
              <label htmlFor="main-image-upload" className="cursor-pointer">
                {formData.mainImage ? (
                  <div className="space-y-2">
                    <div className="w-32 h-24 mx-auto border border-gray-300 rounded-lg overflow-hidden">
                      <Image 
                        src={formData.mainImage} 
                        alt="Main Preview" 
                        width={128}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-black">Click to change main image</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-black">
                        {isUploading ? 'Uploading...' : 'Click to upload main image'}
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Additional Images Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-black">
              Additional Project Images (Optional)
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-200">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e, 'additional')}
                disabled={isUploading}
                className="hidden"
                id="additional-images-upload"
              />
              <label htmlFor="additional-images-upload" className="cursor-pointer">
                <div className="space-y-2">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-black">
                      {isUploading ? 'Uploading...' : 'Click to upload additional images'}
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB (Multiple files allowed)</p>
                  </div>
                </div>
              </label>
            </div>

            {/* Display Additional Images */}
            {formData.additionalImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-black mb-2">Uploaded Additional Images:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {formData.additionalImages.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="w-full h-20 border border-gray-200 rounded-md overflow-hidden">
                        <Image 
                          src={image} 
                          alt={`Additional ${index + 1}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading || isUploading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? 'Creating...' : '✨ Create Project'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold transition-colors duration-200"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-black">
            📋 Current Projects ({projects.length})
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => fetchProjects()}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm transition-colors duration-200"
            >
              🔄 Refresh
            </button>
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/seed-projects', { method: 'POST' })
                  const data = await response.json()
                  if (data.success) {
                    setMessage(data.message)
                    fetchProjects()
                  } else {
                    setMessage(data.message)
                  }
                } catch {
                  setMessage('Error seeding projects')
                }
              }}
              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm transition-colors duration-200"
            >
              🌱 Seed Sample Data
            </button>
          </div>
        </div>
        
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-black text-sm">No projects yet. Create your first one above!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <div key={project._id} className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-black bg-blue-50 px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    title="Delete project"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {languages.map((lang) => (
                    <div key={lang.code} className="bg-white rounded-md p-2 border border-gray-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{lang.flag}</span>
                        <span className="text-xs font-medium text-black uppercase">{lang.code}</span>
                      </div>
                      <p className="text-xs font-medium text-black">{project.title[lang.code as keyof typeof project.title]}</p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{project.description[lang.code as keyof typeof project.description]}</p>
                    </div>
                  ))}
                  
                  <div className="bg-white rounded-md p-2 border border-gray-100">
                    <p className="text-xs font-medium text-black uppercase mb-1">Main Image</p>
                    <div className="w-full h-20 border border-gray-200 rounded-md overflow-hidden">
                      <Image 
                        src={project.mainImage} 
                        alt="Project"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {project.additionalImages.length > 0 && (
                    <div className="bg-white rounded-md p-2 border border-gray-100">
                      <p className="text-xs font-medium text-black uppercase mb-1">Additional Images ({project.additionalImages.length})</p>
                      <div className="grid grid-cols-2 gap-1">
                        {project.additionalImages.slice(0, 4).map((image, imgIndex) => (
                          <div key={imgIndex} className="w-full h-16 border border-gray-200 rounded-md overflow-hidden">
                            <Image 
                              src={image} 
                              alt={`Additional ${imgIndex + 1}`}
                              width={64}
                              height={64}
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
        )}
      </div>
    </div>
  )
}

export default ProjectManager
