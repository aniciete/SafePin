import React from 'react';
import { Link } from 'react-router-dom';
import SafePinMapLogo from '/SafePin Map Logo.png';

const HeroSection = () => {
  return (
    <section className="bg-white dark:bg-neutral-900">
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">Creating Safer Communities, Together.</h1>
          <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-neutral-400">
            SafePin is a community-driven platform for reporting incidents and promoting safety in your neighborhood. Your reports help create a safer environment for everyone.
          </p>
          <Link to="/report" className="inline-flex items-center justify-center px-8 py-4 mr-3 text-lg font-extrabold text-center !text-white rounded-lg bg-primary hover:bg-primary-dark focus:ring-4 focus:ring-primary/50 dark:focus:ring-primary/80 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            Report an Incident
            <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </Link>
          <Link to="/track" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:ring-gray-800">
            Check Existing Report Status
          </Link>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <img src={SafePinMapLogo} alt="SafePin Map Logo" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;