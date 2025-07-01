import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt,
  faMapMarkerAlt,
  faCheckCircle,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import SafePinMapLogo from '@assets/SafePin Map Logo.png';
import Alert1 from '@assets/News/Alert 1.png';
import Hero from '@components/Hero';
import Statistics from '@components/Statistics';
import AlertCard from '@components/AlertCard';

// Import authority logos
import DICTLogo from '@assets/Authorities/Department_of_Information_and_Communications_Technology_(DICT).svg';
import DILGLogo from '@assets/Authorities/Department_of_the_Interior_and_Local_Government_(DILG)_Seal_-_Logo.svg';
import NBILogo from '@assets/Authorities/National_Bureau_of_Investigation_(NBI).svg';
import PDEALogo from '@assets/Authorities/PDEA_seal.svg';
import PNPLogo from '@assets/Authorities/Philippine_National_Police_seal.svg';
import RedCrossLogo from '@assets/Authorities/Philippine_Red_Cross_Emblem.svg';
import DSWDLogo from '@assets/Authorities/Seal_of_the_Department_of_Social_Welfare_and_Development.svg';

function Home() {
  const recentAlerts = [
    {
      image: Alert1,
      title: "3 sugatan sa banggaan ng 2 motorsiklo sa QC",
      description: "Tatlo ang sugatan sa banggaan ng dalawang motorsiklo sa Quezon City...",
      link: "https://www.abs-cbn.com/news/nation/2025/6/13/tv-patrol-3-sugatan-sa-banggaan-ng-2-motorsiklo-sa-qc-2022"
    },
    {
      image: Alert1,
      title: "Lalaking naaresto sa pagsusugal, nahulihan ng baril nang kapkapan ng pulis",
      description: "Arestado ang 25-anyos na lalaki matapos mahuling nagsusugal...",
      link: "https://www.abs-cbn.com/news/nation/2025/6/13/lalaking-naaresto-sa-pagsusugal-nahulihan-ng-baril-nang-kapkapan-ng-pulis-1252"
    },
    {
      image: Alert1,
      title: "Higit 1 toneladang shabu na nakuha sa dagat galing sa Sam Gor syndicate",
      description: "Ibinunyag ng Philippine Drug Enforcement Agency na konektado...",
      link: "https://www.abs-cbn.com/news/nation/2025/6/11/tv-patrol-higit-1-toneladang-shabu-na-nakuha-sa-dagat-galing-sa-sam-gor-syndicate-pdea-2139"
    }
  ];

  const authorities = [
    { name: 'PNP', logo: PNPLogo },
    { name: 'NBI', logo: NBILogo },
    { name: 'DILG', logo: DILGLogo },
    { name: 'DSWD', logo: DSWDLogo },
    { name: 'Red Cross', logo: RedCrossLogo },
    { name: 'DICT', logo: DICTLogo },
    { name: 'PDEA', logo: PDEALogo }
  ];

  return (
    <div>
      <Hero />

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Report</h3>
                <p className="text-gray-600">
                  Citizens submit anonymous reports through the SafePin platform.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Verify</h3>
                <p className="text-gray-600">
                  Submitted reports are verified by our dedicated team for authenticity.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Inform</h3>
                <p className="text-gray-600">
                  Verified incidents are plotted on the map and alerts are sent to relevant users.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold">4</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Act</h3>
                <p className="text-gray-600">
                  Authorities are notified to take appropriate action based on the reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About SafePin Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="w-32 h-32 bg-green-600 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faShieldAlt} className="h-16 w-16 text-white" />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About SafePin</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                SafePin is a community-driven safety platform designed to bridge the gap
                between citizens and authorities. By enabling anonymous reporting and
                information sharing, we aim to create a safer environment where sensitive
                information reaches the right people while keeping communities informed
                about critical safety concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Statistics />

      {/* Trusted Authorities Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Trusted by Local Authorities & Organizations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center justify-items-center">
            {authorities.map((authority) => (
              <div
                key={authority.name}
                className="w-24 h-24 flex items-center justify-center"
              >
                <img
                  src={authority.logo}
                  alt={`${authority.name} Logo`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Alerts Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Recent Alerts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentAlerts.map((alert, index) => (
              <AlertCard
                key={index}
                image={alert.image}
                title={alert.title}
                description={alert.description}
                link={alert.link}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home; 