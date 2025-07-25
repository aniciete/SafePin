import React from 'react';
import { motion } from 'framer-motion';
import { EyeOff, Bell, Users } from 'lucide-react';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    }
  },
};

const KeyFeaturesSection = () => {
  const features = [
    {
      icon: <EyeOff className="w-16 h-16 mx-auto text-primary" />,
      title: 'Anonymous Reporting',
      description: 'Submit reports without revealing your identity. Your privacy is our top priority.',
    },
    {
      icon: <Bell className="w-16 h-16 mx-auto text-primary" />,
      title: 'Real-Time Alerts',
      description: 'Authorities are notified instantly, enabling quick response to reported incidents.',
    },
    {
      icon: <Users className="w-16 h-16 mx-auto text-primary" />,
      title: 'Community-Driven',
      description: 'Be an active part of making your neighborhood safer for everyone.',
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <AnimateOnScroll>
          <h2 className="text-4xl font-bold text-center text-foreground mb-12">Key Features</h2>
        </AnimateOnScroll>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-8 bg-card rounded-lg shadow-lg"
              variants={itemVariants}
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection;