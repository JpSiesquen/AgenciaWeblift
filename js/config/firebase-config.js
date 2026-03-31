/* ═══════════════════════════════════════════════════════════
   WEBLIFT Studio — js/config/firebase-config.js
   
   INSTRUCCIONES:
   1. Ve a https://console.firebase.google.com
   2. Crea un nuevo proyecto → "WEBLIFT Studio"
   3. Agrega una app web (ícono </>)
   4. Copia tu configuración y reemplaza los valores abajo
   5. En Firebase Console:
      - Authentication → Sign-in method → Habilitar "Email/Password" y "Google"
      - Firestore Database → Crear base de datos (modo producción)
═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   WEBLIFT Studio — js/config/firebase-config.js
═══════════════════════════════════════════════ */

const firebaseConfig = {
  apiKey:            "AIzaSyDJ7gkLJ3e1NE8awtg9YayCF0KIW41_Grw",
  authDomain:        "weblift-studio.firebaseapp.com",
  projectId:         "weblift-studio",
  storageBucket:     "weblift-studio.firebasestorage.app",
  messagingSenderId: "240422259886",
  appId:             "1:240422259886:web:38a2ad1d16c3242097b13f",
  measurementId:     "G-X9T971TZ6P"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Instancias globales
const db   = firebase.firestore();
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

console.log("✅ Firebase conectado — weblift-studio");