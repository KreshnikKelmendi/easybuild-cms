'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { ChunkedUploader, uploadFileInChunks } from '@/lib/chunkedUpload';

interface Service {
  _id: string;
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
  description2: {
    en: string;
    de: string;
    al: string;
  };
  image: string;
  hoverImage?: string;
  stepImages: Array<{
    image: string;
    titleKey: string;
  }>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const ServiceManager = () => {
  const { i18n } = useTranslation();
  const [message, setMessage] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'de' | 'al'>('en');
  const [isEditing, setIsEditing] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: { en: string; de: string; al: string };
    description: { en: string; de: string; al: string };
    description2: { en: string; de: string; al: string };
    image: string;
    hoverImage: string;
    stepImages: Array<{ image: string; titleKey: string }>;
  }>({
    title: { en: '', de: '', al: '' },
    description: { en: '', de: '', al: '' },
    description2: { en: '', de: '', al: '' },
    image: '',
    hoverImage: '',
    stepImages: []
  });

  useEffect(() => {
    fetchServices();
  }, []);

  // Debug useEffect to monitor state changes
  useEffect(() => {
    console.log('State changed:', { isEditing, editingServiceId });
  }, [isEditing, editingServiceId]);

  // Auto-update currentLanguage when Header language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      if (lng === 'en' || lng === 'de' || lng === 'al') {
        setCurrentLanguage(lng as 'en' | 'de' | 'al');
        console.log('Language changed to:', lng);
      }
    };

    // Set initial language
    handleLanguageChange(i18n.language);

    // Listen for language changes
    i18n.on('languageChanged', handleLanguageChange);

    // Cleanup
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
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
            ...prev.title || { en: '', de: '', al: '' },
            [lang]: value
          }
        }));
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'hover' = 'main') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setIsUploading(true);
        
        try {
          let uploadResult: any;
          
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
                [type === 'main' ? 'image' : 'hoverImage']: uploadResult.data.path
              }));
              setMessage(`${type === 'main' ? 'Main' : 'Hover'} image uploaded successfully via chunked upload! (${Math.round(file.size / (1024 * 1024))}MB)`);
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
                [type === 'main' ? 'image' : 'hoverImage']: data.data.path
              }));
              setMessage(`${type === 'main' ? 'Main' : 'Hover'} image uploaded successfully!`);
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

    // Check if all descriptions are filled
    if (!formData.description.en || !formData.description.de || !formData.description.al) {
      setMessage('Please fill in descriptions for all languages');
      setIsLoading(false);
      return;
    }

    // Check if all descriptions2 are filled
    if (!formData.description2.en || !formData.description2.de || !formData.description2.al) {
      setMessage('Please fill in second descriptions for all languages');
      setIsLoading(false);
      return;
    }

    if (!formData.image) {
      setMessage('Please upload an image');
      setIsLoading(false);
      return;
    }

    // Check if all step images are uploaded
    if (formData.stepImages.length < 3 || formData.stepImages.some(step => !step.image || !step.titleKey)) {
      setMessage('Please upload all 3 step images and provide title keys');
      setIsLoading(false);
      return;
    }

    // Additional validation for edit mode
    if (isEditing && !editingServiceId) {
      setMessage('Service ID is missing. Please try editing the service again.');
      setIsLoading(false);
      return;
    }

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/services?id=${editingServiceId}` : '/api/services';
      
      console.log('Submitting service:', { 
        method, 
        url, 
        isEditing, 
        editingServiceId, 
        editingServiceIdType: typeof editingServiceId,
        formData 
      });
      
      if (isEditing && !editingServiceId) {
        console.error('ERROR: isEditing is true but editingServiceId is null/undefined');
        setMessage('Service ID is missing. Please try editing the service again.');
        setIsLoading(false);
        return;
      }
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (data.success) {
        setMessage(isEditing ? 'Service updated successfully!' : 'Service created successfully!');
        fetchServices();
        
        if (isEditing) {
          // Exit edit mode
          setIsEditing(false);
          setEditingServiceId(null);
        }
        
        // Reset form
        setFormData({
          title: { en: '', de: '', al: '' },
          description: { en: '', de: '', al: '' },
          description2: { en: '', de: '', al: '' },
          image: '',
          hoverImage: '',
          stepImages: []
        });
      } else {
        setMessage(data.message || (isEditing ? 'Failed to update service' : 'Failed to create service'));
      }
    } catch (error) {
      console.error('Submit error:', error);
      setMessage(`An error occurred while ${isEditing ? 'updating' : 'creating'} the service`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    console.log('Editing service:', service);
    console.log('Service ID:', service._id);
    
    setIsEditing(true);
    setEditingServiceId(service._id);
    
    console.log('Set editing state:', { isEditing: true, editingServiceId: service._id });
    
    setFormData({
      title: service.title,
      description: service.description || { en: '', de: '', al: '' },
      description2: service.description2 || { en: '', de: '', al: '' },
      image: service.image,
      hoverImage: service.hoverImage || '',
      stepImages: service.stepImages || []
    });
    setCurrentLanguage('en'); // Reset to English for editing
    setMessage('Editing service. Make your changes and click "Update Service".');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        console.log('Attempting to delete service with ID:', id);
        
        const response = await fetch(`/api/services?id=${id}`, {
          method: 'DELETE',
        });

        console.log('Delete response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Delete response data:', data);

        if (data.success) {
          setMessage('Service deleted successfully!');
          fetchServices();
        } else {
          setMessage(data.message || 'Failed to delete service');
        }
      } catch (error) {
        console.error('Error deleting service:', error);
        setMessage(`Error deleting service: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const resetForm = () => {
    console.log('Resetting form. Current state:', { isEditing, editingServiceId });
    
    setFormData({
      title: { en: '', de: '', al: '' },
      description: { en: '', de: '', al: '' },
      description2: { en: '', de: '', al: '' },
      image: '',
      hoverImage: '',
      stepImages: []
    });
    
    // Exit edit mode if editing
    if (isEditing) {
      setIsEditing(false);
      setEditingServiceId(null);
      setMessage('Edit mode cancelled. Form reset to create new service.');
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'al', name: 'Shqip', flag: '🇦🇱' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl">
      
             {/* Header with Instructions */}
               <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 font-zonapro">
            {i18n.language === 'de' ? '🛠️ Dienstleistungsverwaltung' : 
             i18n.language === 'al' ? '🛠️ Menaxhimi i Shërbimeve' : 
             '🛠️ Service Management'}
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed font-zonapro">
           {i18n.language === 'de' ? 
             'Erstellen und verwalten Sie hier Ihre Dienstleistungen. Jede Dienstleistung wird auf Ihrer Dienstleistungsseite mit mehrsprachiger Unterstützung (Englisch, Deutsch, Albanisch), Bildern und schrittweisen Prozessdetails angezeigt.' :
            i18n.language === 'al' ? 
             'Krijoni dhe menaxhoni shërbimet tuaja këtu. Çdo shërbim do të shfaqet në faqen tuaj të shërbimeve me mbështetje shumëgjuhëshe (Anglisht, Gjermanisht, Shqip), imazhe dhe detaje të procesit hap pas hapi.' :
             'Create and manage your services here. Each service will be displayed on your services page with multi-language support (English, German, Albanian), images, and step-by-step process details.'
           }
         </p>
       </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg text-center shadow-sm ${
          message.includes('successfully') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Service Creation Form */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 font-zonapro">
              {isEditing ? 
                (i18n.language === 'de' ? '✏️ Dienstleistung bearbeiten' : 
                 i18n.language === 'al' ? '✏️ Redakto Shërbimin' : 
                 '✏️ Edit Service') :
                (i18n.language === 'de' ? '✨ Neue Dienstleistung erstellen' : 
                 i18n.language === 'al' ? '✨ Krijo Shërbim të Ri' : 
                 '✨ Create New Service')
              }
            </h2>
            <p className="text-gray-600 font-zonapro">
             {isEditing 
               ? (i18n.language === 'de' ? 
                   'Ändern Sie die Dienstleistungsdetails unten. Verwenden Sie die Sprachregisterkarten, um Inhalte in verschiedenen Sprachen zu bearbeiten.' :
                  i18n.language === 'al' ? 
                   'Modifikoni detajet e shërbimit më poshtë. Përdorni skedat e gjuhëve për të redaktuar përmbajtjen në gjuhë të ndryshme.' :
                   'Modify the service details below. Use the language tabs to edit content in different languages.')
               : (i18n.language === 'de' ? 
                   'Füllen Sie alle erforderlichen Felder unten aus. Verwenden Sie die Sprachregisterkarten, um Inhalte in verschiedenen Sprachen hinzuzufügen.' :
                  i18n.language === 'al' ? 
                   'Plotësoni të gjitha fushat e kërkuara më poshtë. Përdorni skedat e gjuhëve për të shtuar përmbajtje në gjuhë të ndryshme.' :
                   'Fill in all required fields below. Use the language tabs to add content in different languages.')
             }
           </p>
           {isEditing && editingServiceId && (
             <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
               <p className="text-sm text-blue-700">
                 <strong>
                   {i18n.language === 'de' ? 'Dienstleistungs-ID bearbeiten:' : 
                    i18n.language === 'al' ? 'ID-ja e Shërbimit që Redaktohet:' : 
                    'Editing Service ID:'}
                 </strong> {editingServiceId}
               </p>
             </div>
           )}
         </div>

        <form onSubmit={handleSubmit} className="space-y-4">
                     {/* Language Tabs */}
           <div className="bg-gray-50 rounded-lg p-4 mb-6">
             <div className="text-center mb-3">
               <p className="text-sm font-medium text-gray-700 mb-2 font-zonapro">
                 {i18n.language === 'de' ? '🌍 Sprache zum Bearbeiten auswählen' : 
                  i18n.language === 'al' ? '🌍 Zgjidh Gjuhën për të Redaktuar' : 
                  '🌍 Select Language to Edit'}
               </p>
               <p className="text-xs text-gray-500 font-zonapro">
                 {i18n.language === 'de' ? 'Klicken Sie auf eine Sprachregisterkarte, um Inhalte in dieser Sprache hinzuzufügen' : 
                  i18n.language === 'al' ? 'Klikoni në një skedë gjuhë për të shtuar përmbajtje në atë gjuhë' : 
                  'Click on a language tab to add content in that language'}
               </p>
               <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                 <p className="text-xs text-blue-700 font-zonapro">
                   <strong>
                     {i18n.language === 'de' ? 'Header-Sprache:' : 
                      i18n.language === 'al' ? 'Gjuha e Header-it:' : 
                      'Header Language:'}
                   </strong> {languages.find(l => l.code === i18n.language)?.flag} {languages.find(l => l.code === i18n.language)?.name} 
                   <span className="ml-2 text-gray-500 font-zonapro">
                     {i18n.language === 'de' ? '(Synchronisiert sich automatisch mit Header)' : 
                      i18n.language === 'al' ? '(Sinkronizohet automatikisht me Header)' : 
                      '(Auto-syncs with Header)'}
                   </span>
                 </p>
                 <div className="mt-2 flex items-center gap-2">
                   <button
                     type="button"
                     onClick={() => setCurrentLanguage(i18n.language as 'en' | 'de' | 'al')}
                     className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors duration-200 font-zonapro"
                   >
                     🔄 {i18n.language === 'de' ? 'Mit Header synchronisieren' : 
                          i18n.language === 'al' ? 'Sinkronizo me Header' : 
                          'Sync with Header'}
                   </button>
                   <span className="text-xs text-gray-600 font-zonapro">
                     {i18n.language === 'de' ? 'Klicken Sie, um die Header-Sprache zu übereinstimmen' : 
                      i18n.language === 'al' ? 'Klikoni për të përputhur me gjuhën e Header-it' : 
                      'Click to match Header language'}
                   </span>
                 </div>
               </div>
             </div>
             <div className="flex justify-center">
               <div className="flex bg-white rounded-lg p-1 shadow-sm border">
                 {languages.map((lang) => (
                   <button
                     key={lang.code}
                     type="button"
                     onClick={() => setCurrentLanguage(lang.code as 'en' | 'de' | 'al')}
                     className={`px-6 py-3 rounded-md font-medium text-sm transition-all duration-200 font-zonapro ${
                       currentLanguage === lang.code
                         ? 'bg-blue-500 text-white shadow-md'
                         : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                     }`}
                   >
                     {lang.flag} {lang.name}
                     {i18n.language === lang.code && (
                       <span className="ml-1 text-xs font-zonapro">✓</span>
                     )}
                   </button>
                 ))}
               </div>
             </div>
           </div>

                     {/* Title Input */}
           <div className="space-y-2">
             <label className="block text-sm font-semibold text-gray-700 font-zonapro">
               📝 {i18n.language === 'de' ? 'Dienstleistungstitel' : 
                    i18n.language === 'al' ? 'Titulli i Shërbimit' : 
                    'Service Title'} ({languages.find(l => l.code === currentLanguage)?.name})
             </label>
             <p className="text-xs text-gray-500 mb-2 font-zonapro">
               {i18n.language === 'de' ? 
                 'Geben Sie einen klaren, beschreibenden Titel für Ihren Service ein (z.B. "Individueller Hausbau", "Küchenrenovierung")' :
                i18n.language === 'al' ? 
                 'Shkruani një titull të qartë dhe përshkrues për shërbimin tuaj (p.sh. "Ndërtimi i Shtëpisë me Porosi", "Rinovimi i Kuzhinës")' :
                 'Enter a clear, descriptive title for your service (e.g., "Custom Home Construction", "Kitchen Renovation")'
               }
             </p>
                         <input
               type="text"
               name={`title.${currentLanguage}`}
               value={formData.title?.[currentLanguage] || ''}
               onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400 font-zonapro"
              placeholder={`Enter service title in ${languages.find(l => l.code === currentLanguage)?.name}`}
              required
            />
          </div>

                     {/* Description Input */}
           <div className="space-y-2">
             <label className="block text-sm font-semibold text-gray-700 font-zonapro">
               📄 {i18n.language === 'de' ? 'Hauptbeschreibung' : 
                    i18n.language === 'al' ? 'Përshkrimi Kryesor' : 
                    'Main Description'} ({languages.find(l => l.code === currentLanguage)?.name})
             </label>
             <p className="text-xs text-gray-500 mb-2 font-zonapro">
               {i18n.language === 'de' ? 
                 'Geben Sie eine kurze Übersicht über das, was dieser Service umfasst und seine Hauptvorteile' :
                i18n.language === 'al' ? 
                 'Jepni një përmbledhje të shkurtër të asaj që përfshin ky shërbim dhe përfitimet kryesore të tij' :
                 'Provide a brief overview of what this service includes and its main benefits'
               }
             </p>
                         <textarea
               name={`description.${currentLanguage}`}
               value={formData.description?.[currentLanguage] || ''}
               onChange={(e) => {
                const { name, value } = e.target;
                const [field, lang] = name.split('.');
                if (field === 'description' && (lang === 'en' || lang === 'de' || lang === 'al')) {
                  setFormData(prev => ({
                    ...prev,
                    description: {
                      ...prev.description,
                      [lang]: value
                    }
                  }));
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400 font-zonapro"
              placeholder={`Describe your service in ${languages.find(l => l.code === currentLanguage)?.name}...`}
              rows={4}
              required
            />
          </div>

                     {/* Description 2 Input */}
           <div className="space-y-2">
             <label className="block text-sm font-semibold text-gray-700 font-zonapro">
               📋 {i18n.language === 'de' ? 'Zusätzliche Details' : 
                    i18n.language === 'al' ? 'Detaje Shtesë' : 
                    'Additional Details'} ({languages.find(l => l.code === currentLanguage)?.name})
             </label>
             <p className="text-xs text-gray-500 mb-2 font-zonapro">
               {i18n.language === 'de' ? 
                 'Fügen Sie spezifischere Informationen über Materialien, Zeitplan oder besondere Funktionen hinzu' :
                i18n.language === 'al' ? 
                 'Shtoni informacione më specifike për materialet, afatin kohor ose veçoritë speciale' :
                 'Add more specific information about materials, timeline, or special features'
               }
             </p>
                         <textarea
               name={`description2.${currentLanguage}`}
               value={formData.description2?.[currentLanguage] || ''}
               onChange={(e) => {
                const { name, value } = e.target;
                const [field, lang] = name.split('.');
                if (field === 'description2' && (lang === 'en' || lang === 'de' || lang === 'al')) {
                  setFormData(prev => ({
                    ...prev,
                    description2: {
                      ...prev.description2,
                      [lang]: value
                    }
                  }));
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400 font-zonapro"
              placeholder={`Add more details in ${languages.find(l => l.code === currentLanguage)?.name}...`}
              rows={4}
              required
            />
          </div>

                     {/* Image Upload */}
           <div className="space-y-2">
             <label className="block text-sm font-semibold text-gray-700 font-zonapro">
               🖼️ {i18n.language === 'de' ? 'Hauptdienstleistungsbild' : 
                    i18n.language === 'al' ? 'Imazhi Kryesor i Shërbimit' : 
                    'Main Service Image'}
             </label>
             <p className="text-xs text-gray-500 mb-3 font-zonapro">
               {i18n.language === 'de' ? 
                 'Laden Sie ein hochwertiges Bild hoch, das Ihren Service repräsentiert. Dies wird das primäre angezeigte Bild sein.' :
                i18n.language === 'al' ? 
                 'Ngarkoni një imazh me cilësi të lartë që përfaqëson shërbimin tuaj. Ky do të jetë imazhi kryesor që shfaqet.' :
                 'Upload a high-quality image that represents your service. This will be the primary image displayed.'
               }
             </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200 bg-gray-50">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'main')}
                disabled={isUploading}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {formData.image ? (
                  <div className="space-y-2">
                    <div className="w-24 h-20 mx-auto border border-gray-300 rounded-lg overflow-hidden">
                      <Image 
                        src={formData.image} 
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

                     {/* Hover Image Upload */}
           <div className="space-y-2">
             <label className="block text-sm font-semibold text-gray-700 font-zonapro">
               🖱️ {i18n.language === 'de' ? 'Hover-Bild (Optional)' : 
                    i18n.language === 'al' ? 'Imazhi i Hover-it (Opsional)' : 
                    'Hover Image (Optional)'}
             </label>
             <p className="text-xs text-gray-500 mb-3 font-zonapro">
               {i18n.language === 'de' ? 
                 'Optional: Laden Sie ein Bild hoch, das angezeigt wird, wenn Benutzer über das Hauptbild hovern. Kann ein anderer Winkel oder eine Detailansicht sein.' :
                i18n.language === 'al' ? 
                 'Opsional: Ngarkoni një imazh që do të shfaqet kur përdoruesit kalojnë mbi imazhin kryesor. Mund të jetë një kënd tjetër ose pamje detaje.' :
                 'Optional: Upload an image that will be shown when users hover over the main image. Can be a different angle or detail view.'
               }
             </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200 bg-gray-50">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'hover')}
                disabled={isUploading}
                className="hidden"
                id="hover-image-upload"
              />
              <label htmlFor="hover-image-upload" className="cursor-pointer">
                {formData.hoverImage ? (
                  <div className="space-y-2">
                    <div className="w-24 h-20 mx-auto border border-gray-300 rounded-lg overflow-hidden">
                      <Image 
                        src={formData.hoverImage} 
                        alt="Hover Preview" 
                        width={96}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-black font-zonapro">Click to change hover image</p>
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
                          {isUploading ? 'Uploading...' : 'Click to upload hover image'}
                        </p>
                                                  <p className="text-xs text-gray-500 font-zonapro">PNG, JPG up to 200MB (Optional)</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

                         {/* Step Images Section */}
             <div className="space-y-4">
               <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                 <label className="block text-sm font-semibold text-blue-800 mb-2 font-zonapro">
                   🔄 {i18n.language === 'de' ? 'Schritt-für-Schritt-Prozessbilder (Erforderlich - 3 Bilder)' : 
                        i18n.language === 'al' ? 'Imazhet e Procesit Hap pas Hapi (E Kërkuar - 3 imazhe)' : 
                        'Step-by-Step Process Images (Required - 3 images)'}
                 </label>
                 <p className="text-xs text-blue-700 mb-3 font-zonapro">
                   {i18n.language === 'de' ? 
                     'Laden Sie 3 Bilder hoch, die den schrittweisen Prozess Ihres Services zeigen. Diese werden im Abschnitt "Wie wir bauen" angezeigt.' :
                    i18n.language === 'al' ? 
                     'Ngarkoni 3 imazhe që tregojnë procesin hap pas hapi të shërbimit tuaj. Këto do të shfaqen në seksionin "Si Ndërtojmë".' :
                     'Upload 3 images that show the step-by-step process of your service. These will be displayed in the "How We Build" section.'
                   }
                 </p>
                 <div className="text-xs text-blue-600 font-zonapro">
                   <p>• <strong>{i18n.language === 'de' ? 'Schritt 1:' : i18n.language === 'al' ? 'Hapi 1:' : 'Step 1:'}</strong> {i18n.language === 'de' ? 'Normalerweise Planung, Beratung oder erste Einrichtung' : i18n.language === 'al' ? 'Zakonisht planifikimi, konsultimi ose konfigurimi fillestar' : 'Usually planning, consultation, or initial setup'}</p>
                   <p>• <strong>{i18n.language === 'de' ? 'Schritt 2:' : i18n.language === 'al' ? 'Hapi 2:' : 'Step 2:'}</strong> {i18n.language === 'de' ? 'Normalerweise Bau, Umsetzung oder Hauptarbeit' : i18n.language === 'al' ? 'Zakonisht ndërtimi, implementimi ose puna kryesore' : 'Usually construction, implementation, or main work'}</p>
                   <p>• <strong>{i18n.language === 'de' ? 'Schritt 3:' : i18n.language === 'al' ? 'Hapi 3:' : 'Step 3:'}</strong> {i18n.language === 'de' ? 'Normalerweise Fertigstellung, letzte Handgriffe oder Ergebnis' : i18n.language === 'al' ? 'Zakonisht përfundimi, prekjet përfundimtare ose rezultati' : 'Usually completion, final touches, or result'}</p>
                 </div>
               </div>
              
                              {[0, 1, 2].map((index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center gap-3 mb-4">
                                               <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full font-zonapro">
                           {i18n.language === 'de' ? 'Schritt' : i18n.language === 'al' ? 'Hapi' : 'Step'} {index + 1}
                         </span>
                         <div className="flex-1">
                           <label className="block text-xs font-medium text-gray-600 mb-1 font-zonapro">
                             {i18n.language === 'de' ? 'Schritt-Titel' : i18n.language === 'al' ? 'Titulli i Hapit' : 'Step Title'}
                           </label>
                        <input
                          type="text"
                          placeholder={index === 0 ? "e.g., Planning & Consultation" : index === 1 ? "e.g., Construction & Implementation" : "e.g., Completion & Final Touches"}
                          value={formData.stepImages[index]?.titleKey || ''}
                          onChange={(e) => {
                            const newStepImages = [...formData.stepImages];
                            if (!newStepImages[index]) {
                              newStepImages[index] = { image: '', titleKey: '' };
                            }
                            newStepImages[index].titleKey = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              stepImages: newStepImages
                            }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 font-zonapro"
                          required
                        />
                      </div>
                    </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.type.startsWith('image/')) {
                            setIsUploading(true);
                            
                            try {
                              let uploadResult: any;
                              
                              // Check if file needs chunking (larger than 4MB)
                              if (ChunkedUploader.needsChunking(file)) {
                                // Use chunked upload for large files
                                uploadResult = await uploadFileInChunks(file, {
                                  onProgress: (progress) => {
                                    console.log(`Upload progress for step ${index + 1}: ${progress}%`);
                                  }
                                });
                                
                                if (uploadResult.success && uploadResult.data) {
                                  const newStepImages = [...formData.stepImages];
                                  if (!newStepImages[index]) {
                                    newStepImages[index] = { image: '', titleKey: '' };
                                  }
                                  newStepImages[index].image = uploadResult.data.path;
                                  setFormData(prev => ({
                                    ...prev,
                                    stepImages: newStepImages
                                  }));
                                  setMessage(`Step ${index + 1} image uploaded successfully via chunked upload! (${Math.round(file.size / (1024 * 1024))}MB)`);
                                } else {
                                  throw new Error(uploadResult.message || 'Chunked upload failed');
                                }
                              } else {
                                // Use direct Cloudinary upload for smaller files
                                const uploadFormData = new FormData();
                                uploadFormData.append('file', file);
                                
                                const response = await fetch('/api/upload-image-cloudinary', {
                                  method: 'POST',
                                  body: uploadFormData,
                                });
                                
                                const data = await response.json();
                                
                                if (data.success) {
                                  const newStepImages = [...formData.stepImages];
                                  if (!newStepImages[index]) {
                                    newStepImages[index] = { image: '', titleKey: '' };
                                  }
                                  newStepImages[index].image = data.data.path;
                                  setFormData(prev => ({
                                    ...prev,
                                    stepImages: newStepImages
                                  }));
                                  setMessage(`Step ${index + 1} image uploaded successfully!`);
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
                      }}
                      disabled={isUploading}
                      className="hidden"
                      id={`step-image-upload-${index}`}
                    />
                    <label htmlFor={`step-image-upload-${index}`} className="cursor-pointer">
                      {formData.stepImages[index]?.image ? (
                        <div className="space-y-2">
                          <div className="w-24 h-20 mx-auto border border-gray-300 rounded-lg overflow-hidden">
                            <Image 
                              src={formData.stepImages[index].image} 
                              alt={`Step ${index + 1}`} 
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
                               {isUploading ? 'Uploading...' : 'Click to upload step image'}
                             </p>
                             <p className="text-xs text-gray-500 font-zonapro">PNG, JPG up to 200MB</p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              ))}
            </div>

                     {/* Buttons */}
           <div className="flex gap-4 pt-6 border-t border-gray-200">
                                        <button
               type="submit"
               disabled={isLoading || isUploading}
               className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-zonapro"
             >
               {isLoading 
                 ? (isEditing ? 
                     (i18n.language === 'de' ? '🔄 Dienstleistung wird aktualisiert...' : 
                      i18n.language === 'al' ? '🔄 Shërbimi po përditësohet...' : 
                      '🔄 Updating Service...') : 
                     (i18n.language === 'de' ? '🔄 Dienstleistung wird erstellt...' : 
                      i18n.language === 'al' ? '🔄 Shërbimi po krijohet...' : 
                      '🔄 Creating Service...'))
                 : (isEditing ? 
                     (i18n.language === 'de' ? '💾 Dienstleistung aktualisieren' : 
                      i18n.language === 'al' ? '💾 Përditëso Shërbimin' : 
                      '💾 Update Service') : 
                     (i18n.language === 'de' ? '✨ Dienstleistung erstellen' : 
                      i18n.language === 'al' ? '✨ Krijo Shërbim' : 
                      '✨ Create Service'))
               }
             </button>
             <button
               type="button"
               onClick={resetForm}
               className="px-8 py-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold transition-colors duration-200 font-zonapro"
             >
               {isEditing ? 
                 (i18n.language === 'de' ? '❌ Bearbeitung abbrechen' : 
                  i18n.language === 'al' ? '❌ Anulo Redaktimin' : 
                  '❌ Cancel Edit') : 
                 (i18n.language === 'de' ? '🔄 Formular zurücksetzen' : 
                  i18n.language === 'al' ? '🔄 Rivendos Formularin' : 
                  '🔄 Reset Form')
               }
             </button>
           </div>
        </form>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                 <div className="flex items-center justify-between mb-6">
           <div>
             <h3 className="text-2xl font-bold text-gray-800 mb-2 font-zonapro">
               📋 {i18n.language === 'de' ? 'Aktuelle Dienstleistungen' : 
                    i18n.language === 'al' ? 'Shërbimet Aktuale' : 
                    'Current Services'} ({services.length})
             </h3>
             <p className="text-gray-600 font-zonapro">
               {i18n.language === 'de' ? 
                 'Verwalten Sie Ihre bestehenden Dienstleistungen. Klicken Sie auf die Löschen-Schaltfläche, um eine Dienstleistung zu entfernen (sie wird von der öffentlichen Seite ausgeblendet).' :
                i18n.language === 'al' ? 
                 'Menaxhoni shërbimet tuaja ekzistuese. Klikoni butonin e fshirjes për të hequr një shërbim (do të fshihet nga faqja publike).' :
                 'Manage your existing services. Click the delete button to remove a service (it will be hidden from the public page).'
               }
             </p>
           </div>
                     <div className="flex gap-2">
             <button
               onClick={() => fetchServices()}
               className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors duration-200 font-medium font-zonapro"
             >
               🔄 {i18n.language === 'de' ? 'Liste aktualisieren' : 
                    i18n.language === 'al' ? 'Rifresko Listën' : 
                    'Refresh List'}
             </button>
             <button
               onClick={async () => {
                 try {
                   const response = await fetch('/api/debug-services');
                   const data = await response.json();
                   console.log('Debug services result:', data);
                   setMessage(`Debug completed: ${data.data.totalServices} total services, ${data.data.activeServices} active`);
                 } catch (error) {
                   console.error('Debug failed:', error);
                   setMessage('Debug failed');
                 }
               }}
               className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm transition-colors duration-200 font-medium font-zonapro"
             >
               🔍 {i18n.language === 'de' ? 'Dienstleistungen debuggen' : 
                    i18n.language === 'al' ? 'Debug Shërbimet' : 
                    'Debug Services'}
             </button>
           </div>
        </div>
        
                          {services.length === 0 ? (
           <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
             <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
               <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
               </svg>
             </div>
             <h4 className="text-lg font-semibold text-gray-700 mb-2 font-zonapro">
               {i18n.language === 'de' ? 'Noch keine Dienstleistungen erstellt' : 
                i18n.language === 'al' ? 'Asnjë Shërbim i Krijuar Ende' : 
                'No Services Created Yet'}
             </h4>
             <p className="text-gray-600 mb-4 font-zonapro">
               {i18n.language === 'de' ? 
                 'Beginnen Sie mit dem Aufbau Ihres Dienstleistungsportfolios, indem Sie Ihren ersten Service oben erstellen.' :
                i18n.language === 'al' ? 
                 'Filloni të ndërtoni portofolin tuaj të shërbimeve duke krijuar shërbimin tuaj të parë më sipër.' :
                 'Start building your service portfolio by creating your first service above.'}
             </p>
             <div className="text-sm text-gray-500 font-zonapro">
               <p>💡 <strong>{i18n.language === 'de' ? 'Tipp:' : i18n.language === 'al' ? 'Këshillë:' : 'Tip:'}</strong> {i18n.language === 'de' ? 'Erstellen Sie mindestens einen Service, um zu sehen, wie er auf Ihrer öffentlichen Dienstleistungsseite erscheint.' : i18n.language === 'al' ? 'Krijoni të paktën një shërbim për të parë se si do të shfaqet në faqen tuaj publike të shërbimeve.' : 'Create at least one service to see how it will appear on your public services page.'}</p>
             </div>
           </div>
         ) : (
                       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               {services.map((service, index) => (
                 <div key={service._id} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
                   <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                       <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-zonapro">
                         #{index + 1}
                       </span>
                       <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded font-zonapro">
                         {new Date(service.createdAt).toLocaleDateString()}
                       </span>
                     </div>
                                           <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="text-blue-500 hover:text-blue-700 transition-colors duration-200 p-2 hover:bg-blue-50 rounded-full font-zonapro"
                          title="Edit service"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2 hover:bg-red-50 rounded-full font-zonapro"
                          title="Delete service"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                   </div>
                
                                 <div className="space-y-4">
                   {/* Service Titles */}
                   <div className="bg-gray-50 rounded-lg p-4">
                     <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 font-zonapro">
                       🌍 Service Titles
                     </h4>
                     <div className="grid gap-3">
                       {languages.map((lang) => (
                         <div key={lang.code} className="flex items-center gap-3">
                           <span className="text-lg font-zonapro">{lang.flag}</span>
                           <div className="flex-1">
                             <span className="text-xs font-medium text-gray-500 uppercase block font-zonapro">{lang.code}</span>
                             <p className="text-sm font-medium text-gray-800 font-zonapro">{service.title[lang.code as keyof typeof service.title]}</p>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                   
                   {/* Main Image */}
                   <div className="bg-gray-50 rounded-lg p-4">
                     <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 font-zonapro">
                       🖼️ Main Image
                     </h4>
                     <div className="w-full h-32 border border-gray-200 rounded-lg overflow-hidden">
                       <Image 
                         src={service.image} 
                         alt="Service"
                         width={400}
                         height={128}
                         className="w-full h-full object-cover"
                       />
                     </div>
                   </div>
                   
                   {/* Step Images */}
                   {service.stepImages && service.stepImages.length > 0 && (
                     <div className="bg-gray-50 rounded-lg p-4">
                       <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 font-zonapro">
                         🔄 {i18n.language === 'de' ? 'Schritt-für-Schritt-Prozess' : 
                              i18n.language === 'al' ? 'Procesi Hap pas Hapi' : 
                              'Step-by-Step Process'}
                       </h4>
                       <div className="grid gap-3">
                         {service.stepImages.map((step, index) => (
                           <div key={index} className="flex items-center gap-3 p-2 bg-white rounded border">
                             <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                               <span className="text-lg font-bold text-gray-600 font-zonapro">{index + 1}</span>
                             </div>
                             <div className="flex-1">
                               <span className="text-xs font-medium text-gray-500 block font-zonapro">
                                 {i18n.language === 'de' ? 'Schritt' : 
                                  i18n.language === 'al' ? 'Hapi' : 
                                  'Step'} {index + 1}
                               </span>
                               <span className="text-sm font-medium text-gray-800 font-zonapro">{step.titleKey}</span>
                             </div>
                             <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                               {step.image ? (
                                 <Image 
                                   src={step.image} 
                                   alt={`Step ${index + 1}`}
                                   width={64}
                                   height={64}
                                   className="w-full h-full object-cover"
                                 />
                               ) : (
                                 <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                   <span className="text-xs text-gray-500 font-zonapro">
                                     {i18n.language === 'de' ? 'Kein Bild' : 
                                      i18n.language === 'al' ? 'Pa Imazh' : 
                                      'No Image'}
                                   </span>
                                 </div>
                               )}
                             </div>
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
  );
};

export default ServiceManager;
