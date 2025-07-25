import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import SafePinIcon from './SafePinIcon';

const MapMarker = React.memo(({ severity = 'Low', status = 'pending_verification', onClick, title, isSelected = false }) => {

  const getSeverityColor = () => {
    switch (String(severity).toLowerCase()) {
      case 'critical': return 'hsl(var(--destructive))';
      case 'high': return '#FFC107';
      case 'medium': return 'hsl(var(--secondary))';
      case 'low': default: return 'hsl(var(--primary))';
    }
  };

  const color = getSeverityColor();
  const needsAttention = status === 'pending_verification';
  const isResolved = status === 'resolved';

  const markerVariants = {
    initial: { y: -30, opacity: 0, scale: 0.8 },
    animate: { 
      y: 0, 
      // Set a base lower opacity for resolved items
      opacity: isResolved ? 0.75 : 1,
      scale: isSelected ? 1.3 : 1,
      zIndex: isSelected ? 10 : 1,
    },
    hover: { 
      scale: 1.1, 
      zIndex: 5,
      // Ensure it becomes fully opaque on hover, even if resolved
      opacity: 1, 
    }
  };

  return (
    <motion.div
      variants={markerVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className="relative w-10 h-10 cursor-pointer"
      onClick={onClick}
      title={`${title} (${status})`} // Add status to the tooltip for clarity
      style={{
        transformOrigin: 'bottom center',
        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.3))',
      }}
    >
      {needsAttention && !isSelected && (
        <div
          className="absolute inset-0 w-full h-full rounded-full animate-ping"
          style={{ backgroundColor: color, opacity: 0.75 }}
        />
      )}
      
      <div className={cn('relative w-full h-full')}>
        {/* Pass the isInactive prop to the icon */}
        <SafePinIcon color={color} isInactive={isResolved} />
      </div>
    </motion.div>
  );
});

MapMarker.displayName = 'MapMarker';

export default MapMarker;