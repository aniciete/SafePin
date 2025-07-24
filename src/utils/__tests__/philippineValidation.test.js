/**
 * Tests for Philippine validation utilities
 */

import {
  validatePhilippinePhone,
  validatePhilippineAddress,
  validatePhilippineBusinessRegistration,
  validateAndFormatPhilippineTime,
  checkPhilippineBusinessHours,
  validatePhilippineContact
} from '../philippineValidation.js';

describe('Philippine Phone Number Validation', () => {
  describe('validatePhilippinePhone', () => {
    test('validates mobile numbers correctly', () => {
      const validMobile = '+63 917 123 4567';
      const result = validatePhilippinePhone(validMobile, { type: 'mobile' });
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
      expect(result.formatted).toBe('+63 917 123 4567');
    });

    test('validates landline numbers correctly', () => {
      const validLandline = '+63 2 8123 4567';
      const result = validatePhilippinePhone(validLandline, { type: 'landline' });
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
      expect(result.formatted).toBe('+63 2 8123 4567');
    });

    test('validates emergency numbers correctly', () => {
      const emergencyNumber = '911';
      const result = validatePhilippinePhone(emergencyNumber, { type: 'emergency' });
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('rejects invalid mobile numbers', () => {
      const invalidMobile = '+63 817 123 4567'; // Invalid prefix
      const result = validatePhilippinePhone(invalidMobile, { type: 'mobile' });
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid Philippine mobile number format');
    });

    test('rejects invalid landline numbers', () => {
      const invalidLandline = '+63 2 7123 4567'; // Invalid Metro Manila format
      const result = validatePhilippinePhone(invalidLandline, { type: 'landline' });
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid Philippine landline number format');
    });

    test('handles empty input when required', () => {
      const result = validatePhilippinePhone('', { required: true });
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number is required');
    });

    test('handles empty input when not required', () => {
      const result = validatePhilippinePhone('', { required: false });
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('handles null and undefined input', () => {
      const nullResult = validatePhilippinePhone(null, { required: false });
      const undefinedResult = validatePhilippinePhone(undefined, { required: false });
      
      expect(nullResult.isValid).toBe(true);
      expect(undefinedResult.isValid).toBe(true);
    });

    test('validates any type of Philippine number', () => {
      const mobileResult = validatePhilippinePhone('+63 917 123 4567', { type: 'any' });
      const landlineResult = validatePhilippinePhone('+63 2 8123 4567', { type: 'any' });
      const emergencyResult = validatePhilippinePhone('911', { type: 'any' });
      
      expect(mobileResult.isValid).toBe(true);
      expect(landlineResult.isValid).toBe(true);
      expect(emergencyResult.isValid).toBe(true);
    });
  });
});

describe('Philippine Address Validation', () => {
  describe('validatePhilippineAddress', () => {
    const validAddress = {
      houseNumber: '123',
      street: 'Rizal Street',
      barangay: 'San Antonio',
      city: 'Makati City',
      province: 'Metro Manila',
      region: 'National Capital Region (NCR)',
      postalCode: '1200'
    };

    test('validates complete address correctly', () => {
      const result = validatePhilippineAddress(validAddress);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.formatted).toContain('123 Rizal Street');
      expect(result.formatted).toContain('Barangay San Antonio');
      expect(result.formatted).toContain('Makati City');
    });

    test('requires barangay for Philippine addresses', () => {
      const addressWithoutBarangay = { ...validAddress };
      delete addressWithoutBarangay.barangay;
      
      const result = validatePhilippineAddress(addressWithoutBarangay);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Barangay is required for Philippine addresses');
    });

    test('requires city', () => {
      const addressWithoutCity = { ...validAddress };
      delete addressWithoutCity.city;
      
      const result = validatePhilippineAddress(addressWithoutCity);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('City is required');
    });

    test('validates postal code format', () => {
      const addressWithInvalidPostal = { ...validAddress, postalCode: '12345' }; // Too long
      
      const result = validatePhilippineAddress(addressWithInvalidPostal);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Postal code must be 4 digits');
    });

    test('validates region names', () => {
      const addressWithInvalidRegion = { ...validAddress, region: 'Invalid Region' };
      
      const result = validatePhilippineAddress(addressWithInvalidRegion);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid Philippine region');
    });

    test('handles empty address object', () => {
      const result = validatePhilippineAddress({});
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('validates field lengths', () => {
      const addressWithLongFields = {
        ...validAddress,
        houseNumber: 'A'.repeat(25), // Too long
        street: 'B'.repeat(105), // Too long
        barangay: 'C'.repeat(55) // Too long
      };
      
      const result = validatePhilippineAddress(addressWithLongFields);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('House number must not exceed 20 characters');
      expect(result.errors).toContain('Street name must not exceed 100 characters');
      expect(result.errors).toContain('Barangay name must not exceed 50 characters');
    });
  });
});

describe('Philippine Business Registration Validation', () => {
  describe('validatePhilippineBusinessRegistration', () => {
    test('validates SEC registration correctly', () => {
      const validSEC = 'CS123456789';
      const result = validatePhilippineBusinessRegistration(validSEC, 'sec');
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
      expect(result.type).toBe('sec');
    });

    test('validates DTI permit correctly', () => {
      const validDTI = 'DTI-NCR-2024-123456';
      const result = validatePhilippineBusinessRegistration(validDTI, 'dti');
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('validates BIR TIN correctly', () => {
      const validBIR = '123-456-789-000';
      const result = validatePhilippineBusinessRegistration(validBIR, 'bir');
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('validates SSS number correctly', () => {
      const validSSS = '12-1234567-1';
      const result = validatePhilippineBusinessRegistration(validSSS, 'sss');
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('validates PhilHealth number correctly', () => {
      const validPhilHealth = '12-123456789-1';
      const result = validatePhilippineBusinessRegistration(validPhilHealth, 'philhealth');
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('validates Pag-IBIG number correctly', () => {
      const validPagIbig = '1234-1234-1234';
      const result = validatePhilippineBusinessRegistration(validPagIbig, 'pagibig');
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('rejects invalid SEC format', () => {
      const invalidSEC = 'CS12345678'; // Too short
      const result = validatePhilippineBusinessRegistration(invalidSEC, 'sec');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('SEC registration must follow format: CS123456789');
    });

    test('rejects invalid DTI format', () => {
      const invalidDTI = 'DTI-NCR-24-123456'; // Wrong year format
      const result = validatePhilippineBusinessRegistration(invalidDTI, 'dti');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('DTI permit must follow format: DTI-NCR-2024-123456');
    });

    test('rejects invalid BIR format', () => {
      const invalidBIR = '123-456-789'; // Missing last part
      const result = validatePhilippineBusinessRegistration(invalidBIR, 'bir');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('BIR TIN must follow format: 123-456-789-000');
    });

    test('handles invalid registration type', () => {
      const result = validatePhilippineBusinessRegistration('123456789', 'invalid');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid registration type');
    });

    test('handles empty input when required', () => {
      const result = validatePhilippineBusinessRegistration('', 'sec', { required: true });
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('SEC registration number is required');
    });

    test('handles empty input when not required', () => {
      const result = validatePhilippineBusinessRegistration('', 'sec', { required: false });
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });
});

describe('Philippine Time Validation and Formatting', () => {
  describe('validateAndFormatPhilippineTime', () => {
    test('validates and formats valid date', () => {
      const testDate = new Date('2024-01-15T10:30:00Z');
      const result = validateAndFormatPhilippineTime(testDate);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
      expect(result.value).toEqual(testDate);
      expect(result.timezone).toBe('PST');
      expect(result.formatted).toBeTruthy();
    });

    test('validates and formats date string', () => {
      const dateString = '2024-01-15T10:30:00Z';
      const result = validateAndFormatPhilippineTime(dateString);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
      expect(result.formatted).toBeTruthy();
    });

    test('formats date only', () => {
      const testDate = new Date('2024-01-15T10:30:00Z');
      const result = validateAndFormatPhilippineTime(testDate, { format: 'date' });
      
      expect(result.isValid).toBe(true);
      expect(result.formatted).toContain('January');
      expect(result.formatted).toContain('15');
      expect(result.formatted).toContain('2024');
    });

    test('formats time only', () => {
      const testDate = new Date('2024-01-15T10:30:00Z');
      const result = validateAndFormatPhilippineTime(testDate, { format: 'time' });
      
      expect(result.isValid).toBe(true);
      expect(result.formatted).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/);
    });

    test('rejects invalid date string', () => {
      const invalidDate = 'invalid-date';
      const result = validateAndFormatPhilippineTime(invalidDate);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid date format');
    });

    test('handles null input when required', () => {
      const result = validateAndFormatPhilippineTime(null, { required: true });
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Date is required');
    });

    test('handles null input when not required', () => {
      const result = validateAndFormatPhilippineTime(null, { required: false });
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('checkPhilippineBusinessHours', () => {
    test('identifies business hours correctly', () => {
      // Create a date for Tuesday 2PM Manila time
      const businessHourDate = new Date('2024-01-16T06:00:00Z'); // 2PM Manila time
      const result = checkPhilippineBusinessHours(businessHourDate);
      
      expect(result.isBusinessHours).toBe(true);
      expect(result.currentTime).toBeTruthy();
    });

    test('identifies non-business hours correctly', () => {
      // Create a date for Sunday 2PM Manila time
      const nonBusinessHourDate = new Date('2024-01-14T06:00:00Z'); // Sunday 2PM Manila time
      const result = checkPhilippineBusinessHours(nonBusinessHourDate);
      
      expect(result.isBusinessHours).toBe(false);
      expect(result.nextBusinessHour).toContain('Monday');
    });

    test('provides next business hour information', () => {
      // Create a date for Saturday 3PM Manila time (after business hours)
      const afterHoursDate = new Date('2024-01-13T07:00:00Z'); // Saturday 3PM Manila time
      const result = checkPhilippineBusinessHours(afterHoursDate);
      
      expect(result.isBusinessHours).toBe(false);
      expect(result.nextBusinessHour).toContain('Monday');
    });
  });
});

describe('Comprehensive Philippine Contact Validation', () => {
  describe('validatePhilippineContact', () => {
    const validContactData = {
      phone: '+63 917 123 4567',
      address: {
        street: 'Rizal Street',
        barangay: 'San Antonio',
        city: 'Makati City',
        postalCode: '1200'
      },
      businessRegistration: {
        sec: 'CS123456789',
        dti: 'DTI-NCR-2024-123456',
        bir: '123-456-789-000'
      }
    };

    test('validates complete contact data correctly', () => {
      const result = validatePhilippineContact(validContactData);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.data.phone).toBeTruthy();
      expect(result.data.address).toBeTruthy();
      expect(result.data.businessRegistration).toBeTruthy();
    });

    test('handles invalid phone number', () => {
      const invalidContactData = {
        ...validContactData,
        phone: 'invalid-phone'
      };
      
      const result = validatePhilippineContact(invalidContactData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Invalid Philippine phone number format');
    });

    test('handles invalid address', () => {
      const invalidContactData = {
        ...validContactData,
        address: {
          street: 'Rizal Street'
          // Missing required barangay and city
        }
      };
      
      const result = validatePhilippineContact(invalidContactData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('handles invalid business registration', () => {
      const invalidContactData = {
        ...validContactData,
        businessRegistration: {
          sec: 'invalid-sec',
          dti: 'invalid-dti'
        }
      };
      
      const result = validatePhilippineContact(invalidContactData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('handles empty contact data', () => {
      const result = validatePhilippineContact({});
      
      expect(result.isValid).toBe(true); // Empty data is valid since fields are optional
      expect(result.errors).toHaveLength(0);
    });

    test('handles null and undefined input', () => {
      const nullResult = validatePhilippineContact(null);
      const undefinedResult = validatePhilippineContact(undefined);
      
      expect(nullResult.isValid).toBe(true);
      expect(undefinedResult.isValid).toBe(true);
    });
  });
});