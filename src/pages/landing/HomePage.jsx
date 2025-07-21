import HeroSection from '../../components/landing/HeroSection';
import HowItWorksSection from '../../components/landing/HowItWorksSection';
import AboutSection from '../../components/landing/AboutSection';
import StatisticsSection from '../../components/landing/StatisticsSection';
import TrustedBySection from '../../components/landing/TrustedBySection';
import RecentAlertsSection from '../../components/landing/RecentAlertsSection';

const HomePage = () => {
  return (
    <div className="bg-gray-50">
      <HeroSection />

      <HowItWorksSection />

      <AboutSection />

      <StatisticsSection />

      <TrustedBySection />

      <RecentAlertsSection />

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-8 bg-white rounded-lg shadow-lg">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm0 0c-1.104 0-2 .896-2 2s.896 2 2 2m0-10c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Anonymous Reporting</h3>
              <p className="text-gray-600">
                Submit reports without revealing your identity. Your privacy is our top priority.
              </p>
            </div>
            <div className="p-8 bg-white rounded-lg shadow-lg">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Real-Time Alerts</h3>
              <p className="text-gray-600">
                Authorities are notified instantly, enabling quick response to reported incidents.
              </p>
            </div>
            <div className="p-8 bg-white rounded-lg shadow-lg">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Community-Driven</h3>
              <p className="text-gray-600">
                Be an active part of making your neighborhood safer for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
