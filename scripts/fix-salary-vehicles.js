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

async function fixSalaryVehicles() {
  try {
    console.log('Starting salary vehicles fix...');
    const vehiclesRef = collection(db, 'vehicles');
    const snapshot = await getDocs(vehiclesRef);
    
    for (const vehicleDoc of snapshot.docs) {
      const vehicleData = vehicleDoc.data();
      console.log(`Checking vehicle ${vehicleDoc.id}:`, {
        brand: vehicleData.brand,
        model: vehicleData.model,
        categories: vehicleData.categories
      });

      // Only process salary vehicles
      if (!vehicleData.categories?.includes('salary')) {
        continue;
      }

      const updates = {};

      // Ensure listPrice is set (required for salary conversion calculations)
      if (!vehicleData.listPrice) {
        updates.listPrice = vehicleData.basePrice || 0;
      }

      // Ensure priceMatrix exists with standard configurations
      if (!vehicleData.priceMatrix || !Array.isArray(vehicleData.priceMatrix)) {
        updates.priceMatrix = [
          { duration: 24, mileage: 5000, price: vehicleData.basePrice * 0.015 },
          { duration: 24, mileage: 10000, price: vehicleData.basePrice * 0.017 },
          { duration: 24, mileage: 15000, price: vehicleData.basePrice * 0.019 },
          { duration: 24, mileage: 20000, price: vehicleData.basePrice * 0.021 },
          { duration: 36, mileage: 5000, price: vehicleData.basePrice * 0.014 },
          { duration: 36, mileage: 10000, price: vehicleData.basePrice * 0.016 },
          { duration: 36, mileage: 15000, price: vehicleData.basePrice * 0.018 },
          { duration: 36, mileage: 20000, price: vehicleData.basePrice * 0.020 },
          { duration: 48, mileage: 5000, price: vehicleData.basePrice * 0.013 },
          { duration: 48, mileage: 10000, price: vehicleData.basePrice * 0.015 },
          { duration: 48, mileage: 15000, price: vehicleData.basePrice * 0.017 },
          { duration: 48, mileage: 20000, price: vehicleData.basePrice * 0.019 }
        ];
      }

      // Only update if there are changes
      if (Object.keys(updates).length > 0) {
        console.log(`Updating vehicle ${vehicleDoc.id} with:`, updates);
        await updateDoc(doc(db, 'vehicles', vehicleDoc.id), updates);
      }
    }

    console.log('Salary vehicles fix completed');
  } catch (error) {
    console.error('Error fixing salary vehicles:', error);
  }
}

fixSalaryVehicles()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
