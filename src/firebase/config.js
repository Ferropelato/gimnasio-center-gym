// Firebase Configuration
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'

// Configuración de Firebase
// Proyecto: center-gym-yacanto
// Las credenciales se cargan desde variables de entorno (.env) o valores por defecto
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBn76k3iLtEy02JWcPC5V2fEgUATSfVI6c",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "center-gym-yacanto.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "center-gym-yacanto",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "center-gym-yacanto.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "50592316638",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:50592316638:web:7e69c2b6de9efa25e0564f"
}

// Validar configuración crítica
if (!firebaseConfig.apiKey) {
  console.error('❌ Firebase API Key no configurada. La aplicación no funcionará correctamente.')
  console.error('Por favor, configura las variables de entorno en .env antes de hacer el build.')
  console.error('Config actual:', {
    apiKey: firebaseConfig.apiKey ? '✅ Configurada' : '❌ Faltante',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    appId: firebaseConfig.appId ? '✅ Configurada' : '❌ Faltante'
  })
}

let app = null
try {
  // Inicializar Firebase
  app = initializeApp(firebaseConfig)
  console.log('✅ Firebase inicializado correctamente')
} catch (error) {
  console.error('❌ Error inicializando Firebase:', error)
  console.error('Config usado:', {
    apiKey: firebaseConfig.apiKey ? '✅ Configurada' : '❌ Faltante',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    appId: firebaseConfig.appId ? '✅ Configurada' : '❌ Faltante'
  })
  // No lanzar el error, permitir que la app continúe
  app = null
}

// Inicializar servicios solo si app existe
let auth = null
let db = null
let functions = null

if (app) {
  try {
    auth = getAuth(app)
    db = getFirestore(app)
    functions = getFunctions(app)
  } catch (error) {
    console.error('❌ Error inicializando servicios de Firebase:', error)
  }
}

export { auth, db, functions }

export default app


