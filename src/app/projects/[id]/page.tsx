'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

interface Project {
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
  mainImage: string;
  additionalImages: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  
  console.log('ProjectDetailPage - ID from params:', id);
  console.log('ProjectDetailPage - ID type:', typeof id);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        console.log('Fetching project with ID:', id);
        const response = await fetch(`/api/projects/${id}`);
        const data = await response.json();
        console.log('API response:', data);
        
        if (data.success) {
          setProject(data.data);
        } else {
          console.log('API returned error:', data.message);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const getTitleInCurrentLanguage = (project: Project) => {
    const currentLang = i18n.language;
    switch (currentLang) {
      case 'de':
        return project.title.de;
      case 'al':
        return project.title.al;
      default:
        return project.title.en;
    }
  };

  const getDescriptionInCurrentLanguage = (project: Project) => {
    const currentLang = i18n.language;
    switch (currentLang) {
      case 'de':
        return project.description.de;
      case 'al':
        return project.description.al;
      default:
        return project.description.en;
    }
  };

  const openFullScreen = (image: string) => {
    setSelectedImage(image);
    setIsFullScreenOpen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreenOpen(false);
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#DD4624] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-custom1 text-gray-800 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <p className="text-sm text-gray-500 mb-6">Project ID: {id}</p>
          <div className="space-y-2">
            <a 
              href="/api/debug-projects" 
              target="_blank" 
              className="block text-[#DD4624] hover:underline"
            >
              Debug Database
            </a>
            <a 
              href="/api/seed-projects" 
              className="block text-[#DD4624] hover:underline"
            >
              Seed Sample Projects
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div 
        className='lg:h-[523px] px-5 lg:px-[50px] 2xl:px-[110px] flex flex-col lg:flex-row justify-center py-12 lg:py-0 lg:pt-24'
        style={{ backgroundColor: '#DD4624' }}
      >
        <div className='lg:w-1/2 w-full'>
          <p className='text-[32px] lg:text-[85px] font-custom1 2xl:w-[676px] lg:leading-[99.7px] text-white'>
            {getTitleInCurrentLanguage(project)}
          </p>
        </div>
                 <div className='lg:w-1/2 w-full'>
           <p className='text-[#F3F4F4] 2xl:w-[651px] text-[18px] font-custom leading-[21.15px]'>
             {getDescriptionInCurrentLanguage(project)}
           </p>
         </div>
      </div>

                           {/* Gallery Section */}
        <div className='lg:mt-[-200px]'>
          <div className="px-5 lg:px-8 pb-24">
            <div className="overflow-hidden">
              {/* Gallery Header */}
              <div className="p-8 lg:p-12 border-b border-gray-200/30">
                <div className="text-center">
                  <h3 className="text-3xl lg:text-4xl font-custom1 text-white mb-4">Project Gallery</h3>
                  <p className="text-gray-200 text-lg">Explore the visual journey of this project</p>
                </div>
              </div>
             
             {/* Three Main Images Display */}
             {project.additionalImages.length > 0 && (
               <div className="p-0 lg:p-12">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                   {project.additionalImages.slice(0, 3).map((image, index) => (
                     <div key={index} className="group relative">
                       {/* Image Container */}
                       <div 
                         className="relative h-64 lg:h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                         onClick={() => openFullScreen(image)}
                       >
                         <Image
                           src={image}
                           alt={`Project Image ${index + 1}`}
                           fill
                           className="object-cover transition-transform duration-700 group-hover:scale-110"
                         />
                         
                         {/* Hover Overlay */}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                         
                         {/* Image Number Badge */}
                         <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                           {index + 1}
                         </div>
                         
                         {/* Click to View Full Screen Hint */}
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                           <div className="bg-black/70 backdrop-blur-sm rounded-xl p-4 text-center">
                             <svg className="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                             </svg>
                             <p className="text-white font-semibold text-sm">Click to view full screen</p>
                           </div>
                         </div>
                       </div>
                       
                       {/* Image Description */}
                       <div className="mt-4 text-center">
                         <p className="text-gray-200 font-medium">Project View {index + 1}</p>
                       </div>
                     </div>
                   ))}
                 </div>
                 
                 {/* Additional Images (if more than 3) */}
                 {project.additionalImages.length > 3 && (
                   <div className="mt-12">
                     <h4 className="text-2xl font-custom1 text-white mb-6 text-center">Additional Views</h4>
                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                       {project.additionalImages.slice(3).map((image, index) => (
                         <div key={index + 3} className="group relative">
                           <div 
                             className="relative h-24 lg:h-32 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                             onClick={() => openFullScreen(image)}
                           >
                             <Image
                               src={image}
                               alt={`Additional View ${index + 4}`}
                               fill
                               className="object-cover transition-transform duration-500 group-hover:scale-110"
                             />
                             
                             {/* Hover Overlay */}
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                             
                             {/* Image Number */}
                             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                               <span className="text-white font-bold text-lg">{index + 4}</span>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
             )}
             
             {/* No Images Message */}
             {project.additionalImages.length === 0 && (
               <div className="p-16 text-center">
                 <div className="w-24 h-24 mx-auto bg-gray-200/20 rounded-full flex items-center justify-center mb-6">
                   <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
                 </div>
                 <h4 className="text-xl font-custom1 text-gray-200 mb-2">No Gallery Images</h4>
                 <p className="text-gray-300">Additional project images will be added soon.</p>
               </div>
             )}
           </div>
         </div>
       </div>

       {/* Full Screen Image Modal */}
       {isFullScreenOpen && selectedImage && (
         <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="relative w-full h-full flex items-center justify-center">
             {/* Close Button */}
             <button
               onClick={closeFullScreen}
               className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 transition-all duration-300 hover:scale-110"
             >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>

             {/* Full Screen Image */}
             <div className="relative w-full h-full flex items-center justify-center">
               <Image
                 src={selectedImage}
                 alt="Full Screen View"
                 fill
                 className="object-contain"
                 priority
               />
             </div>

             {/* Navigation Arrows (if multiple images) */}
             {project.additionalImages.length > 1 && (
               <>
                 <button
                   onClick={() => {
                     const currentIndex = project.additionalImages.indexOf(selectedImage);
                     const prevIndex = currentIndex === 0 ? project.additionalImages.length - 1 : currentIndex - 1;
                     setSelectedImage(project.additionalImages[prevIndex]);
                   }}
                   className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 transition-all duration-300 hover:scale-110"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                   </svg>
                 </button>

                 <button
                   onClick={() => {
                     const currentIndex = project.additionalImages.indexOf(selectedImage);
                     const nextIndex = currentIndex === project.additionalImages.length - 1 ? 0 : currentIndex + 1;
                     setSelectedImage(project.additionalImages[nextIndex]);
                   }}
                   className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 transition-all duration-300 hover:scale-110"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                   </svg>
                 </button>
               </>
             )}

             {/* Image Counter */}
             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
               {project.additionalImages.indexOf(selectedImage) + 1} of {project.additionalImages.length}
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

export default ProjectDetailPage;
