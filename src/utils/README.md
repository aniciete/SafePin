# Philippine Validation Utilities

This directory contains comprehensive validation utilities specifically designed for Philippine data formats and requirements.

## Files

### `philippineValidation.js`
Main validation utilities for Philippine-specific data formats:
- Phone number validation (mobile, landline, emergency)
- Address validation with Philippine format requirements
- Business registration number validation (SEC, DTI, BIR, SSS, PhilHealth, Pag-IBIG)
- Philippine Standard Time formatting and validation
- Comprehensive contact validation

### `validation.js`
Enhanced main validation module that includes Philippine-specific validations alongside general validation utilities.

### `philippineValidationExamples.js`
Comprehensive examples and usage demonstrations for all Philippine validation functions.

## Usage Examples

### Phone Number Validation

```javascript
import { validatePhilippinePhone } from './philippineValidation.js';

// Validate mobile number
const mobileResult = validatePhilippinePhone('+63 917 123 4567', { type: 'mobile' });
console.log(mobileResult.isValid); // true
console.log(mobileResult.formatted); // '+63 917 123 4567'

// Validate landline number
const landlineResult = validatePhilippinePhone('+63 2 8123 4567', { type: 'landline' });
console.log(landlineResult.isValid); // true

// Validate emergency number
const emergencyResult = validatePhilippinePhone('911', { type: 'emergency' });
console.log(emergencyResult.isValid); // true
```

### Address Validation

```javascript
import { validatePhilippineAddress } from './philippineValidation.js';

const addressData = {
  houseNumber: '123',
  street: 'Rizal Street',
  barangay: 'San Antonio',
  city: 'Makati City',
  province: 'Metro Manila',
  region: 'National Capital Region (NCR)',
  postalCode: '1200'
};

const result = validatePhilippineAddress(addressData);
console.log(result.isValid); // true
console.log(result.formatted); // '123 Rizal Street, Barangay San Antonio, Makati City, Metro Manila, 1200, National Capital Region (NCR), Philippines'
```

### Business Registration Validation

```javascript
import { validatePhilippineBusinessRegistration } from './philippineValidation.js';

// Validate SEC registration
const secResult = validatePhilippineBusinessRegistration('CS123456789', 'sec');
console.log(secResult.isValid); // true

// Validate DTI permit
const dtiResult = validatePhilippineBusinessRegistration('DTI-NCR-2024-123456', 'dti');
console.log(dtiResult.isValid); // true

// Validate BIR TIN
const birResult = validatePhilippineBusinessRegistration('123-456-789-000', 'bir');
console.log(birResult.isValid); // true
```

### Time Validation and Formatting

```javascript
import { validateAndFormatPhilippineTime, checkPhilippineBusinessHours } from './philippineValidation.js';

// Format current time in Philippine Standard Time
const timeResult = validateAndFormatPhilippineTime(new Date());
console.log(timeResult.formatted); // 'January 15, 2024 at 2:30:45 PM PST'

// Check if current time is within business hours
const businessHours = checkPhilippineBusinessHours();
console.log(businessHours.isBusinessHours); // true/false
console.log(businessHours.currentTime); // '2:30 PM'
console.log(businessHours.nextBusinessHour); // '9:00 AM Monday' (if outside business hours)
```

### Comprehensive Contact Validation

```javascript
import { validatePhilippineContact } from './philippineValidation.js';

const contactData = {
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

const result = validatePhilippineContact(contactData);
console.log(result.isValid); // true
console.log(result.data.phone); // '+63 917 123 4567'
console.log(result.data.formattedAddress); // Complete formatted address
```

## Integration with Main Validation Module

The main `validation.js` module now includes Philippine-specific validation functions:

```javascript
import { 
  validatePhoneNumber, 
  validateAddress, 
  validateBusinessRegistration,
  validateDateTime,
  validateContactInfo
} from './validation.js';

// These functions are wrappers around the Philippine-specific validators
const phoneResult = validatePhoneNumber('+63 917 123 4567');
const addressResult = validateAddress(addressData);
const businessResult = validateBusinessRegistration('CS123456789', 'sec');
```

## Testing

All validation utilities are thoroughly tested. Run tests with:

```bash
# Test Philippine validation utilities
npm test -- src/utils/__tests__/philippineValidation.test.js --run

# Test Philippine constants
npm test -- src/constants/__tests__/philippines.test.js --run
```

## Features

### Phone Number Validation
- Supports mobile numbers (Globe, Smart, Sun networks)
- Supports Metro Manila and provincial landlines
- Supports emergency numbers (911, 8888, 117, etc.)
- Automatic formatting to standard Philippine format
- Type-specific validation (mobile, landline, emergency, any)

### Address Validation
- Validates all Philippine address components
- Requires barangay (mandatory in Philippines)
- Validates postal codes (4-digit format)
- Validates against official Philippine regions
- Formats addresses according to Philippine standards

### Business Registration Validation
- SEC (Securities and Exchange Commission) registration
- DTI (Department of Trade and Industry) permit
- BIR (Bureau of Internal Revenue) TIN
- SSS (Social Security System) number
- PhilHealth number
- Pag-IBIG number

### Time Utilities
- Philippine Standard Time (PST) formatting
- Business hours checking (Mon-Fri 9AM-6PM, Sat 9AM-1PM)
- Multiple format options (full, date only, time only)
- Timezone-aware date validation

### Error Handling
- Comprehensive error messages
- Graceful handling of null/undefined inputs
- Detailed validation feedback
- Support for optional vs required fields

## Requirements Compliance

This implementation satisfies the following requirements from the Philippines localization spec:

- **4.2**: Philippine phone number validation and formatting
- **4.3**: Philippine address format validation  
- **5.4**: Philippine Standard Time formatting utilities
- Business registration number validation for Philippine compliance

All utilities follow Philippine government standards and regulations for data formats and validation.