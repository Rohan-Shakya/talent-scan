const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section bg-surface/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-headline mb-4">
            How It Works
          </h2>
          <p className="text-xl text-body-text max-w-2xl mx-auto">
            Get started with Talent Scan in just three simple steps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary text-white flex items-center justify-center text-xl font-bold">
                01
              </div>
              <div
                className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border transform translate-x-8"
                aria-hidden="true"
              ></div>
            </div>
            <h3 className="text-xl font-semibold text-headline mb-3">
              Upload Resume
            </h3>
            <p className="text-body-text">
              Simply drag and drop a PDF resume or click to select.
            </p>
          </div>
          <div className="relative text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary text-white flex items-center justify-center text-xl font-bold">
                02
              </div>
              <div
                className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border transform translate-x-8"
                aria-hidden="true"
              ></div>
            </div>
            <h3 className="text-xl font-semibold text-headline mb-3">
              AI Analysis
            </h3>
            <p className="text-body-text">
              Our advanced AI analyzes skills, experience, and fit.
            </p>
          </div>
          <div className="relative text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary text-white flex items-center justify-center text-xl font-bold">
                03
              </div>
            </div>
            <h3 className="text-xl font-semibold text-headline mb-3">
              Get Insights
            </h3>
            <p className="text-body-text">
              Receive detailed analysis with scores and recommendations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
