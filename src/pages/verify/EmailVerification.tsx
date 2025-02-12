import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, updateDoc, doc, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

const EmailVerification: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const email = params.get('email');
      if (!email) {
        console.error('No email provided in URL');
        setStatus('error');
        return;
      }

      try {
        console.log('Querying customer with email:', email);
        // Add limit(1) to match Firestore rules
        const q = query(
          collection(db, 'customers'), 
          where('email', '==', email),
          limit(1)
        );
        
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          console.error('No customer found with email:', email);
          setStatus('error');
          return;
        }

        const customerDoc = querySnapshot.docs[0];
        const customerRef = doc(db, 'customers', customerDoc.id);

        console.log('Updating emailVerified field for customer:', customerDoc.id);
        // Only update the emailVerified field
        const updateData = {
          emailVerified: true
        };
        
        await updateDoc(customerRef, updateData);
        console.log('Email verification successful');
        setStatus('success');
      } catch (error) {
        console.error('Error verifying email:', error);
        // Log detailed error information
        if (error instanceof Error) {
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
          });
        }
        setStatus('error');
      }
    };

    verifyEmail();
  }, [location.search]);

  const handleRedirect = () => {
    navigate('/login');
  };

  if (status === 'loading') {
    return <div className="max-w-md mx-auto mt-10 text-center">Verifying your email, please wait...</div>;
  }

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto mt-10 text-center">
        <h1 className="text-2xl font-bold mb-5">E-Mail erfolgreich bestätigt!</h1>
        <p className="mb-5">Ihre E-Mail-Adresse wurde erfolgreich bestätigt. Sie können sich nun im Customer Portal anmelden.</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleRedirect}
        >
          Zur Anmeldung
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 text-center">
      <h1 className="text-2xl font-bold mb-5">Fehler bei der E-Mail-Bestätigung</h1>
      <p className="mb-5">Es gab ein Problem bei der Bestätigung Ihrer E-Mail-Adresse. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.</p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleRedirect}
      >
        Zur Anmeldung
      </button>
    </div>
  );
};

export default EmailVerification;
