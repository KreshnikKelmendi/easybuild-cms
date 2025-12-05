'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChunkedUploader, uploadFileInChunks } from '@/lib/chunkedUpload';
import { compressImage } from '@/lib/imageCompression';

type LanguageCode = 'en' | 'de' | 'al';

interface StepByStepData {
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
  images: string[];
}

const StepByStepManager = () => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [formData, setFormData] = useState<StepByStepData>({
    title: { en: '', de: '', al: '' },
    description: { en: '', de: '', al: '' },
    images: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentStepByStep, setCurrentStepByStep] = useState<StepByStepData | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    fetchCurrentStepByStep();
  }, []);

  const fetchCurrentStepByStep = async () => {
    try {
      const response = await fetch('/api/step-by-step');
      const data = await response.json();
      
      if (data.success && data.data) {
        setCurrentStepByStep(data.data);
        const images = Array.isArray(data.data.images)
          ? data.data.images
          : Object.values(data.data.images || {}).filter((val: unknown): val is string => typeof val === 'string');

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
          images,
        });
      }
    } catch (error) {
      console.error('Error fetching current step by step:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [field, lang] = name.split('.');
      setFormData(prev => {
        const currentField = prev[field as keyof StepByStepData];
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
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      setMessage('Please select image files (PNG, JPG, etc.)');
      return;
    }

    setIsUploading(true);
    setMessage('');

    try {
      const uploaded: string[] = [];

      for (const file of imageFiles) {
        const compressedFile = await compressImage(file);
        if (ChunkedUploader.needsChunking(compressedFile)) {
          const uploadResult = await uploadFileInChunks(compressedFile);
          if (uploadResult.success && uploadResult.data?.path) {
            uploaded.push(uploadResult.data.path);
          } else {
            throw new Error(uploadResult.message || `Failed to upload ${file.name}`);
          }
        } else {
          const fd = new FormData();
          fd.append('file', compressedFile);
          const response = await fetch('/api/upload-image-cloudinary', { method: 'POST', body: fd });
          const data = await response.json();
          if (data.success) {
            uploaded.push(data.data.path);
          } else {
            throw new Error(data.message || `Failed to upload ${file.name}`);
          }
        }
      }

      if (uploaded.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploaded],
        }));
        setMessage(`${uploaded.length} image(s) uploaded successfully`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(error instanceof Error ? error.message : 'Error uploading images');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removeImageAt = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Check if we have all required fields
    if (!formData.title.en || !formData.title.de || !formData.title.al ||
        !formData.description.en || !formData.description.de || !formData.description.al ||
        formData.images.length < 3) {
      setMessage('Please fill all fields and upload at least three images');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/step-by-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Step by Step section saved successfully!');
        fetchCurrentStepByStep();
      } else {
        setMessage(data.message || 'Failed to save step by step section');
      }
    } catch {
      setMessage('An error occurred while saving the step by step section');
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
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-black mb-1 font-zonapro">Step by Step Manager</h1>
        <p className="text-black font-zonapro">Create and edit your step by step section</p>
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
              placeholder="Enter step by step title"
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
              placeholder="Enter step by step description"
              required
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-black mb-2 font-zonapro">
              Step Images (min 3)
            </label>
            
            <div className="mb-3">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={isUploading}
                className="w-full px-2 py-1 border border-gray-400 rounded focus:outline-none focus:border-black text-black disabled:opacity-50 font-zonapro text-sm"
              />
              <p className="text-xs text-gray-600 mt-1 font-zonapro">
                {isUploading ? 'Uploading...' : 'Select one or more images'}
              </p>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formData.images.map((img, idx) => (
                  <div key={img + idx} className="border border-gray-300 p-3 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-black font-zonapro">Image {idx + 1}</p>
                      <button
                        type="button"
                        onClick={() => removeImageAt(idx)}
                        className="text-xs text-red-600 hover:text-red-800 underline font-zonapro"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="relative w-full h-32 border border-gray-300 rounded overflow-hidden">
                      <Image 
                        src={img} 
                        alt={`Step image ${idx + 1}`} 
                        width={200}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={async () => {
                try {
                  const response = await fetch('/api/seed-step-by-step', { method: 'POST' });
                  const data = await response.json();
                  if (data.success) {
                    setMessage('Sample step by step section created!');
                    fetchCurrentStepByStep();
                  } else {
                    setMessage(data.message || 'Failed to create sample step by step section');
                  }
                } catch {
                  setMessage('Error creating sample step by step section');
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
              {isLoading ? 'Saving...' : 'Save Step by Step'}
            </button>
          </div>
        </form>
      </div>

      {/* Current Step by Step */}
      {currentStepByStep && (
        <div className="border border-gray-300 p-4">
          <h3 className="text-lg font-medium text-black mb-3 font-zonapro">Current Step by Step Section</h3>
          
          {/* Content Preview */}
          <div className="grid md:grid-cols-3 gap-3 mb-4">
            {languages.map((lang) => (
              <div key={lang.code} className="p-3 bg-gray-100 rounded border border-gray-200">
                <div className="font-medium text-black mb-2 font-zonapro">{lang.flag} {lang.name}</div>
                <div className="text-sm text-black">
                  <div className="mb-1 font-zonapro"><strong>Title:</strong> {currentStepByStep.title?.[lang.code] || 'Not set'}</div>
                  <div className="font-zonapro"><strong>Description:</strong> {currentStepByStep.description?.[lang.code] || 'Not set'}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Images Preview */}
          <div className="p-3 bg-gray-100 rounded border border-gray-200">
            <div className="font-medium text-black mb-3 font-zonapro">🖼️ Step Images</div>
            {currentStepByStep.images?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentStepByStep.images.map((img, idx) => (
                  <div key={img + idx}>
                    <div className="text-sm text-black mb-2 font-zonapro">
                      <strong>Image {idx + 1}:</strong> {img}
                    </div>
                    <div className="w-full h-32 border border-gray-300 rounded overflow-hidden">
                      <Image 
                        src={img} 
                        alt={`Step image ${idx + 1}`}
                        width={200}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-700 font-zonapro">No images set.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StepByStepManager;
