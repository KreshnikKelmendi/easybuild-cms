'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FaArrowRight, FaEye } from 'react-icons/fa';
import { gsap } from 'gsap';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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

const Projects = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const projectsSectionRef = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  const projectsPerPage = 6;

  useEffect(() => {
    fetchProjects();
    
    const handleResize = () => {
      // Handle resize if needed in the future
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (inView) {
      animateProjects();
    }
  }, [inView, projects]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.data.filter((project: Project) => project.isActive));
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

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

  const animateProjects = () => {
    projectRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.fromTo(
          ref,
          {
            opacity: 0,
            y: 50,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power2.out',
          }
        );
      }
    });
  };

  const handleProjectClick = (project: Project) => {
    router.push(`/projects/${project._id}`);
  };

  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = projects.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    if (projectsSectionRef.current) {
      projectsSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

     return (
     <div ref={inViewRef} className="bg-gradient-to-br from-gray-50 via-white to-gray-50">


               {/* Projects Section */}
        <div className="px-4 lg:px-[50px] py-16">
         {/* Projects Grid */}
         <div ref={projectsSectionRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-12">
           {currentProjects.map((project, index) => (
             <div
               key={project._id}
               ref={(el) => {
                 projectRefs.current[index] = el;
               }}
               className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-4 cursor-pointer overflow-hidden border border-white/30 relative hover:bg-white/90"
               onClick={() => handleProjectClick(project)}
             >
               {/* Project Image */}
               <div className="relative h-80 overflow-hidden">
                 <Image
                   src={project.mainImage}
                   alt={getTitleInCurrentLanguage(project)}
                   fill
                   className="object-cover transition-transform duration-1000 group-hover:scale-125"
                 />
                 
                 {/* Beautiful gradient overlay on hover */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
                 
                 {/* View button that appears on hover */}
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-8 group-hover:translate-y-0">
                   <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/30 transform rotate-12 group-hover:rotate-0 transition-all duration-500">
                     <FaEye className="text-[#DD4624] text-3xl" />
                   </div>
                 </div>
                 
                 {/* Project category badge */}
                 <div className="absolute top-6 left-6 bg-gradient-to-r from-[#DD4624] to-[#DD4624]/80 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-xl transform -rotate-12 group-hover:rotate-0 transition-all duration-500 font-zonapro">
                   Project
                 </div>
                 
              
               </div>

                             {/* Project Content */}
               <div className="p-6">
                 <h3 className="text-2xl font-custom1 text-gray-800 mb-4 group-hover:text-[#DD4624] transition-colors duration-500 leading-tight font-zonapro">
                   {getTitleInCurrentLanguage(project)}
                 </h3>
                 
                 {/* Additional Images Preview */}
                 {project.additionalImages.length > 0 && (
                   <div className="mb-6">
                     <p className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider font-zonapro">Gallery Preview</p>
                     <div className="flex gap-3">
                       {project.additionalImages.slice(0, 3).map((image, imgIndex) => (
                         <div key={imgIndex} className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg group-hover:border-[#DD4624]/30 transition-all duration-500 transform group-hover:scale-110">
                           <Image
                             src={image}
                             alt={`Additional ${imgIndex + 1}`}
                             fill
                             className="object-cover"
                           />
                         </div>
                       ))}
                       {project.additionalImages.length > 3 && (
                         <div className="w-16 h-16 bg-gradient-to-br from-[#DD4624]/20 to-[#DD4624]/40 rounded-2xl flex items-center justify-center text-sm font-bold text-[#DD4624] border-2 border-[#DD4624]/30 shadow-lg transform group-hover:scale-110 transition-all duration-500 font-zonapro">
                           +{project.additionalImages.length - 3}
                         </div>
                       )}
                     </div>
                   </div>
                 )}

                 {/* Project Footer */}
                 <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                   <div className="flex items-center gap-3 text-gray-600">
                     <div className="w-3 h-3 bg-[#DD4624] rounded-full animate-pulse"></div>
                     <span className="text-sm font-semibold font-zonapro">
                       {new Date(project.createdAt).toLocaleDateString('en-US', {
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric'
                       })}
                     </span>
                   </div>
                   <div className="flex items-center gap-3 text-[#DD4624] group-hover:gap-4 transition-all duration-500 bg-gradient-to-r from-[#DD4624]/10 to-[#DD4624]/20 px-4 py-2 rounded-2xl group-hover:from-[#DD4624]/20 group-hover:to-[#DD4624]/30 shadow-lg">
                     <span className="text-sm font-bold font-zonapro">{t('viewProject')}</span>
                     <FaArrowRight className="text-base transform group-hover:translate-x-2 transition-transform duration-500" />
                   </div>
                 </div>
               </div>
            </div>
          ))}
        </div>

                 {/* Pagination */}
         {totalPages > 1 && (
           <div className="flex justify-center items-center gap-6 mt-16">
             <button
               onClick={() => handlePageChange(currentPage - 1)}
               disabled={currentPage === 1}
               className="px-8 py-4 rounded-2xl bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 border-2 border-white/30 hover:border-[#DD4624]/40 hover:shadow-2xl font-bold text-lg shadow-xl font-zonapro"
             >
               ← Previous
             </button>
             
             <div className="flex items-center gap-3">
               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                 <button
                   key={page}
                   onClick={() => handlePageChange(page)}
                   className={`w-14 h-14 rounded-2xl transition-all duration-500 font-bold text-lg font-zonapro ${
                     currentPage === page
                       ? 'bg-gradient-to-r from-[#DD4624] to-[#DD4624]/80 text-white shadow-2xl scale-110'
                       : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border-2 border-white/30 hover:border-[#DD4624]/40 hover:shadow-xl'
                   }`}
                 >
                   {page}
                 </button>
               ))}
             </div>
             
             <button
               onClick={() => handlePageChange(currentPage + 1)}
               disabled={currentPage === totalPages}
               className="px-8 py-4 rounded-2xl bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 border-2 border-white/30 hover:border-[#DD4624]/40 hover:shadow-2xl font-bold text-lg shadow-xl font-zonapro"
             >
               Next →
             </button>
           </div>
         )}

                          {/* No Projects Message */}
         {projects.length === 0 && (
           <div className="text-center py-24">
             <div className="w-40 h-40 mx-auto bg-gradient-to-br from-[#DD4624]/20 to-[#DD4624]/5 rounded-full flex items-center justify-center mb-10 shadow-2xl">
               <svg className="w-20 h-20 text-[#DD4624]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
               </svg>
             </div>
             <h3 className="text-5xl font-custom1 text-gray-700 mb-6 font-zonapro">No Projects Available Yet</h3>
             <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed font-zonapro">We&apos;re working on amazing projects! Check back soon to see our latest work and achievements.</p>
             <div className="w-20 h-2 bg-gradient-to-r from-[#DD4624] via-[#DD4624]/80 to-[#DD4624] mx-auto mt-8 rounded-full shadow-lg"></div>
           </div>
         )}
       </div>



    </div>
  );
};

export default Projects;
