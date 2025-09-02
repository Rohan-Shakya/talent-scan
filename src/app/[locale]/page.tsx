import DefaultLayout from "@/components/layouts/default-layout";
import { HeroBanner } from "@/components/sections/hero-banner";
import { ProjectHighlights } from "@/components/sections/project-highlights";
import { ProjectBenefits } from "@/components/sections/project-benefits";
import { HowItWorks } from "@/components/sections/how-it-works";
import { ProjectFaqs } from "@/components/sections/project-faqs";
import { GetStarted } from "@/components/sections/get-started";

export default function Home() {
  return (
    <DefaultLayout>
      <div className="min-h-[calc(100vh-5rem)]">
        <div className="min-h-screen">
          <HeroBanner />
          <ProjectHighlights />
          <ProjectBenefits />
          <HowItWorks />
          <ProjectFaqs />
          <GetStarted />
        </div>
      </div>
    </DefaultLayout>
  );
}
