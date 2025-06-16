/**
 * Validate an email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate a password
 * Must be at least 8 characters long and contain at least one number and one letter
 */
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate a phone number
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phoneNumber);
};

/**
 * Validate a URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate a date string
 */
export const isValidDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

/**
 * Validate a number is within a range
 */
export const isNumberInRange = (num: number, min: number, max: number): boolean => {
  return num >= min && num <= max;
};

/**
 * Validate a string length is within a range
 */
export const isStringLengthInRange = (str: string, min: number, max: number): boolean => {
  return str.length >= min && str.length <= max;
};

/**
 * Validate a file size is within a range (in bytes)
 */
export const isFileSizeInRange = (size: number, min: number, max: number): boolean => {
  return size >= min && size <= max;
};

/**
 * Validate a file type
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Validate a credit card number
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');

  // Check if it's a number and has a valid length
  if (!/^\d+$/.test(cleaned) || cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i));

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

/**
 * Validate a postal code
 */
export const isValidPostalCode = (postalCode: string): boolean => {
  // This regex matches both US and Canadian postal codes
  const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
  return postalCodeRegex.test(postalCode);
};

/**
 * Validate a social security number
 */
export const isValidSSN = (ssn: string): boolean => {
  const ssnRegex = /^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$/;
  return ssnRegex.test(ssn);
};
