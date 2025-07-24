import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Map marker component for Google Maps
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isSelected - Whether the marker is selected
 * @param {string} props.severity - Severity level for color (Critical, High, Medium, Low)
 * @param {string} props.title - Marker title/tooltip
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.pulse - Whether to show pulse animation
 * @returns {JSX.Element} Marker element
 */
const MapMarker = ({
  isSelected = false,
  severity = 'Medium',
  title = '',
  onClick,
  pulse = false
}) => {
  // Get color based on severity
  const getMarkerColor = () => {
    switch (severity) {
      case 'Critical': return 'hsl(var(--destructive))';
      case 'High': return 'hsl(var(--warning))';
      case 'Medium': return 'hsl(var(--secondary))';
      case 'Low': return 'hsl(var(--primary))';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  return (
    <div
      className="relative cursor-pointer"
      onClick={onClick}
      title={title}
    >
      {/* Pulse animation element */}
      {pulse && (
        <div
          className="absolute inset-0 rounded-full bg-current opacity-75 animate-ping"
          style={{ color: getMarkerColor() }}
        />
      )}
      
      {/* Marker element */}
      <motion.div
        animate={{ scale: isSelected ? 1.25 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn(
          `w-6 h-6 rounded-full shadow-lg border-2 border-white
          transition-all duration-300 ease-out transform
          hover:scale-110 active:scale-95`,
          isSelected && 'z-10 shadow-xl'
        )}
        style={{
          backgroundColor: getMarkerColor(),
        }}
      />
    </div>
  );
};

export default MapMarker;