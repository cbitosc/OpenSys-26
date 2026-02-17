// Install: npm install firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD2Q3ziWpGpSabeFijT0LmvnE3pEHZEs5g",
  authDomain: "opensys-26.firebaseapp.com",
  projectId: "opensys-26",
  storageBucket: "opensys-26.firebasestorage.app",
  messagingSenderId: "524840912682",
  appId: "1:524840912682:web:fe40a3ceb89e5e16f8c053",
  measurementId: "G-6GCP7K3KFQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Read a collection
const querySnapshot = await getDocs(collection(db, "your-collection-name"));
querySnapshot.forEach((doc) => {
  console.log(doc.id, " => ", doc.data());
});