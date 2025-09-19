'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChunkedUploader, uploadFileInChunks } from '@/lib/chunkedUpload';

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
  images: {
    step1: string;
    step2: string;
    step3: string;
  };
}

const StepByStepManager = () => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [formData, setFormData] = useState<StepByStepData>({
    title: { en: '', de: '', al: '' },
    description: { en: '', de: '', al: '' },
    images: { step1: '', step2: '', step3: '' },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentStepByStep, setCurrentStepByStep] = useState<StepByStepData | null>(null);
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({
    step1: false,
    step2: false,
    step3: false,
  });

  useEffect(() => {
    fetchCurrentStepByStep();
  }, []);

  const fetchCurrentStepByStep = async () => {
    try {
      const response = await fetch('/api/step-by-step');
      const data = await response.json();
      
      if (data.success && data.data) {
        setCurrentStepByStep(data.data);
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
          images: {
            step1: data.data.images?.step1 || '',
            step2: data.data.images?.step2 || '',
            step3: data.data.images?.step3 || '',
          },
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, step: 'step1' | 'step2' | 'step3') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        await handleFileUpload(file, step);
      } else {
        setMessage('Please select an image file (PNG, JPG, etc.)');
      }
    }
  };

  const handleFileUpload = async (file: File, step: 'step1' | 'step2' | 'step3') => {
    if (file) {
      setIsUploading(prev => ({ ...prev, [step]: true }));
      setMessage('');

      if (ChunkedUploader.needsChunking(file)) {
        await handleChunkedUpload(file, step);
      } else {
        await handleRegularUpload(file, step);
      }
    }
  };

  const handleChunkedUpload = async (file: File, step: 'step1' | 'step2' | 'step3') => {
    try {
      setMessage('Large file detected. Using chunked upload...');
      
      const uploadResult = await uploadFileInChunks(file, {
        onProgress: (progress) => {
          setMessage(`Uploading ${step}... ${progress}% complete`);
        },
        onChunkComplete: (chunkIndex, totalChunks) => {
          console.log(`Chunk ${chunkIndex + 1}/${totalChunks} completed for ${step}`);
        }
      });
      
      if (uploadResult.success && uploadResult.data) {
        setFormData(prev => ({
          ...prev,
          images: {
            ...prev.images,
            [step]: uploadResult.data!.path
          }
        }));
        setMessage(`Large image uploaded successfully for ${step}! (${Math.round(file.size / (1024 * 1024))}MB)`);
      } else {
        throw new Error(uploadResult.message || 'Chunked upload failed');
      }
    } catch (error) {
      console.error('Chunked upload error:', error);
      setMessage(`Chunked upload failed for ${step}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(prev => ({ ...prev, [step]: false }));
    }
  };

  const handleRegularUpload = async (file: File, step: 'step1' | 'step2' | 'step3') => {
    try {
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
        setFormData(prev => ({
          ...prev,
          images: {
            ...prev.images,
            [step]: data.data.path
          }
        }));
        setMessage(`Image uploaded successfully for ${step}!`);
      } else {
        setMessage(data.message || `Failed to upload image for ${step}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(`Upload error for ${step}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(prev => ({ ...prev, [step]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Check if we have all required fields
    if (!formData.title.en || !formData.title.de || !formData.title.al ||
        !formData.description.en || !formData.description.de || !formData.description.al ||
        !formData.images.step1 || !formData.images.step2 || !formData.images.step3) {
      setMessage('Please fill all fields and upload all three images');
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

  const steps = [
    { key: 'step1', label: 'Step 1 Image' },
    { key: 'step2', label: 'Step 2 Image' },
    { key: 'step3', label: 'Step 3 Image' },
  ] as const;

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
              Step Images
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps.map((step) => (
                <div key={step.key} className="border border-gray-300 p-3 rounded">
                  <h4 className="text-sm font-medium text-black mb-2 font-zonapro">{step.label}</h4>
                  
                  {/* File Upload */}
                  <div className="mb-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, step.key)}
                      disabled={isUploading[step.key]}
                      className="w-full px-2 py-1 border border-gray-400 rounded focus:outline-none focus:border-black text-black disabled:opacity-50 font-zonapro text-sm"
                    />
                    <p className="text-xs text-gray-600 mt-1 font-zonapro">
                      {isUploading[step.key] ? 'Uploading...' : 'Select image file'}
                    </p>
                  </div>
                  
                  {/* Image Preview */}
                  {formData.images[step.key] && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-black font-zonapro">Preview:</p>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              images: {
                                ...prev.images,
                                [step.key]: ''
                              }
                            }));
                          }}
                          className="text-xs text-red-600 hover:text-red-800 underline font-zonapro"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="relative w-full h-32 border border-gray-300 rounded overflow-hidden">
                        <Image 
                          src={formData.images[step.key]} 
                          alt={`${step.label} preview`} 
                          width={200}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps.map((step) => (
                <div key={step.key}>
                  <div className="text-sm text-black mb-2 font-zonapro">
                    <strong>{step.label}:</strong> {currentStepByStep.images?.[step.key] || 'Not set'}
                  </div>
                  {currentStepByStep.images?.[step.key] && (
                    <div className="w-full h-32 border border-gray-300 rounded overflow-hidden">
                      <Image 
                        src={currentStepByStep.images[step.key]} 
                        alt={`${step.label}`}
                        width={200}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepByStepManager;
