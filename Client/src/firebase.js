import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbWtrcgosnGMJqneutskGV6xMugx2TVDw",
  authDomain: "shopex-ecommerce.firebaseapp.com",
  projectId: "shopex-ecommerce",
  storageBucket: "shopex-ecommerce.appspot.com",
  messagingSenderId: "635849792002",
  appId: "1:635849792002:web:d335e50a8325b0b04ca51b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;