import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { getAllPhilippineAgencies } from '../../constants/philippines';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const authorities = getAllPhilippineAgencies();

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    }
  },
};

const HeroSection = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="bg-background text-foreground py-20 sm:py-24 lg:py-32">
      <motion.div
        className="container mx-auto px-4 text-center"
        variants={prefersReducedMotion ? {} : containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
          variants={itemVariants}
        >
          Report an Incident Safely & Anonymously
        </motion.h1>
        <motion.p
          className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Your safety is our priority. We're here to help you report incidents with confidence and ease.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          variants={itemVariants}
        >
          <Button asChild size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
            <Link to="/report">
              Report Now
            </Link>
          </Button>
        </motion.div>
        <motion.div className="mt-16" variants={itemVariants}>
          <h2 className="text-lg font-semibold text-muted-foreground">
            Trusted by National Authorities & Organizations
          </h2>
          <div className="mt-8 flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            {authorities.map((authority) => (
              <div key={authority.acronym} className="flex-shrink-0" title={authority.description}>
                <img
                  className="h-12 w-auto"
                  src={authority.logo}
                  alt={`${authority.name} (${authority.acronym})`}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;