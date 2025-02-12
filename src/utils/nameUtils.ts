/**
 * Safely splits a full name into first and last name components
 */
export const splitFullName = (fullName: string | undefined | null) => {
  if (!fullName?.trim()) {
    return {
      firstName: '',
      lastName: ''
    };
  }

  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || ''
  };
};