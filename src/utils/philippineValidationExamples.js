/**
 * Examples and usage demonstrations for Philippine validation utilities
 * This file shows how to use the Philippine-specific validation functions
 * @module philippineValidationExamples
 */

import {
  validatePhilippinePhone,
  validatePhilippineAddress,
  validatePhilippineBusinessRegistration,
  validateAndFormatPhilippineTime,
  checkPhilippineBusinessHours,
  validatePhilippineContact
} from './philippineValidation.js';

/**
 * Phone Number Validation Examples
 */
export const phoneValidationExamples = () => {
  console.log('=== Philippine Phone Number Validation Examples ===\n');

  // Mobile number validation
  const mobileNumbers = [
    '+63 917 123 4567',
    '0917-123-4567',
    '+63 905 123 4567',
    'invalid-mobile'
  ];

  console.log('Mobile Numbers:');
  mobileNumbers.forEach(number => {
    const result = validatePhilippinePhone(number, { type: 'mobile' });
    console.log(`${number}: ${result.isValid ? '✓' : '✗'} ${result.formatted || result.error}`);
  });

  // Landline number validation
  const landlineNumbers = [
    '+63 2 8123 4567',
    '(02) 8123-4567',
    '+63 32 123 4567',
    'invalid-landline'
  ];

  console.log('\nLandline Numbers:');
  landlineNumbers.forEach(number => {
    const result = validatePhilippinePhone(number, { type: 'landline' });
    console.log(`${number}: ${result.isValid ? '✓' : '✗'} ${result.formatted || result.error}`);
  });

  // Emergency numbers
  const emergencyNumbers = ['911', '8888', '117', '143', '116', '999'];

  console.log('\nEmergency Numbers:');
  emergencyNumbers.forEach(number => {
    const result = validatePhilippinePhone(number, { type: 'emergency' });
    console.log(`${number}: ${result.isValid ? '✓' : '✗'} ${result.error || 'Valid'}`);
  });
};

/**
 * Address Validation Examples
 */
export const addressValidationExamples = () => {
  console.log('\n=== Philippine Address Validation Examples ===\n');

  // Valid address
  const validAddress = {
    houseNumber: '123',
    street: 'Rizal Street',
    barangay: 'San Antonio',
    city: 'Makati City',
    province: 'Metro Manila',
    region: 'National Capital Region (NCR)',
    postalCode: '1200'
  };

  console.log('Valid Address:');
  const validResult = validatePhilippineAddress(validAddress);
  console.log(`Valid: ${validResult.isValid ? '✓' : '✗'}`);
  if (validResult.isValid) {
    console.log(`Formatted: ${validResult.formatted}`);
  } else {
    console.log(`Errors: ${validResult.errors.join(', ')}`);
  }

  // Invalid address (missing required fields)
  const invalidAddress = {
    street: 'Rizal Street',
    city: 'Makati City'
    // Missing barangay (required)
  };

  console.log('\nInvalid Address (missing barangay):');
  const invalidResult = validatePhilippineAddress(invalidAddress);
  console.log(`Valid: ${invalidResult.isValid ? '✓' : '✗'}`);
  console.log(`Errors: ${invalidResult.errors.join(', ')}`);

  // Address with invalid postal code
  const invalidPostalAddress = {
    ...validAddress,
    postalCode: '12345' // Should be 4 digits
  };

  console.log('\nAddress with invalid postal code:');
  const postalResult = validatePhilippineAddress(invalidPostalAddress);
  console.log(`Valid: ${postalResult.isValid ? '✓' : '✗'}`);
  console.log(`Errors: ${postalResult.errors.join(', ')}`);
};

/**
 * Business Registration Validation Examples
 */
export const businessRegistrationExamples = () => {
  console.log('\n=== Philippine Business Registration Validation Examples ===\n');

  const registrations = [
    { type: 'sec', value: 'CS123456789', description: 'SEC Registration' },
    { type: 'dti', value: 'DTI-NCR-2024-123456', description: 'DTI Permit' },
    { type: 'bir', value: '123-456-789-000', description: 'BIR TIN' },
    { type: 'sss', value: '12-1234567-1', description: 'SSS Number' },
    { type: 'philhealth', value: '12-123456789-1', description: 'PhilHealth Number' },
    { type: 'pagibig', value: '1234-1234-1234', description: 'Pag-IBIG Number' },
    { type: 'sec', value: 'CS12345678', description: 'Invalid SEC (too short)' },
    { type: 'bir', value: '123-456-789', description: 'Invalid BIR (missing part)' }
  ];

  registrations.forEach(reg => {
    const result = validatePhilippineBusinessRegistration(reg.value, reg.type);
    console.log(`${reg.description}: ${result.isValid ? '✓' : '✗'} ${reg.value}`);
    if (!result.isValid) {
      console.log(`  Error: ${result.error}`);
    }
  });
};

/**
 * Time Validation and Formatting Examples
 */
export const timeValidationExamples = () => {
  console.log('\n=== Philippine Time Validation and Formatting Examples ===\n');

  const dates = [
    new Date(),
    '2024-01-15T10:30:00Z',
    '2024-12-25T00:00:00Z',
    'invalid-date'
  ];

  dates.forEach((date, index) => {
    console.log(`\nDate ${index + 1}: ${date}`);
    
    // Full format
    const fullResult = validateAndFormatPhilippineTime(date, { format: 'full' });
    console.log(`  Full format: ${fullResult.isValid ? '✓' : '✗'} ${fullResult.formatted || fullResult.error}`);
    
    // Date only
    if (fullResult.isValid) {
      const dateResult = validateAndFormatPhilippineTime(date, { format: 'date' });
      console.log(`  Date only: ${dateResult.formatted}`);
      
      // Time only
      const timeResult = validateAndFormatPhilippineTime(date, { format: 'time' });
      console.log(`  Time only: ${timeResult.formatted}`);
    }
  });

  // Business hours check
  console.log('\n--- Business Hours Check ---');
  const businessHoursResult = checkPhilippineBusinessHours();
  console.log(`Current time: ${businessHoursResult.currentTime}`);
  console.log(`Is business hours: ${businessHoursResult.isBusinessHours ? 'Yes' : 'No'}`);
  if (!businessHoursResult.isBusinessHours && businessHoursResult.nextBusinessHour) {
    console.log(`Next business hour: ${businessHoursResult.nextBusinessHour}`);
  }
};

/**
 * Comprehensive Contact Validation Examples
 */
export const contactValidationExamples = () => {
  console.log('\n=== Comprehensive Philippine Contact Validation Examples ===\n');

  // Valid contact data
  const validContact = {
    phone: '+63 917 123 4567',
    address: {
      houseNumber: '123',
      street: 'Rizal Street',
      barangay: 'San Antonio',
      city: 'Makati City',
      province: 'Metro Manila',
      region: 'National Capital Region (NCR)',
      postalCode: '1200'
    },
    businessRegistration: {
      sec: 'CS123456789',
      dti: 'DTI-NCR-2024-123456',
      bir: '123-456-789-000'
    }
  };

  console.log('Valid Contact Data:');
  const validResult = validatePhilippineContact(validContact);
  console.log(`Valid: ${validResult.isValid ? '✓' : '✗'}`);
  if (validResult.isValid) {
    console.log('Validated Data:');
    console.log(`  Phone: ${validResult.data.phone}`);
    console.log(`  Address: ${validResult.data.formattedAddress}`);
    console.log(`  Business Registrations: ${Object.keys(validResult.data.businessRegistration || {}).join(', ')}`);
  }

  // Invalid contact data
  const invalidContact = {
    phone: 'invalid-phone',
    address: {
      street: 'Rizal Street'
      // Missing required fields
    },
    businessRegistration: {
      sec: 'invalid-sec',
      bir: 'invalid-bir'
    }
  };

  console.log('\nInvalid Contact Data:');
  const invalidResult = validatePhilippineContact(invalidContact);
  console.log(`Valid: ${invalidResult.isValid ? '✓' : '✗'}`);
  if (!invalidResult.isValid) {
    console.log('Errors:');
    invalidResult.errors.forEach(error => console.log(`  - ${error}`));
  }
};

/**
 * Run all examples
 */
export const runAllExamples = () => {
  phoneValidationExamples();
  addressValidationExamples();
  businessRegistrationExamples();
  timeValidationExamples();
  contactValidationExamples();
};

// Export individual example functions
export default {
  phoneValidationExamples,
  addressValidationExamples,
  businessRegistrationExamples,
  timeValidationExamples,
  contactValidationExamples,
  runAllExamples
};