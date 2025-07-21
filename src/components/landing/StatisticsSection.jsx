import React from 'react';

const StatisticsSection = () => {
  return (
    <section className="bg-gray-100 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">SafePin Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-green-600">1,200+</h3>
            <p className="text-gray-600">Incidents Reported</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-green-600">95%</h3>
            <p className="text-gray-600">Cases Resolved</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-green-600">50+</h3>
            <p className="text-gray-600">Partner Agencies</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-green-600">10,000+</h3>
            <p className="text-gray-600">Active Users</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;