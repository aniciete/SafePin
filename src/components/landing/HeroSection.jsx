import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import { getAllPhilippineAgencies } from '../../constants/philippines';

// Get all Philippine government agencies from constants
const authorities = getAllPhilippineAgencies();

const HeroSection = () => {
  return (
    <section className="bg-background text-foreground py-20 sm:py-24 lg:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Report an Incident Safely & Anonymously
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Your safety is our priority. We're here to help you report incidents with confidence and ease.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
            <Link to="/report">
              Report Now
            </Link>
          </Button>
        </div>
        <div className="mt-16">
          <h2 className="text-lg font-semibold text-muted-foreground">
            Trusted by National Authorities & Organizations
          </h2>
          <div className="mt-8 flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            {authorities.map((authority) => (
              <div key={authority.acronym} className="flex-shrink-0" title={authority.description}>
                <img
                  className="h-12 w-auto"
                  src={authority.logo}
                  alt={`${authority.name} (${authority.acronym})`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;