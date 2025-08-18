import { ShieldIcon, TrendingUpIcon, ZapIcon } from "lucide-react";

const ProjectHighlights = () => {
  return (
    <section id="features" className="section bg-surface/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-headline mb-4">
            Project Highlights
          </h2>
          <p className="text-xl text-body-text max-w-2xl mx-auto">
            Key features and capabilities of the Talent Scan platform.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="rounded-lg smooth-hover transition-all duration-base bg-card text-card-foreground shadow-custom-lg border border-border p-6 text-center h-full">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center text-white">
                  <TrendingUpIcon className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-headline mb-4">
                AI-Powered Analysis
              </h3>
              <p className="text-body-text leading-relaxed">
                Advanced machine learning algorithms analyze resumes across 50+
                criteria for comprehensive insights.
              </p>
            </div>
          </div>
          <div>
            <div className="rounded-lg smooth-hover transition-all duration-base bg-card text-card-foreground shadow-custom-lg border border-border p-6 text-center h-full">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center text-white">
                  <ZapIcon className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-headline mb-4">
                Privacy-First Design
              </h3>
              <p className="text-body-text leading-relaxed">
                All processing happens locally in your browser. No resume data
                is stored on external servers.
              </p>
            </div>
          </div>
          <div>
            <div className="rounded-lg smooth-hover transition-all duration-base bg-card text-card-foreground shadow-custom-lg border border-border p-6 text-center h-full">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center text-white">
                  <ShieldIcon className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-headline mb-4">
                Multi-Language Support
              </h3>
              <p className="text-body-text leading-relaxed">
                Available in English, Arabic, Spanish, and French, with more
                languages planned.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectHighlights;
