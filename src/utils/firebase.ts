import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const {
  REACT_APP_ID,
  REACT_APP_API_KEY,
  REACT_APP_PROJECT_ID,
  REACT_APP_AUTH_DOMAIN,
  REACT_APP_STORAGE_BUCKET,
  REACT_APP_MEASUREMENT_ID,
  REACT_APP_MESSAGING_SENDER_ID,
} = process.env;

const firebaseConfig = {
  appId: REACT_APP_ID,
  apiKey: REACT_APP_API_KEY,
  projectId: REACT_APP_PROJECT_ID,
  authDomain: REACT_APP_AUTH_DOMAIN,
  storageBucket: REACT_APP_STORAGE_BUCKET,
  measurementId: REACT_APP_MEASUREMENT_ID,
  messagingSenderId: REACT_APP_MESSAGING_SENDER_ID,
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
