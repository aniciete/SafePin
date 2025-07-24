import HeroSection from '../../components/landing/HeroSection';
import HowItWorksSection from '../../components/landing/HowItWorksSection';
import AboutSection from '../../components/landing/AboutSection';
import StatisticsSection from '../../components/landing/StatisticsSection';
import TrustSignalsSection from '../../components/landing/TrustSignalsSection';
import KeyFeaturesSection from '../../components/landing/KeyFeaturesSection';

const HomePage = () => {
  return (
    <div>
      <HeroSection />

      <TrustSignalsSection />

      <HowItWorksSection />

      <AboutSection />

      <StatisticsSection />

      <KeyFeaturesSection />
    </div>
  );
};

export default HomePage;
