import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';

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

async function fixEmployeeStatuses() {
  try {
    console.log('Starting to fix employee statuses...');
    
    // Get all users
    const usersSnapshot = await getDocs(collection(db, 'users'));
    let updateCount = 0;
    let skipCount = 0;
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      // Check if this is an employee
      if (userData.role && (userData.role === 'employee_normal' || userData.role === 'employee_salary')) {
        // Get the invite document
        if (userData.inviteId) {
          const inviteDoc = await getDoc(doc(db, 'employeeInvites', userData.inviteId));
          if (inviteDoc.exists()) {
            const inviteData = inviteDoc.data();
            
            // If invite is pending but user is not pending, fix it
            if (inviteData.status === 'pending' && userData.status !== 'pending') {
              console.log(`Fixing user ${userDoc.id} status to match invite status`);
              
              await updateDoc(doc(db, 'users', userDoc.id), {
                status: 'pending'
              });
              
              updateCount++;
            } else {
              skipCount++;
            }
          }
        }
      }
    }
    
    console.log(`Fixed ${updateCount} employee statuses`);
    console.log(`Skipped ${skipCount} users (already correct)`);
    console.log('Employee status fix completed successfully');
    
  } catch (error) {
    console.error('Error fixing employee statuses:', error);
  }
}

// Run the fix
fixEmployeeStatuses();
