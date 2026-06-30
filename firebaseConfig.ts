import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';



const firebaseConfig = {
  apiKey: "AIzaSyAPC_u7IqENxeV4pJh_TNGRRkju3fYQ6fY",
  authDomain: "ecomap-5e73e.firebaseapp.com",
  projectId: "ecomap-5e73e",
  storageBucket: "ecomap-5e73e.firebasestorage.app",
  messagingSenderId: "217945753246",
  appId: "1:217945753246:web:b9c3f7b745cfb2649fdd8f"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage as any),
});

export const db = getFirestore(app);