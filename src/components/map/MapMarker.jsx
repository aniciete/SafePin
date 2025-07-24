import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import SafePinIcon from './SafePinIcon';

const MapMarker = ({ severity = 'Low', pulse = false, onClick, title, isSelected = false }) => {
  const getSeverityColor = () => {
    switch (severity) {
      case 'Critical': return 'hsl(4, 90%, 58%)';
      case 'High': return '#FFC107';
      case 'Low': return 'hsl(122, 39%, 49%)';
      case 'Medium':
      default: return 'hsl(210, 89%, 53%)';
    }
  };

  const color = getSeverityColor();

  return (
    <motion.div
      animate={{ 
        y: 0, 
        opacity: 1,
        scale: isSelected ? 1.25 : 1 // Grow when selected
      }}
      initial={{ y: -50, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      whileHover={{ scale: 1.1, zIndex: 1 }}
      className="relative w-10 h-10 cursor-pointer"
      onClick={onClick}
      title={title}
      style={{
        transformOrigin: 'bottom center',
        filter: 'drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4))',
      }}
    >
      {pulse && !isSelected && ( // Only pulse if not selected
        <div
          className="absolute inset-0 w-full h-full rounded-full animate-ping"
          style={{ backgroundColor: color, opacity: 0.75 }}
        />
      )}
      
      <div className={cn('relative w-full h-full', (pulse || isSelected) && 'z-10')}>
        <SafePinIcon color={color} />
      </div>
    </motion.div>
  );
};

export default MapMarker;