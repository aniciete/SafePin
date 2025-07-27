import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import SafePinIcon from './SafePinIcon';

const MapMarker = React.memo(({ severity = 'Low', status = 'pending_verification', onClick, title, isSelected = false, isHovered = false, isDimmed = false }) => {

  const getSeverityColor = () => {
    // THIS IS THE FIX: The report submission pin will now always use the primary brand color.
    // Dashboard markers will still use severity colors.
    if (severity === 'critical' && status === 'pending_verification') {
      return 'hsl(var(--primary))';
    }
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
      opacity: isResolved ? 0.75 : (isDimmed ? 0.3 : 1),
      scale: isSelected ? 1.3 : (isHovered ? 1.1 : 1),
    },
  };

  return (
    <motion.div
      variants={markerVariants}
      initial="initial"
      animate="animate"
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className="relative w-10 h-10 cursor-pointer"
      onClick={onClick}
      title={`${title} (${status})`}
      style={{
        transformOrigin: 'bottom center',
        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.3))',
        zIndex: isSelected || isHovered ? 10 : 1,
      }}
    >
      {needsAttention && !isSelected && (
        <div
          className="absolute inset-0 w-full h-full rounded-full animate-ping"
          style={{ backgroundColor: color, opacity: 0.75 }}
        />
      )}
      
      <div className={cn('relative w-full h-full')}>
        <SafePinIcon color={color} isInactive={isResolved} />
      </div>
    </motion.div>
  );
});

MapMarker.displayName = 'MapMarker';
export default MapMarker;