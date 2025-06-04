/**
 * Validation utility functions
 */

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password
 * @param {string} password - The password to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return {
      isValid: false,
      message: 'Password is required',
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long',
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter',
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter',
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number',
    };
  }

  return {
    isValid: true,
    message: 'Password is valid',
  };
};

/**
 * Validates a receipt amount
 * @param {number} amount - The amount to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validateReceiptAmount = (amount) => {
  if (!amount && amount !== 0) {
    return {
      isValid: false,
      message: 'Amount is required',
    };
  }

  if (typeof amount !== 'number') {
    return {
      isValid: false,
      message: 'Amount must be a number',
    };
  }

  if (amount < 0) {
    return {
      isValid: false,
      message: 'Amount cannot be negative',
    };
  }

  return {
    isValid: true,
    message: 'Amount is valid',
  };
};

/**
 * Validates a reward points cost
 * @param {number} points - The points to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validateRewardPoints = (points) => {
  if (!points && points !== 0) {
    return {
      isValid: false,
      message: 'Points are required',
    };
  }

  if (typeof points !== 'number') {
    return {
      isValid: false,
      message: 'Points must be a number',
    };
  }

  if (points < 0) {
    return {
      isValid: false,
      message: 'Points cannot be negative',
    };
  }

  if (!Number.isInteger(points)) {
    return {
      isValid: false,
      message: 'Points must be a whole number',
    };
  }

  return {
    isValid: true,
    message: 'Points are valid',
  };
}; 