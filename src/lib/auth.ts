import { 
  signIn as firebaseSignIn,
  signUp as firebaseSignUp,
  signOut as firebaseSignOut,
  resetPassword as firebaseResetPassword,
  getCurrentUser as firebaseGetCurrentUser
} from './firebase/auth';

export const signIn = firebaseSignIn;
export const signUp = firebaseSignUp;
export const signOut = firebaseSignOut;
export const resetPassword = firebaseResetPassword;
export const getCurrentUser = firebaseGetCurrentUser;