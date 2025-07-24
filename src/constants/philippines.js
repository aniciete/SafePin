/**
 * Philippine Localization Constants
 * 
 * This file contains essential Philippine-specific constants including:
 * - Government agency information
 */

// Import government agency logos
import pnpLogo from '../assets/authorities/Philippine_National_Police_seal.svg';
import nbiLogo from '../assets/authorities/National_Bureau_of_Investigation_(NBI).svg';
import dilgLogo from '../assets/authorities/Department_of_the_Interior_and_Local_Government_(DILG)_Seal_-_Logo.svg';
import dictLogo from '../assets/authorities/Department_of_Information_and_Communications_Technology_(DICT).svg';
import dswdLogo from '../assets/authorities/Seal_of_the_Department_of_Social_Welfare_and_Development.svg';
import prcLogo from '../assets/authorities/Philippine_Red_Cross_Emblem.svg';
import pdeaLogo from '../assets/authorities/PDEA_seal.svg';

// Philippine Government Agencies
export const PHILIPPINE_GOVERNMENT_AGENCIES = {
  lawEnforcement: [
    {
      name: "Philippine National Police",
      acronym: "PNP",
      logo: pnpLogo,
      website: "https://pnp.gov.ph",
    },
    {
      name: "National Bureau of Investigation",
      acronym: "NBI",
      logo: nbiLogo,
      website: "https://nbi.gov.ph",
    }
  ],
  
  government: [
    {
      name: "Department of the Interior and Local Government",
      acronym: "DILG",
      logo: dilgLogo,
      website: "https://dilg.gov.ph",
    },
    {
      name: "Department of Information and Communications Technology",
      acronym: "DICT",
      logo: dictLogo,
      website: "https://dict.gov.ph",
    }
  ],
  
  emergency: [
    {
      name: "Philippine Red Cross",
      acronym: "PRC",
      logo: prcLogo,
      website: "https://redcross.org.ph",
    },
    {
      name: "Department of Social Welfare and Development",
      acronym: "DSWD",
      logo: dswdLogo,
      website: "https://dswd.gov.ph",
    }
  ],
  
  drugEnforcement: [
    {
      name: "Philippine Drug Enforcement Agency",
      acronym: "PDEA",
      logo: pdeaLogo,
      website: "https://pdea.gov.ph",
    }
  ]
};

// Helper function to get all government agencies in a flat array
export const getAllPhilippineAgencies = () => {
  return Object.values(PHILIPPINE_GOVERNMENT_AGENCIES).flat();
};

// Helper function to find agency by acronym
export const findAgencyByAcronym = (acronym) => {
  return getAllPhilippineAgencies().find(agency => agency.acronym === acronym);
};

export default {
  PHILIPPINE_GOVERNMENT_AGENCIES,
  getAllPhilippineAgencies,
  findAgencyByAcronym
};