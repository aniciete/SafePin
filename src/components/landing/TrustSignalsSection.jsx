import React from 'react';
import { ShieldCheckIcon, LockClosedIcon, WifiIcon } from '@heroicons/react/24/outline';

const TrustSignalsSection = () => {
  return (
    <section className="bg-white dark:bg-neutral-800 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-4">
              <ShieldCheckIcon className="w-12 h-12 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-gray-800">100% Anonymous</h3>
              <p className="text-gray-600 text-sm">Your report is completely anonymous. We are committed to protecting your identity.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <WifiIcon className="w-12 h-12 text-primary mb-3 transform -rotate-45" />
              <h3 className="text-lg font-semibold text-gray-800">No IP Logging</h3>
              <p className="text-gray-600 text-sm">We do not track or store your IP address, ensuring your privacy.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <LockClosedIcon className="w-12 h-12 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-gray-800">Secure & Encrypted</h3>
              <p className="text-gray-600 text-sm">All data is transmitted over a secure, encrypted connection.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignalsSection;