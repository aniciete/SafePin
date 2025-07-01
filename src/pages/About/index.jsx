import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">About SafePin</h1>
      <div className="max-w-3xl mx-auto">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            SafePin is dedicated to creating safer communities through technology and collaboration. 
            We empower citizens to take an active role in community safety while maintaining their privacy and anonymity.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="grid gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-medium mb-2">Anonymous Reporting</h3>
              <p className="text-gray-700">
                Report incidents securely and anonymously through our platform.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-medium mb-2">Community Alerts</h3>
              <p className="text-gray-700">
                Stay informed about safety concerns in your area through real-time alerts.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-medium mb-2">Authority Collaboration</h3>
              <p className="text-gray-700">
                Direct communication channel with local authorities for faster response.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Join Us</h2>
          <p className="text-gray-700">
            Be part of the movement to create safer communities. Your participation makes 
            a difference in building a more secure environment for everyone.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About; 