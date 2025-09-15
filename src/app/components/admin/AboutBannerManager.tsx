'use client';

import React, { useState, useEffect } from 'react';

import Image from 'next/image';
import { ChunkedUploader, uploadFileInChunks } from '@/lib/chunkedUpload';

type LanguageCode = 'en' | 'de' | 'al';

interface AboutBannerData {
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
  video: string;
}

const AboutBannerManager = () => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [formData, setFormData] = useState<AboutBannerData>({
    title: { en: '', de: '', al: '' },
    subtitle: { en: '', de: '', al: '' },
    image: '',
    video: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentBanner, setCurrentBanner] = useState<AboutBannerData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image');

  useEffect(() => {
    fetchCurrentBanner();
  }, []);

  const fetchCurrentBanner = async () => {
    try {
      const response = await fetch('/api/about-banner');
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
          video: data.data.video || '',
        });
      }
    } catch (_error) {
      console.error('Error fetching current about banner:', _error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [field, lang] = name.split('.');
      setFormData(prev => {
        const currentField = prev[field as keyof AboutBannerData];
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
      // Check file type based on upload type
      const isValidType = uploadType === 'image' 
        ? file.type.startsWith('image/')
        : file.type.startsWith('video/');
      
      if (isValidType) {
        await handleFileUpload(file);
      } else {
        setMessage(`Please select a ${uploadType} file`);
      }
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file) {
      setIsUploading(true);
      setMessage('');

      // Check if file needs chunking (larger than 4MB)
      if (ChunkedUploader.needsChunking(file)) {
        await handleChunkedUpload(file);
      } else {
        await handleRegularUpload(file);
      }
    }
  };

  const handleChunkedUpload = async (file: File) => {
    try {
      setMessage(`Large ${uploadType} detected. Using chunked upload...`);
      
      const uploadResult = await uploadFileInChunks(file, {
        onProgress: (progress) => {
          setMessage(`Uploading... ${progress}% complete`);
        },
        onChunkComplete: (chunkIndex, totalChunks) => {
          console.log(`Chunk ${chunkIndex + 1}/${totalChunks} completed`);
        }
      });
      
      if (uploadResult.success && uploadResult.data) {
        setFormData(prev => ({
          ...prev,
          [uploadType]: uploadResult.data!.path
        }));
        setMessage(`Large ${uploadType} uploaded successfully via chunked upload! (${Math.round(file.size / (1024 * 1024))}MB)`);
        console.log('Chunked upload complete:', uploadResult.data);
      } else {
        throw new Error(uploadResult.message || 'Chunked upload failed');
      }
    } catch (error) {
      console.error('Chunked upload error:', error);
      setMessage(`Chunked upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRegularUpload = async (file: File) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload file to Cloudinary
      const response = await fetch('/api/upload-image-cloudinary', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Set the returned file path for the current upload type
        setFormData(prev => ({
          ...prev,
          [uploadType]: data.data.path
        }));
        setMessage(`${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)} uploaded successfully!`);
        console.log('Upload details:', data.data);
      } else {
        setMessage(data.message || `Failed to upload ${uploadType}`);
        console.error('Upload failed:', data);
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (error instanceof Error) {
        if (error.message.includes('500')) {
          setMessage('Server error: Cloudinary upload issue. Please check your API keys.');
        } else if (error.message.includes('413')) {
          setMessage('File too large. Please select a smaller file.');
        } else if (error.message.includes('Invalid credentials')) {
          setMessage('Cloudinary credentials error. Please check your API configuration.');
        } else {
          setMessage(`Upload error: ${error.message}`);
        }
      } else {
        setMessage('Network error: Please check your connection and try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Check if we have all required fields
    if (!formData.image || !formData.video) {
      setMessage('Please upload both image and video files');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/about-banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('About banner saved successfully!');
        fetchCurrentBanner();
      } else {
        setMessage(data.message || 'Failed to save about banner');
      }
    } catch {
      setMessage('An error occurred while saving the about banner');
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
        <h1 className="text-2xl font-bold text-black mb-1 font-zonapro">About Banner Manager</h1>
        <p className="text-black font-zonapro">Create and edit your about page banner content</p>
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
              placeholder="Enter banner title"
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-black mb-1 font-zonapro">
              Description ({languages.find(l => l.code === currentLanguage)?.name})
            </label>
            <textarea
              name={`subtitle.${currentLanguage}`}
              value={formData.subtitle[currentLanguage]}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:border-black text-black resize-none font-zonapro"
              placeholder="Enter banner description"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-black mb-1 font-zonapro">
              Background Image
            </label>
            
            {/* File Upload */}
            <div className="mb-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setUploadType('image');
                  handleFileChange(e);
                }}
                disabled={isUploading}
                className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:border-black text-black disabled:opacity-50 font-zonapro"
              />
              <p className="text-xs text-gray-600 mt-1 font-zonapro">
                {isUploading ? 'Uploading...' : 'Select an image file (PNG, JPG, WebP, etc.)'}
              </p>
            </div>
            
            {/* Image Preview */}
            {formData.image && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-black font-zonapro">Image Preview:</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        image: ''
                      }));
                    }}
                    className="text-xs text-red-600 hover:text-red-800 underline font-zonapro"
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
                <p className="text-xs text-gray-600 mt-1 font-zonapro">File: {formData.image}</p>
              </div>
            )}
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-black mb-1 font-zonapro">
              Background Video
            </label>
            
            {/* File Upload */}
            <div className="mb-3">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  setUploadType('video');
                  handleFileChange(e);
                }}
                disabled={isUploading}
                className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:border-black text-black disabled:opacity-50 font-zonapro"
              />
              <p className="text-xs text-gray-600 mt-1 font-zonapro">
                {isUploading ? 'Uploading...' : 'Select a video file (MP4, WebM, etc.)'}
              </p>
            </div>
            
            {/* Video Preview */}
            {formData.video && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-black font-zonapro">Video Preview:</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        video: ''
                      }));
                    }}
                    className="text-xs text-red-600 hover:text-red-800 underline font-zonapro"
                  >
                    Remove Video
                  </button>
                </div>
                <div className="relative w-64 h-36 border border-gray-300 rounded overflow-hidden">
                  <video 
                    src={formData.video} 
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1 font-zonapro">File: {formData.video}</p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={async () => {
                try {
                  const response = await fetch('/api/seed-about-banner', { method: 'POST' });
                  const data = await response.json();
                  if (data.success) {
                    setMessage('Sample about banner created!');
                    fetchCurrentBanner();
                  } else {
                    setMessage(data.message || 'Failed to create sample about banner');
                  }
                } catch {
                  setMessage('Error creating sample about banner');
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
              {isLoading ? 'Saving...' : 'Save About Banner'}
            </button>
          </div>
        </form>
      </div>

      {/* Current Banner */}
      {currentBanner && (
        <div className="border border-gray-300 p-4">
          <h3 className="text-lg font-medium text-black mb-3 font-zonapro">Current About Banner</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {languages.map((lang) => (
              <div key={lang.code} className="p-3 bg-gray-100 rounded border border-gray-200">
                <div className="font-medium text-black mb-2 font-zonapro">{lang.flag} {lang.name}</div>
                <div className="text-sm text-black">
                  <div className="mb-1 font-zonapro"><strong>Title:</strong> {currentBanner.title?.[lang.code] || 'Not set'}</div>
                  <div className="font-zonapro"><strong>Description:</strong> {currentBanner.subtitle?.[lang.code] || 'Not set'}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Media Preview */}
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            {/* Image Preview */}
            <div className="p-3 bg-gray-100 rounded border border-gray-200">
              <div className="font-medium text-black mb-2 font-zonapro">🖼️ Background Image</div>
              <div className="text-sm text-black mb-2 font-zonapro">
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

            {/* Video Preview */}
            <div className="p-3 bg-gray-100 rounded border border-gray-200">
              <div className="font-medium text-black mb-2 font-zonapro">🎥 Background Video</div>
              <div className="text-sm text-black mb-2 font-zonapro">
                <strong>Video:</strong> {currentBanner.video || 'Not set'}
              </div>
              {currentBanner.video && (
                <div className="w-32 h-24 border border-gray-300 rounded overflow-hidden">
                  <video 
                    src={currentBanner.video} 
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutBannerManager;
