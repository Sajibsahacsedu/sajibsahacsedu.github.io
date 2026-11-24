import { ScrollTracker } from "@/components/ScrollTracker";
import { HudOverlay } from "@/components/hud/HudOverlay";
import { Navbar } from "@/components/hud/Navbar";
import { Preloader } from "@/components/hud/Preloader";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { EvaluationSection } from "@/components/sections/EvaluationSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ResearchSection } from "@/components/sections/ResearchSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { SceneLoader } from "@/components/three/SceneLoader";

export default function HomePage() {
  return (
    <div className="relative min-h-svh w-full overflow-x-clip bg-black text-white">
      <Preloader />
      <SceneLoader />
      <ScrollTracker />
      <Navbar />
      <HudOverlay />

      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <EvaluationSection />
        <SkillsSection />
        <ResearchSection />
        <ProjectsSection />
        <EducationSection />
        <ContactSection />
      </main>
    </div>
  );
}
