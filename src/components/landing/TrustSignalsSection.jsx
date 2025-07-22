import React from 'react';
import { ShieldCheckIcon, LockClosedIcon, WifiIcon } from '@heroicons/react/24/outline';

const TrustSignalsSection = () => {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-4">
              <ShieldCheckIcon className="w-12 h-12 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-foreground">100% Anonymous</h3>
              <p className="text-muted-foreground text-sm">Your report is completely anonymous. We are committed to protecting your identity.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <WifiIcon className="w-12 h-12 text-primary mb-3 transform -rotate-45" />
              <h3 className="text-lg font-semibold text-foreground">No IP Logging</h3>
              <p className="text-muted-foreground text-sm">We do not track or store your IP address, ensuring your privacy.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <LockClosedIcon className="w-12 h-12 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-foreground">Secure & Encrypted</h3>
              <p className="text-muted-foreground text-sm">All data is transmitted over a secure, encrypted connection.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignalsSection;