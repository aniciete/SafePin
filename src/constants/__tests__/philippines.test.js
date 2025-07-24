import {
  PHILIPPINE_BUSINESS_INFO,
  PHILIPPINE_EMERGENCY_CONTACTS,
  PHILIPPINE_GOVERNMENT_AGENCIES,
  PHILIPPINE_PHONE_PATTERNS,
  PHILIPPINE_TIME,
  formatPhilippinePhone,
  validatePhilippinePhone,
  formatPhilippineTime,
  isPhilippineBusinessHours,
  validateBusinessRegistration,
  formatPhilippinePeso
} from '../philippines.js';

describe('Philippine Constants', () => {
  describe('PHILIPPINE_BUSINESS_INFO', () => {
    test('should contain complete business address', () => {
      expect(PHILIPPINE_BUSINESS_INFO.address.street).toBe("Unit 2501, 25th Floor, Robinsons Equitable Tower");
      expect(PHILIPPINE_BUSINESS_INFO.address.city).toBe("Pasig City");
      expect(PHILIPPINE_BUSINESS_INFO.address.region).toBe("Metro Manila");
      expect(PHILIPPINE_BUSINESS_INFO.address.postalCode).toBe("1605");
      expect(PHILIPPINE_BUSINESS_INFO.address.country).toBe("Philippines");
    });

    test('should contain Philippine phone numbers', () => {
      expect(PHILIPPINE_BUSINESS_INFO.phoneNumbers.main).toBe("+63 2 8123 4567");
      expect(PHILIPPINE_BUSINESS_INFO.phoneNumbers.support).toBe("+63 2 8123 4568");
    });

    test('should contain business registration info', () => {
      expect(PHILIPPINE_BUSINESS_INFO.businessRegistration.secRegistration).toBe("CS201234567");
      expect(PHILIPPINE_BUSINESS_INFO.businessRegistration.dtiPermit).toBe("DTI-NCR-2024-001234");
      expect(PHILIPPINE_BUSINESS_INFO.businessRegistration.birTin).toBe("123-456-789-000");
    });
  });

  describe('PHILIPPINE_EMERGENCY_CONTACTS', () => {
    test('should contain national emergency numbers', () => {
      expect(PHILIPPINE_EMERGENCY_CONTACTS.national.emergency).toBe("911");
      expect(PHILIPPINE_EMERGENCY_CONTACTS.national.hotline).toBe("8888");
    });

    test('should contain police numbers', () => {
      expect(PHILIPPINE_EMERGENCY_CONTACTS.police.pnp).toBe("117");
    });

    test('should contain medical emergency numbers', () => {
      expect(PHILIPPINE_EMERGENCY_CONTACTS.medical.redCross).toBe("143");
    });
  });

  describe('PHILIPPINE_GOVERNMENT_AGENCIES', () => {
    test('should contain law enforcement agencies', () => {
      const pnp = PHILIPPINE_GOVERNMENT_AGENCIES.lawEnforcement.find(agency => agency.acronym === 'PNP');
      expect(pnp.name).toBe("Philippine National Police");
      expect(pnp.hotline).toBe("117");
    });

    test('should contain government departments', () => {
      const dilg = PHILIPPINE_GOVERNMENT_AGENCIES.government.find(agency => agency.acronym === 'DILG');
      expect(dilg.name).toBe("Department of the Interior and Local Government");
    });
  });

  describe('Phone Number Validation', () => {
    test('should validate Philippine mobile numbers', () => {
      expect(validatePhilippinePhone('+63 917 123 4567')).toBe(true);
      expect(validatePhilippinePhone('0917-123-4567')).toBe(true);
      expect(validatePhilippinePhone('invalid-number')).toBe(false);
    });

    test('should validate emergency numbers', () => {
      expect(validatePhilippinePhone('911')).toBe(true);
      expect(validatePhilippinePhone('8888')).toBe(true);
      expect(validatePhilippinePhone('117')).toBe(true);
    });

    test('should format Philippine phone numbers', () => {
      expect(formatPhilippinePhone('+639171234567')).toBe('+63 917 123 4567');
      expect(formatPhilippinePhone('09171234567')).toBe('+63 917 123 4567');
      expect(formatPhilippinePhone('+6328123456')).toBe('+63 2 8123 456');
    });
  });

  describe('Time Utilities', () => {
    test('should have correct timezone info', () => {
      expect(PHILIPPINE_TIME.timezone).toBe("Asia/Manila");
      expect(PHILIPPINE_TIME.abbreviation).toBe("PST");
      expect(PHILIPPINE_TIME.utcOffset).toBe("+08:00");
    });

    test('should format Philippine time', () => {
      const testDate = new Date('2024-01-15T10:30:00Z');
      const formatted = formatPhilippineTime(testDate);
      expect(formatted).toContain('2024');
      expect(formatted).toContain('January');
    });

    test('should check business hours correctly', () => {
      // Create a Monday at 10 AM Philippine time
      const mondayMorning = new Date('2024-01-15T02:00:00Z'); // 10 AM PST
      expect(isPhilippineBusinessHours(mondayMorning)).toBe(true);

      // Create a Sunday
      const sunday = new Date('2024-01-14T02:00:00Z');
      expect(isPhilippineBusinessHours(sunday)).toBe(false);
    });
  });

  describe('Business Registration Validation', () => {
    test('should validate SEC registration', () => {
      expect(validateBusinessRegistration('sec', 'CS201234567')).toBe(true);
      expect(validateBusinessRegistration('sec', 'invalid')).toBe(false);
    });

    test('should validate DTI permit', () => {
      expect(validateBusinessRegistration('dti', 'DTI-NCR-2024-001234')).toBe(true);
      expect(validateBusinessRegistration('dti', 'invalid')).toBe(false);
    });

    test('should validate BIR TIN', () => {
      expect(validateBusinessRegistration('bir', '123-456-789-000')).toBe(true);
      expect(validateBusinessRegistration('bir', 'invalid')).toBe(false);
    });
  });

  describe('Currency Formatting', () => {
    test('should format Philippine Peso correctly', () => {
      expect(formatPhilippinePeso(1000)).toBe('₱1,000.00');
      expect(formatPhilippinePeso(1234.56)).toBe('₱1,234.56');
    });
  });
});