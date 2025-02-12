const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore');

// Firebase config
const config = {
  apiKey: "AIzaSyA8fH-_F04uEV8yt6nAxvWvTl9BMLkjmNo",
  authDomain: "vilocar1.firebaseapp.com",
  projectId: "vilocar1",
  storageBucket: "vilocar1.appspot.com",
  messagingSenderId: "955089184423",
  appId: "1:955089184423:web:71b711504b36ba5c691d82"
};

// Initialize Firebase
const app = initializeApp(config);
const db = getFirestore(app);

async function fixEmployerRoles() {
  try {
    console.log('Starting to fix employer roles...');
    
    // Get all users
    const usersSnapshot = await getDocs(collection(db, 'users'));
    let updateCount = 0;
    let skipCount = 0;
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      // Check if this is an employer that needs fixing
      if (userData.role && userData.role.includes('employer')) {
        if (userData.role !== 'employer') {
          console.log(`Fixing user ${userDoc.id} role from ${userData.role} to employer`);
          
          // Update the user
          await updateDoc(doc(db, 'users', userDoc.id), {
            role: 'employer'
          });
          
          updateCount++;
        } else {
          skipCount++;
        }
      }
    }
    
    console.log(`Fixed ${updateCount} employer roles`);
    console.log(`Skipped ${skipCount} users (already correct)`);
    console.log('Employer roles fix completed successfully');
    
  } catch (error) {
    console.error('Error fixing employer roles:', error);
  }
}

// Run the fix
fixEmployerRoles();
