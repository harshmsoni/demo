import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyDgc0YzyvnRJOJ8KeNkUVa_JXUaCoqwGHU",
  authDomain: "lifewithher-7d48c.firebaseapp.com",
  projectId: "lifewithher-7d48c",
  storageBucket: "lifewithher-7d48c.appspot.com",
  messagingSenderId: "701553861817",
  appId: "1:701553861817:web:26cf86a234631e05c8a768"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore instance
export const fire = getFirestore(app);

// Export the authentication instance
export const auth = getAuth(app);
