// Script simple para crear archivo .env
// Ejecutar con: node scripts/crear-env-simple.js

import { writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROJECT_ID = 'center-gym-yacanto'
const ENV_FILE = join(__dirname, '..', '.env')

const envTemplate = `# Firebase Configuration para ${PROJECT_ID}
# Reemplaza los valores vacíos con tus credenciales reales
# Obtén las credenciales en: https://console.firebase.google.com/project/${PROJECT_ID}/settings/general

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=${PROJECT_ID}.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=${PROJECT_ID}
VITE_FIREBASE_STORAGE_BUCKET=${PROJECT_ID}.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
`

try {
  if (existsSync(ENV_FILE)) {
    console.log('⚠️  El archivo .env ya existe.')
    console.log('   Si quieres recrearlo, elimínalo primero.')
    console.log(`   Ubicación: ${ENV_FILE}\n`)
  } else {
    writeFileSync(ENV_FILE, envTemplate, 'utf-8')
    console.log('✅ Archivo .env creado exitosamente!\n')
    console.log(`📁 Ubicación: ${ENV_FILE}\n`)
    console.log('📝 PRÓXIMOS PASOS:\n')
    console.log('1. Obtén las credenciales en:')
    console.log(`   https://console.firebase.google.com/project/${PROJECT_ID}/settings/general\n`)
    console.log('2. Abre el archivo .env y completa estos valores:')
    console.log('   - VITE_FIREBASE_API_KEY')
    console.log('   - VITE_FIREBASE_MESSAGING_SENDER_ID')
    console.log('   - VITE_FIREBASE_APP_ID\n')
    console.log('3. Guarda el archivo y ejecuta: npm run setup:firebase\n')
  }
} catch (error) {
  console.error('❌ Error:', error.message)
  process.exit(1)
}


