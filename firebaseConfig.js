import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAPC_u7IqENxeV4pJh_TNGRRkju3fYQ6fY",
  authDomain: "ecomap-5e73e.firebaseapp.com",
  projectId: "ecomap-5e73e",
  storageBucket: "ecomap-5e73e.firebasestorage.app",
  messagingSenderId: "217945753246",
  appId: "1:217945753246:web:5e473aaf3acf2e5c9fdd8f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
