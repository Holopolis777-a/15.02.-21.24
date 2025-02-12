const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc, getDoc } = require('firebase/firestore');

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

async function fixVehicleRequests() {
  try {
    console.log('Starting vehicle requests fix...');
    const requestsRef = collection(db, 'vehicleRequests');
    const snapshot = await getDocs(requestsRef);
    
    for (const requestDoc of snapshot.docs) {
      const requestData = requestDoc.data();
      console.log(`Checking request ${requestDoc.id}:`, requestData);

      // Get the vehicle data to check if it's a salary conversion vehicle
      const vehicleDoc = await getDoc(doc(db, 'vehicles', requestData.vehicleId));
      const vehicleData = vehicleDoc.data();
      
      // Determine the correct type based on vehicle category
      const shouldBeSalaryConversion = vehicleData?.categories?.includes('salary');
      const correctType = shouldBeSalaryConversion ? 'salary_conversion' : 'regular';
      
      // Update if type is missing or incorrect
      if (!requestData.type || requestData.type !== correctType) {
        console.log(`Updating request ${requestDoc.id}:`, {
          currentType: requestData.type,
          newType: correctType,
          vehicleId: requestData.vehicleId,
          vehicleCategories: vehicleData?.categories
        });
        
        await updateDoc(doc(db, 'vehicleRequests', requestDoc.id), {
          type: correctType
        });
      }
    }

    console.log('Vehicle requests fix completed');
  } catch (error) {
    console.error('Error fixing vehicle requests:', error);
  }
}

fixVehicleRequests()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
