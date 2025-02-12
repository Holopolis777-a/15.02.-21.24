const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

// Initialize Firebase with the correct config
const firebaseConfig = {
  apiKey: "AIzaSyA8fH-_F04uEV8yt6nAxvWvTl9BMLkjmNo",
  authDomain: "vilocar1.firebaseapp.com",
  projectId: "vilocar1",
  storageBucket: "vilocar1.appspot.com",
  messagingSenderId: "955089184423",
  appId: "1:955089184423:web:71b711504b36ba5c691d82",
  measurementId: "G-SWR3CKVKXK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixEmployeeRoles() {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);

    console.log('Checking all users...');
    
    for (const userDoc of snapshot.docs) {
      const userData = userDoc.data();
      
      // Print info for all users to debug
      console.log(`User ${userData.email}:`, {
        id: userDoc.id,
        role: userData.role,
        portalType: userData.portalType,
        inviteType: userData.inviteType,
        inviteId: userData.inviteId
      });

      // Special check for viktorledin6@gmail.com
      if (userData.email === 'viktorledin6@gmail.com') {
        console.log('Found target user:', userData);
        
        // Force update to employee_salary if not already set
        if (userData.role !== 'employee_salary') {
          console.log('Updating to employee_salary role...');
          await updateDoc(doc(db, 'users', userDoc.id), {
            role: 'employee_salary',
            portalType: 'salary'
          });
          console.log('Update complete');
        }
      }
      
      // Process other employees
      else if (userData.role === 'employee_normal' || userData.role === 'employee_salary' || userData.portalType) {
        const portalType = userData.portalType;
        const expectedRole = portalType === 'normal' ? 'employee_normal' : 'employee_salary';

        if (userData.role !== expectedRole) {
          console.log(`Fixing user ${userData.email}:`, {
            currentRole: userData.role,
            portalType: portalType,
            newRole: expectedRole
          });

          await updateDoc(doc(db, 'users', userDoc.id), {
            role: expectedRole
          });
        }
      }
    }

    console.log('Role fix completed');
  } catch (error) {
    console.error('Error fixing roles:', error);
  }
}

fixEmployeeRoles()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
