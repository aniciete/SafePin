import React from 'react';
import { EyeOff, Bell, Users } from 'lucide-react';

const KeyFeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-foreground mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="p-8 bg-card rounded-lg shadow-lg">
            <div className="mb-4">
              <EyeOff className="w-16 h-16 mx-auto text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Anonymous Reporting</h3>
            <p className="text-muted-foreground">
              Submit reports without revealing your identity. Your privacy is our top priority.
            </p>
          </div>
          <div className="p-8 bg-card rounded-lg shadow-lg">
            <div className="mb-4">
              <Bell className="w-16 h-16 mx-auto text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Real-Time Alerts</h3>
            <p className="text-muted-foreground">
              Authorities are notified instantly, enabling quick response to reported incidents.
            </p>
          </div>
          <div className="p-8 bg-card rounded-lg shadow-lg">
            <div className="mb-4">
              <Users className="w-16 h-16 mx-auto text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Community-Driven</h3>
            <p className="text-muted-foreground">
              Be an active part of making your neighborhood safer for everyone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection;