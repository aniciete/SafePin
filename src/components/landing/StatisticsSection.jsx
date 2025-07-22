import React from 'react';

const StatisticsSection = () => {
  return (
    <section className="bg-gray-100 dark:bg-neutral-900 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Our Impact, Driven by You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
            <h3 className="text-5xl font-extrabold text-primary dark:text-primary">1,200+</h3>
            <p className="text-gray-700 dark:text-neutral-300 mt-2 text-lg">Community Tips Received</p>
          </div>
          <div className="text-center p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
            <h3 className="text-5xl font-extrabold text-primary dark:text-primary">95%</h3>
            <p className="text-gray-700 dark:text-neutral-300 mt-2 text-lg">Cases Resolved</p>
          </div>
          <div className="text-center p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
            <h3 className="text-5xl font-extrabold text-primary dark:text-primary">50+</h3>
            <p className="text-gray-700 dark:text-neutral-300 mt-2 text-lg">Partner Agencies</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;