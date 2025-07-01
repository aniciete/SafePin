import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faUsers,
  faShieldAlt,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

function Statistics() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          SafePin Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="h-8 w-8 text-green-600 mb-4"
            />
            <div className="text-3xl font-bold text-gray-900 mb-2">1,738</div>
            <div className="text-gray-600">Total Reports</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <FontAwesomeIcon
              icon={faUsers}
              className="h-8 w-8 text-green-600 mb-4"
            />
            <div className="text-3xl font-bold text-gray-900 mb-2">47</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <FontAwesomeIcon
              icon={faShieldAlt}
              className="h-8 w-8 text-green-600 mb-4"
            />
            <div className="text-3xl font-bold text-gray-900 mb-2">279</div>
            <div className="text-gray-600">Total Incidents</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="h-8 w-8 text-green-600 mb-4"
            />
            <div className="text-3xl font-bold text-gray-900 mb-2">9</div>
            <div className="text-gray-600">Participating Authorities</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Statistics; 