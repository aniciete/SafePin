import React from 'react';
import { Link } from 'react-router-dom';
import SafePinMapLogo from '@assets/SafePin Map Logo.png';

function Hero() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="hero-map-icon mb-8 transform hover:scale-105 transition-transform duration-300">
            <img
              src={SafePinMapLogo}
              alt="SafePin Map Logo"
              className="w-44 h-44 mx-auto rounded-2xl shadow-xl"
            />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fadeIn">
            Creating Safer Communities
          </h1>
          <p className="text-xl text-gray-600 mb-12 animate-fadeIn max-w-2xl mx-auto">
            SafePin empowers citizens to anonymously report incidents and stay informed
            about safety concerns in your community.
          </p>
          <div className="space-y-6 animate-fadeIn">
            <Link
              to="/report"
              className="inline-block bg-green-600 text-white px-10 py-5 rounded-lg text-xl font-semibold hover:bg-green-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              Report Incident
            </Link>
            <div>
              <Link
                to="/verification"
                className="inline-block text-green-600 hover:text-green-700 transition-colors text-lg hover:underline"
              >
                Check Existing Report Status
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero; 