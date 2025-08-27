'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChunkedUploader, uploadFileInChunks } from '@/lib/chunkedUpload';

interface Wood {
  _id: string;
  title: {
    en: string;
    de: string;
    al: string;
  };
  imageUrl: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Type for upload result
interface UploadResult {
  success: boolean;
  message?: string;
  data?: {
    path: string;
    size?: number;
    chunks?: number;
    method?: string;
  };
}

const WoodsManager = () => {
  const [message, setMessage] = useState('');
  const [woods, setWoods] = useState<Wood[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'de' | 'al'>('en');
  const [formData, setFormData] = useState<{
    title: { en: string; de: string; al: string };
    imageUrl: string;
  }>({
    title: { en: '', de: '', al: '' },
    imageUrl: '',
  });

  useEffect(() => {
    fetchWoods();
  }, []);

  const fetchWoods = async () => {
    try {
      const response = await fetch('/api/woods');
      const data = await response.json();
      
      if (data.success) {
        setWoods(data.data);
      }
    } catch (error) {
      console.error('Error fetching woods:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [field, lang] = name.split('.');
      if (field === 'title' && (lang === 'en' || lang === 'de' || lang === 'al')) {
        setFormData(prev => ({
          ...prev,
          title: {
            ...prev.title,
            [lang]: value
          }
        }));
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setIsUploading(true);
        
        try {
          let uploadResult: UploadResult;
          
          // Check if file needs chunking (larger than 4MB)
          if (ChunkedUploader.needsChunking(file)) {
            // Use chunked upload for large files
            uploadResult = await uploadFileInChunks(file, {
              onProgress: (progress) => {
                console.log(`Upload progress: ${progress}%`);
              },
              onChunkComplete: (chunkIndex, totalChunks) => {
                console.log(`Chunk ${chunkIndex + 1}/${totalChunks} completed`);
              }
            });
            
            if (uploadResult.success && uploadResult.data) {
              setFormData(prev => ({
                ...prev,
                imageUrl: uploadResult.data!.path
              }));
              setMessage(`Image uploaded successfully via chunked upload! (${Math.round(file.size / (1024 * 1024))}MB)`);
            } else {
              throw new Error(uploadResult.message || 'Chunked upload failed');
            }
          } else {
            // Use direct Cloudinary upload for smaller files
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('/api/upload-image-cloudinary', {
              method: 'POST',
              body: formData,
            });
            
            const data = await response.json();
            
            if (data.success) {
              setFormData(prev => ({
                ...prev,
                imageUrl: data.data.path
              }));
              setMessage('Image uploaded successfully!');
            } else {
              throw new Error(data.message || 'Failed to upload image');
            }
          }
        } catch (error) {
          setMessage(error instanceof Error ? error.message : 'Error uploading image');
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

    // Check if all titles are filled
    if (!formData.title.en || !formData.title.de || !formData.title.al) {
      setMessage('Please fill in titles for all languages');
      setIsLoading(false);
      return;
    }

    if (!formData.imageUrl) {
      setMessage('Please upload an image');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Sending data:', formData);
      
      const response = await fetch('/api/woods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (data.success) {
        setMessage('Wood created successfully!');
        fetchWoods();
        // Reset form
        setFormData({
          title: { en: '', de: '', al: '' },
          imageUrl: '',
        });
      } else {
        setMessage(data.message || 'Failed to create wood');
        if (data.error) {
          console.error('API Error:', data.error);
          console.error('Error Details:', data.details);
        }
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setMessage('An error occurred while creating the wood');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this wood?')) {
      try {
        const response = await fetch(`/api/woods?id=${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          setMessage('Wood deleted successfully!');
          fetchWoods();
        } else {
          setMessage(data.message || 'Failed to delete wood');
        }
      } catch {
        setMessage('Error deleting wood');
      }
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const wood = woods.find(w => w._id === id);
      if (!wood) return;

      const response = await fetch(`/api/woods?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...wood,
          isActive: !currentStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`Wood ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
        fetchWoods();
      } else {
        setMessage(data.message || 'Failed to update wood');
      }
    } catch {
      setMessage('Error updating wood');
    }
  };

  const resetForm = () => {
    setFormData({
      title: { en: '', de: '', al: '' },
      imageUrl: '',
    });
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'al', name: 'Shqip', flag: '🇦🇱' }
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl">
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

      {/* Single Wood Creation Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-black mb-4 text-center font-zonapro">
          🌳 Create New Wood Material
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Language Tabs */}
          <div className="flex justify-center mb-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setCurrentLanguage(lang.code as 'en' | 'de' | 'al')}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 font-zonapro ${
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
            <label className="block text-sm font-semibold text-black font-zonapro">
              Wood Title ({languages.find(l => l.code === currentLanguage)?.name})
            </label>
            <input
              type="text"
              name={`title.${currentLanguage}`}
              value={formData.title[currentLanguage]}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black placeholder-gray-500 font-zonapro"
              placeholder={`Enter title in ${languages.find(l => l.code === currentLanguage)?.name}`}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-black font-zonapro">
              Wood Image
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-200">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {formData.imageUrl ? (
                  <div className="space-y-2">
                    <div className="w-24 h-20 mx-auto border border-gray-300 rounded-lg overflow-hidden">
                      <Image 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        width={96}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-black font-zonapro">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="mx-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-black font-zonapro">
                        {isUploading ? 'Uploading...' : 'Click to upload image'}
                      </p>
                                                <p className="text-xs text-gray-500 font-zonapro">PNG, JPG up to 200MB</p>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading || isUploading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-zonapro"
            >
              {isLoading ? 'Creating...' : '🌳 Create Wood Material'}
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

      {/* Enhanced Woods List */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-black">
            📋 Current Wood Materials ({woods.length})
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => fetchWoods()}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm transition-colors duration-200"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
        
        {woods.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-black text-sm">No wood materials yet. Create your first one above!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {woods.map((wood, index) => (
              <div key={wood._id} className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-black bg-green-50 px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(wood.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(wood._id, wood.isActive)}
                      className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
                        wood.isActive 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title={wood.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {wood.isActive ? '✓' : '✗'}
                    </button>
                    <button
                      onClick={() => handleDelete(wood._id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      title="Delete wood"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {languages.map((lang) => (
                    <div key={lang.code} className="bg-white rounded-md p-2 border border-gray-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{lang.flag}</span>
                        <span className="text-xs font-medium text-black uppercase">{lang.code}</span>
                      </div>
                      <p className="text-xs font-medium text-black">{wood.title[lang.code as keyof typeof wood.title]}</p>
                    </div>
                  ))}
                  
                  <div className="bg-white rounded-md p-2 border border-gray-100">
                    <p className="text-xs font-medium text-black uppercase mb-1">Image</p>
                    <div className="w-full h-20 border border-gray-200 rounded-md overflow-hidden">
                      <Image 
                        src={wood.imageUrl} 
                        alt="Wood"
                        width={400}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WoodsManager;
