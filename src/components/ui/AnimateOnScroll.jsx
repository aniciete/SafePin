import { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import PropTypes from 'prop-types';

const AnimateOnScroll = ({ children, variants, transition, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const controls = useAnimation();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (isInView && !prefersReducedMotion) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [isInView, controls, prefersReducedMotion]);

  const defaultVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const defaultTransition = {
    duration: 0.5,
    ease: 'easeOut',
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={prefersReducedMotion ? {} : (variants || defaultVariants)}
      transition={transition || defaultTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

AnimateOnScroll.propTypes = {
  children: PropTypes.node.isRequired,
  variants: PropTypes.object,
  transition: PropTypes.object,
  className: PropTypes.string,
};

export default AnimateOnScroll;