import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8nxcDeo0cij9emiDMdI_LeOlpBdXIU5Q",
  authDomain: "signinfood-d1616.firebaseapp.com",
  projectId: "signinfood-d1616",
  storageBucket: "signinfood-d1616.firebasestorage.app",
  messagingSenderId: "522875178537",
  appId: "1:522875178537:web:07ec9a7ce6d8f1e46b9638",
  measurementId: "G-X0S7HJK1ZF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Export auth for use in components
export const auth = getAuth(app);

// Export analytics if needed elsewhere
export { analytics };