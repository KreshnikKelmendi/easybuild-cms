import Banner from "./components/main/Banner";
import OurServices from "./components/services/OurServices";
import AboutUsOnHomePage from "./components/about/AboutUsOnHomePage";
import Woods from "./components/materials/Woods";
import StepByStep from "./components/about/StepByStep";
import ProjectsOnHomePage from "./components/about/ProjectsOnHomePage";

export default function Home() {
  return (
    <>
      <Banner />
      <OurServices />
      <AboutUsOnHomePage />
      <div className='mt-[-180px] lg:mt-[-50vh] 2xl:mt-[-40vh] z-50'>
      <ProjectsOnHomePage />
      </div>
      <Woods />
      <StepByStep />
    </>
  );
}
