// Validation utilities for registration forms
const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const BRANCH_OPTIONS = [
  'CSE', 'IT', 'AIML', 'AI&DS', 'CET (CSE-IOT)', 'CSM (CSE-AIML)',
  'ECE', 'EEE', 'VLSI', 'Mech', 'Prod', 'Civil', 'Biotech',
  'Chemical', 'MCA', 'MBA', 'Other'
];

const COLLEGE_OPTIONS = ['CBIT', 'Other'];

const YEAR_OPTIONS = ['1', '2', '3', '4'];

const getFirebaseErrorMessage = (error) => {
  const code = error?.code || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please use another email or sign in.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is disabled. Please contact the organizers.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a bit and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact the organizers.';
    case 'permission-denied':
      return 'Registration temporarily unavailable. Please contact administrators or try again later.';
    case 'unavailable':
      return 'Service temporarily unavailable. Please try again in a few minutes.';
    default:
      return error?.message || 'An error occurred during registration. Please try again.';
  }
};

export {
  validatePhone,
  validateEmail,
  validatePassword,
  BRANCH_OPTIONS,
  COLLEGE_OPTIONS,
  YEAR_OPTIONS,
  getFirebaseErrorMessage
};