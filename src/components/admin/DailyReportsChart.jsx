import React from 'react';
import GlobalSystemOverview from './GlobalSystemOverview';

/**
 * This component is now a wrapper. The main analytics logic has been
 * consolidated into the GlobalSystemOverview for a unified dashboard experience.
 */
const DailyReportsChart = () => {
  return <GlobalSystemOverview />;
};

export default DailyReportsChart;