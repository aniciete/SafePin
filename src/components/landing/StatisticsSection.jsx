import React from 'react';
import { motion } from 'framer-motion';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

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

const StatisticsSection = () => {
  const stats = [
    { value: 1200, suffix: '+', label: 'Community Tips Received' },
    { value: 95, suffix: '%', label: 'Cases Resolved' },
    { value: 50, suffix: '+', label: 'Partner Agencies' },
  ];

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <AnimateOnScroll>
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Our Impact, Driven by You</h2>
        </AnimateOnScroll>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-card rounded-lg shadow-md"
              variants={itemVariants}
            >
              <h3 className="text-5xl font-extrabold text-primary">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="text-muted-foreground mt-2 text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatisticsSection;