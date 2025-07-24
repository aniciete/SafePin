import React from 'react';
import { ShieldCheck } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
            <ShieldCheck className="w-48 h-48 text-primary" />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">About SafePin</h2>
            <p className="text-muted-foreground">
              SafePin is a community-driven platform dedicated to enhancing public safety and security. Our mission is to empower citizens by providing a reliable and accessible way to report incidents, share vital information, and stay informed about their surroundings. By fostering collaboration between residents and local authorities, we aim to create safer, more resilient communities for everyone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;