const ADMIN_EMAIL = 'amandaengeldecastro@gmail.com';

const firebaseConfig = {
  apiKey: "AIzaSyBL-PL8znRv8IIPjDRC51MgS_moqzULXHg",
  authDomain: "maps-1464e.firebaseapp.com",
  projectId: "maps-1464e",
  storageBucket: "maps-1464e.firebasestorage.app",
  messagingSenderId: "985048839530",
  appId: "1:985048839530:web:5d5ccb72ec9cdb9b73e113"
};

const EMAILJS_SERVICE_ID = "maps";
const EMAILJS_TEMPLATE_ID = "maps";
const EMAILJS_PUBLIC_KEY = "10hWlVNwQ16VWkRA_";

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
emailjs.init(EMAILJS_PUBLIC_KEY);
