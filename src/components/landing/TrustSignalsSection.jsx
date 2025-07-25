import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, LockClosedIcon, WifiIcon } from '@heroicons/react/24/outline';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    }
  },
};

const TrustSignalsSection = () => {
  const signals = [
    {
      icon: <ShieldCheckIcon className="w-12 h-12 text-primary mb-3" />,
      title: '100% Anonymous',
      description: 'Your report is completely anonymous. We are committed to protecting your identity.',
    },
    {
      icon: <WifiIcon className="w-12 h-12 text-primary mb-3 transform -rotate-45" />,
      title: 'No IP Logging',
      description: 'We do not track or store your IP address, ensuring your privacy.',
    },
    {
      icon: <LockClosedIcon className="w-12 h-12 text-primary mb-3" />,
      title: 'Secure & Encrypted',
      description: 'All data is transmitted over a secure, encrypted connection.',
    },
  ];

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <AnimateOnScroll>
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {signals.map((signal, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center p-4"
                  variants={itemVariants}
                >
                  {signal.icon}
                  <h3 className="text-lg font-semibold text-foreground">{signal.title}</h3>
                  <p className="text-muted-foreground text-sm">{signal.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default TrustSignalsSection;