import React from 'react';

// Import logos
import dictLogo from '../../assets/authorities/Department_of_Information_and_Communications_Technology_(DICT).svg';
import dilgLogo from '../../assets/authorities/Department_of_the_Interior_and_Local_Government_(DILG)_Seal_-_Logo.svg';
import nbiLogo from '../../assets/authorities/National_Bureau_of_Investigation_(NBI).svg';
import pdeaLogo from '../../assets/authorities/PDEA_seal.svg';
import pnpLogo from '../../assets/authorities/Philippine_National_Police_seal.svg';
import redCrossLogo from '../../assets/authorities/Philippine_Red_Cross_Emblem.svg';
import dswdLogo from '../../assets/authorities/Seal_of_the_Department_of_Social_Welfare_and_Development.svg';

const authorities = [
  { name: 'DICT', logo: dictLogo },
  { name: 'DILG', logo: dilgLogo },
  { name: 'NBI', logo: nbiLogo },
  { name: 'PDEA', logo: pdeaLogo },
  { name: 'PNP', logo: pnpLogo },
  { name: 'Philippine Red Cross', logo: redCrossLogo },
  { name: 'DSWD', logo: dswdLogo },
];

const TrustedBySection = () => {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by Local Authorities & Organizations
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-7">
          {authorities.map((authority) => (
            <div key={authority.name} className="flex items-center justify-center">
              <img
                className="h-16 w-auto"
                src={authority.logo}
                alt={authority.name}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;