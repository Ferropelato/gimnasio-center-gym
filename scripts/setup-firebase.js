// Script para verificar y configurar Firebase
// Ejecutar con: node scripts/setup-firebase.js

import { readFileSync, existsSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🔍 Verificando configuración de Firebase...\n')

// Función para cargar variables de entorno desde archivo .env
function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return {}
  
  const envContent = readFileSync(filePath, 'utf-8')
  const envVars = {}
  
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim()
    // Ignorar comentarios y líneas vacías
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const match = trimmedLine.match(/^([^=]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        let value = match[2].trim()
        // Eliminar comillas si existen
        value = value.replace(/^["']|["']$/g, '')
        if (value && !value.includes('AQUI') && !value.includes('TU_') && !value.includes('tu-')) {
          envVars[key] = value
          process.env[key] = value
        }
      }
    }
  })
  
  return envVars
}

// Intentar cargar desde .env primero, luego .env.local
let envVars = {}
const envPath = join(__dirname, '..', '.env')
const envLocalPath = join(__dirname, '..', '.env.local')

if (existsSync(envPath)) {
  envVars = loadEnvFile(envPath)
} else if (existsSync(envLocalPath)) {
  envVars = loadEnvFile(envLocalPath)
} else {
  // Crear archivo .env si no existe
  const envTemplate = `# Firebase Configuration para center-gym-yacanto
# Obtén las credenciales en: https://console.firebase.google.com/project/center-gym-yacanto/settings/general

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=center-gym-yacanto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=center-gym-yacanto
VITE_FIREBASE_STORAGE_BUCKET=center-gym-yacanto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
`
  writeFileSync(envPath, envTemplate, 'utf-8')
  console.log('📝 Archivo .env creado. Por favor completa las credenciales.\n')
}

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "center-gym-yacanto.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "center-gym-yacanto",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "center-gym-yacanto.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.VITE_FIREBASE_APP_ID || ""
}

console.log('📋 Configuración actual:')
console.log(`   Project ID: ${firebaseConfig.projectId}`)
console.log(`   Auth Domain: ${firebaseConfig.authDomain}`)
console.log(`   API Key: ${firebaseConfig.apiKey ? '✅ Configurada' : '❌ FALTANTE'}`)
console.log(`   App ID: ${firebaseConfig.appId ? '✅ Configurada' : '❌ FALTANTE'}`)
console.log(`   Messaging Sender ID: ${firebaseConfig.messagingSenderId ? '✅ Configurada' : '❌ FALTANTE'}\n`)

if (!firebaseConfig.apiKey || !firebaseConfig.appId) {
  console.log('⚠️  Faltan credenciales importantes.\n')
  console.log('📝 Para obtenerlas:')
  console.log('   1. Ve a: https://console.firebase.google.com/project/center-gym-yacanto/settings/general')
  console.log('   2. Baja hasta "Tus aplicaciones"')
  console.log('   3. Haz clic en tu app web o crea una nueva (ícono </>)')
  console.log('   4. Copia los valores de firebaseConfig')
  console.log('   5. Pégalos en el archivo .env.local\n')
  process.exit(1)
}

// Probar conexión
try {
  console.log('🔌 Probando conexión con Firebase...')
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  
  console.log('✅ Conexión exitosa!\n')
  
  // Verificar productos
  console.log('📦 Verificando productos en Firestore...')
  const productsSnapshot = await getDocs(collection(db, 'products'))
  
  if (productsSnapshot.empty) {
    console.log('   ⚠️  No hay productos en Firestore')
    console.log('   💡 Ejecuta: npm run migrate:products\n')
  } else {
    console.log(`   ✅ ${productsSnapshot.size} productos encontrados\n`)
  }
  
  console.log('✅ Firebase está correctamente configurado!')
  
} catch (error) {
  console.error('❌ Error conectando con Firebase:', error.message)
  console.error('\n💡 Verifica:')
  console.error('   - Que las credenciales sean correctas')
  console.error('   - Que el proyecto esté activo')
  console.error('   - Que los servicios estén habilitados\n')
  process.exit(1)
}
