import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../lib/firebase/config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Die Passwörter stimmen nicht überein.');
            return;
        }

        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Add user to Firestore
            await setDoc(doc(db, "customers", user.uid), {
                name: name,
                email: email,
                createdAt: new Date()
            });

            // Send email verification
            await sendEmailVerification(user);

            alert('Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mail für die Bestätigung.');
            form.reset();
        } catch (error) {
            console.error('Error during registration:', error);
            alert('Fehler bei der Registrierung: ' + error.message);
        }
    });
});
