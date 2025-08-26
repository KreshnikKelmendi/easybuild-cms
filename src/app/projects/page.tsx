import React from 'react';
import ProjectsBanner from '../components/projects/ProjectsBanner';
import Projects from '../components/projects/Projects';

const ProjectsPage = () => {
  return (
    <div className="min-h-screen">
      <ProjectsBanner />
      <Projects />
    </div>
  );
};

export default ProjectsPage;
