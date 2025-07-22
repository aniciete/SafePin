import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: 'Report',
      description: 'Submit a report about a crime or incident in your area. Provide as much detail as possible to help authorities understand the situation.',
    },
    {
      number: 2,
      title: 'Verify',
      description: 'Our team will verify the report to ensure its authenticity. We may contact you for more information if needed.',
    },
    {
      number: 3,
      title: 'Inform',
      description: 'Once verified, the report is sent to the appropriate authorities for their action. They will be notified of the incident and its details.',
    },
    {
      number: 4,
      title: 'Act',
      description: 'The authorities will take the necessary action to address the report. You can track the status of your report through our platform.',
    },
  ];

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center p-6 rounded-lg bg-card shadow-md">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-primary rounded-full text-primary-foreground text-2xl font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;