'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

type LanguageCode = 'en' | 'de' | 'al';

interface BannerData {
  title: {
    en: string;
    de: string;
    al: string;
  };
  subtitle: {
    en: string;
    de: string;
    al: string;
  };
  image: string;
}

const BannerManager = () => {
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [formData, setFormData] = useState<BannerData>({
    title: { en: '', de: '', al: '' },
    subtitle: { en: '', de: '', al: '' },
    image: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentBanner, setCurrentBanner] = useState<BannerData | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchCurrentBanner();
  }, []);

  useEffect(() => {
    // Update image preview when language changes
    if (formData.image) {
      // Image preview is handled directly in the UI using formData.image
    }
  }, [formData.image]);

  const fetchCurrentBanner = async () => {
    try {
      const response = await fetch('/api/banner');
      const data = await response.json();
      
      if (data.success && data.data) {
        setCurrentBanner(data.data);
        setFormData({
          title: {
            en: data.data.title?.en || '',
            de: data.data.title?.de || '',
            al: data.data.title?.al || ''
          },
          subtitle: {
            en: data.data.subtitle?.en || '',
            de: data.data.subtitle?.de || '',
            al: data.data.subtitle?.al || ''
          },
          image: data.data.image || '',
        });
      }
    } catch (_error) {
      console.error('Error fetching current banner:', _error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [field, lang] = name.split('.');
      setFormData(prev => {
        const currentField = prev[field as keyof BannerData];
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
    const file = e.target.files?.[0];
    if (file) {
      // Check if it's an image file
      if (file.type.startsWith('image/')) {
        setIsUploading(true);
        
        try {
          // Create FormData for file upload
          const formData = new FormData();
          formData.append('file', file);
          
          // Upload file to server
          const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
          });
          
          const data = await response.json();
          
          if (data.success) {
            // Set the returned file path for the current language
            setFormData(prev => ({
              ...prev,
              image: data.data.path
            }));
            setMessage('Image uploaded successfully!');
          } else {
            setMessage(data.message || 'Failed to upload image');
          }
        } catch (_error) {
          setMessage('Error uploading image');
        } finally {
          setIsUploading(false);
        }
      } else {
        setMessage('Please select an image file (PNG, JPG, etc.)');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Check if we have images for all languages
    if (!formData.image) {
      setMessage('Please upload an image for all languages');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Banner saved successfully!');
        fetchCurrentBanner();
      } else {
        setMessage(data.message || 'Failed to save banner');
      }
    } catch (_error) {
      setMessage('An error occurred while saving the banner');
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
        <h1 className="text-2xl font-bold text-black mb-1">Banner Manager</h1>
        <p className="text-black">Create and edit your banner content</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded text-center ${
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
              className={`px-4 py-2 font-medium border-b-2 ${
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
            <label className="block text-sm font-medium text-black mb-1">
              Title ({languages.find(l => l.code === currentLanguage)?.name})
            </label>
            <input
              type="text"
              name={`title.${currentLanguage}`}
              value={formData.title[currentLanguage]}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:border-black text-black"
              placeholder="Enter banner title"
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Description ({languages.find(l => l.code === currentLanguage)?.name})
            </label>
            <textarea
              name={`subtitle.${currentLanguage}`}
              value={formData.subtitle[currentLanguage]}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:border-black text-black resize-none"
              placeholder="Enter banner description"
              required
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Background Image
            </label>
            
            {/* File Upload */}
            <div className="mb-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:border-black text-black disabled:opacity-50"
              />
              <p className="text-xs text-gray-600 mt-1">
                {isUploading ? 'Uploading...' : 'Select an image file (PNG, JPG, WebP, etc.)'}
              </p>
            </div>
            
            {/* Image Preview */}
            {formData.image && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-black">Image Preview:</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        image: ''
                      }));
                    }}
                    className="text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Remove Image
                  </button>
                </div>
                <div className="relative w-32 h-24 border border-gray-300 rounded overflow-hidden">
                  <Image 
                    src={formData.image} 
                    alt="Preview" 
                    width={128}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">File: {formData.image}</p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={async () => {
                try {
                  const response = await fetch('/api/seed-banner', { method: 'POST' });
                  const data = await response.json();
                  if (data.success) {
                    setMessage('Sample banner created!');
                    fetchCurrentBanner();
                  } else {
                    setMessage(data.message || 'Failed to create sample banner');
                  }
                } catch (_error) {
                  setMessage('Error creating sample banner');
                }
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Create Sample
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Banner'}
            </button>
          </div>
        </form>
      </div>

      {/* Current Banner */}
      {currentBanner && (
        <div className="border border-gray-300 p-4">
          <h3 className="text-lg font-medium text-black mb-3">Current Banner</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {languages.map((lang) => (
              <div key={lang.code} className="p-3 bg-gray-100 rounded border border-gray-200">
                <div className="font-medium text-black mb-2">{lang.flag} {lang.name}</div>
                <div className="text-sm text-black">
                  <div className="mb-1"><strong>Title:</strong> {currentBanner.title?.[lang.code] || 'Not set'}</div>
                  <div><strong>Description:</strong> {currentBanner.subtitle?.[lang.code] || 'Not set'}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Image Preview */}
          <div className="mt-4 p-3 bg-gray-100 rounded border border-gray-200">
            <div className="font-medium text-black mb-2">🖼️ Background Image (Used for all languages)</div>
            <div className="text-sm text-black mb-2">
              <strong>Image:</strong> {currentBanner.image || 'Not set'}
            </div>
            {currentBanner.image && (
              <div className="w-32 h-24 border border-gray-300 rounded overflow-hidden">
                <Image 
                  src={currentBanner.image} 
                  alt="Banner background"
                  width={128}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManager;

