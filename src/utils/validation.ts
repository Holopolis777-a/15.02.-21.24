// Phone number validation
export const validatePhoneNumber = (phone: string): boolean => {
  // Allow formats:
  // +49 123 4567890
  // +49123456789
  // 0123 4567890
  // 01234567890
  const phoneRegex = /^(\+49|0)[1-9](\s?\d{2,4}){1,4}$/;
  return phoneRegex.test(phone.trim());
};

// Postal code validation for Germany
export const validatePostalCode = (postalCode: string): boolean => {
  const postalCodeRegex = /^[0-9]{5}$/;
  return postalCodeRegex.test(postalCode.trim());
};

// Company name validation
export const validateCompanyName = (name: string): boolean => {
  return name.trim().length >= 2;
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};