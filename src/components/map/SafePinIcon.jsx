import React from 'react';

// Upgraded to accept an `isInactive` prop.
const SafePinIcon = ({ color = '#4CAF50', isInactive = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 500 500"
    width="100%"
    height="100%"
  >
    <g transform="translate(2.7, 2.6) scale(1.01)">
      <g transform="translate(-19.6, 0.8) scale(0.65)">
        <path
          fill={color}
          // If inactive, reduce the fill opacity to make it look like a ghost.
          fillOpacity={isInactive ? 0.3 : 1}
          d="M409.18 0.94c-1.4 0-2.79.08-4.18.12-1.4-.04-2.79-.12-4.19-.12-129.15 0-233.86 109.16-233.86 243.81 0 22.98 8.91 76.1 22.29 98.15L405 752.62l215.74-410.73c13.38-22.05 22.29-75.17 22.29-98.15C643.04 110.1 538.33 0.94 409.18 0.94z"
        />
      </g>
      <path
        fill="#ffffff"
        // Also reduce the opacity of the inner white circle for the ghost effect.
        fillOpacity={isInactive ? 0.6 : 1}
        d="M328.29 142.62c0 46.47-37.67 84.13-84.13 84.13-46.46 0-84.13-37.66-84.13-84.13s37.67-84.13 84.13-84.13c46.46 0 84.13 37.66 84.13 84.13z"
      />
    </g>
  </svg>
);

export default SafePinIcon;