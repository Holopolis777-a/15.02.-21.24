const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

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

async function fixVehicleCategories() {
  try {
    console.log('Starting vehicle categories fix...');
    const vehiclesRef = collection(db, 'vehicles');
    const snapshot = await getDocs(vehiclesRef);
    
    for (const vehicleDoc of snapshot.docs) {
      const vehicleData = vehicleDoc.data();
      console.log(`Checking vehicle ${vehicleDoc.id}:`, {
        brand: vehicleData.brand,
        model: vehicleData.model,
        category: vehicleData.category,
        categories: vehicleData.categories
      });

      // Determine the correct categories array based on the category field
      let correctCategories = [];
      if (vehicleData.category === 'salary') {
        correctCategories = ['salary'];
      } else if (vehicleData.category === 'company') {
        correctCategories = ['company'];
      } else if (vehicleData.category === 'standard') {
        correctCategories = ['standard'];
      }

      // Update if categories array doesn't match
      if (!vehicleData.categories || 
          !Array.isArray(vehicleData.categories) || 
          vehicleData.categories.join(',') !== correctCategories.join(',')) {
        console.log(`Updating categories for vehicle ${vehicleDoc.id}:`, {
          oldCategories: vehicleData.categories,
          newCategories: correctCategories
        });
        
        await updateDoc(doc(db, 'vehicles', vehicleDoc.id), {
          categories: correctCategories
        });
      }
    }

    console.log('Vehicle categories fix completed');
  } catch (error) {
    console.error('Error fixing vehicle categories:', error);
  }
}

fixVehicleCategories()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
