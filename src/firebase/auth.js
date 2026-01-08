// Firebase Authentication Service
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { auth } from './config'

// Verificar que auth esté disponible
if (!auth) {
  console.warn('⚠️ Firebase Auth no está inicializado')
}

// Provider para Google
const googleProvider = new GoogleAuthProvider()

/**
 * Registra un nuevo usuario con email y contraseña
 */
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    if (displayName) {
      await updateProfile(userCredential.user, { displayName })
    }
    
    return { user: userCredential.user, error: null }
  } catch (error) {
    return { user: null, error: getAuthErrorMessage(error.code) }
  }
}

/**
 * Inicia sesión con email y contraseña
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error) {
    return { user: null, error: getAuthErrorMessage(error.code) }
  }
}

/**
 * Inicia sesión con Google
 */
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return { user: result.user, error: null }
  } catch (error) {
    return { user: null, error: getAuthErrorMessage(error.code) }
  }
}

/**
 * Cierra sesión del usuario actual
 */
export const logoutUser = async () => {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error) {
    return { error: getAuthErrorMessage(error.code) }
  }
}

/**
 * Observa cambios en el estado de autenticación
 */
export const onAuthChange = (callback) => {
  if (!auth) {
    console.warn('⚠️ Firebase Auth no está inicializado, retornando usuario null')
    callback(null)
    return () => {} // Retornar función de limpieza vacía
  }
  return onAuthStateChanged(auth, callback)
}

/**
 * Obtiene el usuario actual
 */
export const getCurrentUser = () => {
  return auth.currentUser
}

/**
 * Convierte códigos de error de Firebase a mensajes amigables en español
 */
const getAuthErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'Este correo electrónico ya está registrado',
    'auth/invalid-email': 'Correo electrónico inválido',
    'auth/operation-not-allowed': 'Operación no permitida',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/user-not-found': 'No existe una cuenta con este correo electrónico',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/invalid-credential': 'Credenciales inválidas',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
    'auth/popup-closed-by-user': 'La ventana de autenticación fue cerrada',
    'auth/cancelled-popup-request': 'Solo se permite una solicitud de popup a la vez'
  }
  
  return errorMessages[errorCode] || 'Ocurrió un error. Intenta nuevamente'
}


