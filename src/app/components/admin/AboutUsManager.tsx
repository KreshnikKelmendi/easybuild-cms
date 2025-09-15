'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChunkedUploader, uploadFileInChunks } from '@/lib/chunkedUpload';

type LanguageCode = 'en' | 'de' | 'al';

interface AboutUsData {
  title: {
    en: string;
    de: string;
    al: string;
  };
  description: {
    en: string;
    de: string;
    al: string;
  };
  missionDescription: {
    en: string;
    de: string;
    al: string;
  };
  images: string[];
}

const AboutUsManager = () => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [formData, setFormData] = useState<AboutUsData>({
    title: { en: '', de: '', al: '' },
    description: { en: '', de: '', al: '' },
    missionDescription: { en: '', de: '', al: '' },
    images: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentAboutUs, setCurrentAboutUs] = useState<AboutUsData | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchCurrentAboutUs();
  }, []);

  const fetchCurrentAboutUs = async () => {
    try {
      const response = await fetch('/api/about-us');
      const data = await response.json();
      
      if (data.success && data.data) {
        setCurrentAboutUs(data.data);
        setFormData({
          title: {
            en: data.data.title?.en || '',
            de: data.data.title?.de || '',
            al: data.data.title?.al || ''
          },
          description: {
            en: data.data.description?.en || '',
            de: data.data.description?.de || '',
            al: data.data.description?.al || ''
          },
          missionDescription: {
            en: data.data.missionDescription?.en || '',
            de: data.data.missionDescription?.de || '',
            al: data.data.missionDescription?.al || ''
          },
          images: data.data.images || [],
        });
      }
    } catch (_error) {
      console.error('Error fetching current about us:', _error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [field, lang] = name.split('.');
      setFormData(prev => {
        const currentField = prev[field as keyof AboutUsData];
        if (typeof currentField === 'object' && currentField !== null) {
          return {
            ...prev,
            [field]: {
              ...currentField,
              [lang]: value
            }
          };
        }
        return prev;
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      setMessage('');

      try {
        const uploadPromises = Array.from(files).map(async (file) => {
          if (!file.type.startsWith('image/')) {
            throw new Error(`File ${file.name} is not an image`);
          }

          // Check if file needs chunking (larger than 4MB)
          if (ChunkedUploader.needsChunking(file)) {
            const uploadResult = await uploadFileInChunks(file, {
              onProgress: (progress) => {
                console.log(`Uploading ${file.name}: ${progress}% complete`);
              },
            });
            
            if (uploadResult.success && uploadResult.data) {
              return uploadResult.data.path;
            } else {
              throw new Error(uploadResult.message || 'Upload failed');
            }
          } else {
            // Regular upload
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('/api/upload-image-cloudinary', {
              method: 'POST',
              body: formData,
            });
            
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
              return data.data.path;
            } else {
              throw new Error(data.message || 'Upload failed');
            }
          }
        });

        const uploadedPaths = await Promise.all(uploadPromises);
        
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedPaths]
        }));
        
        setMessage(`${uploadedPaths.length} image(s) uploaded successfully!`);
      } catch (error) {
        console.error('Upload error:', error);
        setMessage(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Check if we have all required fields
    if (!formData.images.length) {
      setMessage('Please upload at least one image');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/about-us', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('About us section saved successfully!');
        fetchCurrentAboutUs();
      } else {
        setMessage(data.message || 'Failed to save about us section');
      }
    } catch {
      setMessage('An error occurred while saving the about us section');
    } finally {
      setIsLoading(false);
    }
  };

  const languages: Array<{ code: LanguageCode; name: string; flag: string }> = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'al', name: 'Shqip', flag: '🇦🇱' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white">
      {/* Simple Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-black mb-1 font-zonapro">About Us Manager</h1>
        <p className="text-black font-zonapro">Create and edit your about us section content</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded text-center font-zonapro ${
          message.includes('successfully') 
            ? 'bg-green-100 text-black border border-green-300' 
            : 'bg-red-100 text-black border border-red-300'
        }`}>
          {message}
        </div>
      )}

      {/* Main Form */}
      <div className="border border-gray-300 p-4 mb-4">
        {/* Language Tabs */}
        <div className="flex mb-4 border-b border-gray-300">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setCurrentLanguage(lang.code)}
              className={`px-4 py-2 font-medium border-b-2 font-zonapro ${
                currentLanguage === lang.code
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-black'
              }`}
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-black mb-1 font-zonapro">
              Title ({languages.find(l => l.code === currentLanguage)?.name})
            </label>
            <input
              type="text"
              name={`title.${currentLanguage}`}
              value={formData.title[currentLanguage]}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:border-black text-black font-zonapro"
              placeholder="Enter about us title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-black mb-1 font-zonapro">
              Description ({languages.find(l => l.code === currentLanguage)?.name})
            </label>
            <textarea
              name={`description.${currentLanguage}`}
              value={formData.description[currentLanguage]}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:border-black text-black resize-none font-zonapro"
              placeholder="Enter about us description"
              required
            />
          </div>

          {/* Mission Description */}
          <div>
            <label className="block text-sm font-medium text-black mb-1 font-zonapro">
              Mission Description ({languages.find(l => l.code === currentLanguage)?.name})
            </label>
            <textarea
              name={`missionDescription.${currentLanguage}`}
              value={formData.missionDescription[currentLanguage]}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:border-black text-black resize-none font-zonapro"
              placeholder="Enter mission description"
              required
            />
          </div>

          {/* Images Upload */}
          <div>
            <label className="block text-sm font-medium text-black mb-1 font-zonapro">
              Images (Multiple images will be shown in a slider)
            </label>
            
            {/* File Upload */}
            <div className="mb-3">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={isUploading}
                className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:border-black text-black disabled:opacity-50 font-zonapro"
              />
              <p className="text-xs text-gray-600 mt-1 font-zonapro">
                {isUploading ? 'Uploading...' : 'Select multiple image files (PNG, JPG, WebP, etc.)'}
              </p>
            </div>
            
            {/* Images Preview */}
            {formData.images.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-black font-zonapro">Images Preview ({formData.images.length}):</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full h-24 border border-gray-300 rounded overflow-hidden">
                        <Image 
                          src={image} 
                          alt={`Preview ${index + 1}`} 
                          width={100}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 truncate font-zonapro">
                        Image {index + 1}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={async () => {
                try {
                  const response = await fetch('/api/seed-about-us', { method: 'POST' });
                  const data = await response.json();
                  if (data.success) {
                    setMessage('Sample about us section created!');
                    fetchCurrentAboutUs();
                  } else {
                    setMessage(data.message || 'Failed to create sample about us section');
                  }
                } catch {
                  setMessage('Error creating sample about us section');
                }
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-zonapro"
            >
              Create Sample
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 font-zonapro"
            >
              {isLoading ? 'Saving...' : 'Save About Us Section'}
            </button>
          </div>
        </form>
      </div>

      {/* Current About Us */}
      {currentAboutUs && (
        <div className="border border-gray-300 p-4">
          <h3 className="text-lg font-medium text-black mb-3 font-zonapro">Current About Us Section</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {languages.map((lang) => (
              <div key={lang.code} className="p-3 bg-gray-100 rounded border border-gray-200">
                <div className="font-medium text-black mb-2 font-zonapro">{lang.flag} {lang.name}</div>
                <div className="text-sm text-black">
                  <div className="mb-1 font-zonapro"><strong>Title:</strong> {currentAboutUs.title?.[lang.code] || 'Not set'}</div>
                  <div className="mb-1 font-zonapro"><strong>Description:</strong> {currentAboutUs.description?.[lang.code] || 'Not set'}</div>
                  <div className="font-zonapro"><strong>Mission:</strong> {currentAboutUs.missionDescription?.[lang.code] || 'Not set'}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Images Preview */}
          <div className="mt-4 p-3 bg-gray-100 rounded border border-gray-200">
            <div className="font-medium text-black mb-2 font-zonapro">🖼️ Images ({currentAboutUs.images?.length || 0})</div>
            {currentAboutUs.images && currentAboutUs.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {currentAboutUs.images.map((image, index) => (
                  <div key={index} className="relative">
                    <div className="w-full h-24 border border-gray-300 rounded overflow-hidden">
                      <Image 
                        src={image} 
                        alt={`About us image ${index + 1}`}
                        width={100}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1 font-zonapro">Image {index + 1}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUsManager;
