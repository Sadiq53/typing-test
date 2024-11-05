//firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlfICp8aysfMWNzW4OM1SYWTC5HLUnh0w",
  authDomain: "typing-test-57f38.firebaseapp.com",
  projectId: "typing-test-57f38",
  storageBucket: "typing-test-57f38.appspot.com", // Note: This should be `.appspot.com` for storage
  messagingSenderId: "28188305393",
  appId: "1:28188305393:web:1e78d187ece6867f358650",
  measurementId: "G-LF6LEW1HXE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app); // Initialize Cloud Messaging

export { app, analytics, messaging };
