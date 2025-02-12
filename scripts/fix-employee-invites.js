import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { config } from '../src/lib/firebase/config';

// Initialize Firebase
const app = initializeApp(config);
const db = getFirestore(app);

async function fixEmployeeInvites() {
  try {
    console.log('Starting to fix employee invites...');
    
    // Get all employee invites
    const invitesSnapshot = await getDocs(collection(db, 'employeeInvites'));
    let updateCount = 0;
    let skipCount = 0;
    
    for (const inviteDoc of invitesSnapshot.docs) {
      const inviteData = inviteDoc.data();
      
      // Check if this is an invite that needs fixing
      if (inviteData.type === 'employee_invite' && inviteData.inviteType === 'employer') {
        console.log(`Fixing invite ${inviteDoc.id}...`);
        
        // Update the invite
        await updateDoc(doc(db, 'employeeInvites', inviteDoc.id), {
          inviteType: 'employee'
        });
        
        updateCount++;
      } else {
        skipCount++;
      }
    }
    
    console.log(`Fixed ${updateCount} invites`);
    console.log(`Skipped ${skipCount} invites (already correct)`);
    console.log('Employee invites fix completed successfully');
    
  } catch (error) {
    console.error('Error fixing employee invites:', error);
  }
}

// Run the fix
fixEmployeeInvites();
