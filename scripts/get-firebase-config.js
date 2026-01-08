// Script para obtener la configuración de Firebase
// Ejecutar con: node scripts/get-firebase-config.js

import { execSync } from 'child_process'
import { writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROJECT_ID = 'center-gym-yacanto'
const ENV_FILE = join(__dirname, '..', '.env')

console.log('🔍 Obteniendo configuración de Firebase...\n')

// Crear contenido del .env con instrucciones
const envContent = `# Firebase Configuration
# Proyecto: ${PROJECT_ID}
# 
# INSTRUCCIONES PARA OBTENER LAS CREDENCIALES:
# 1. Ve a: https://console.firebase.google.com/project/${PROJECT_ID}/settings/general
# 2. Desplázate hasta "Tus aplicaciones" y haz clic en el ícono web (</>)
# 3. Si no tienes una app web, regístrala con el nombre "Center Gym Web"
# 4. Copia las credenciales de firebaseConfig y pégalas abajo

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=${PROJECT_ID}.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=${PROJECT_ID}
VITE_FIREBASE_STORAGE_BUCKET=${PROJECT_ID}.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
`

try {
  // Intentar obtener información del proyecto usando Firebase CLI
  try {
    console.log('📋 Verificando Firebase CLI...')
    execSync('firebase --version', { stdio: 'pipe' })
    console.log('✓ Firebase CLI está instalado\n')
    
    // Verificar si está autenticado
    try {
      execSync('firebase projects:list', { stdio: 'pipe' })
      console.log('✓ Autenticado en Firebase\n')
    } catch (error) {
      console.log('⚠️  No estás autenticado. Ejecuta: firebase login\n')
    }
  } catch (error) {
    console.log('⚠️  Firebase CLI no está instalado.')
    console.log('   Instala con: npm install -g firebase-tools\n')
  }

  // Crear o actualizar .env
  if (existsSync(ENV_FILE)) {
    console.log('⚠️  El archivo .env ya existe.')
    console.log('   Si quieres recrearlo, elimínalo primero.\n')
  } else {
    writeFileSync(ENV_FILE, envContent, 'utf-8')
    console.log('✅ Archivo .env creado en la raíz del proyecto\n')
  }

  console.log('📝 PRÓXIMOS PASOS:\n')
  console.log('1. Abre este enlace para obtener las credenciales:')
  console.log(`   https://console.firebase.google.com/project/${PROJECT_ID}/settings/general\n`)
  console.log('2. Busca "Tus aplicaciones" y haz clic en el ícono web (</>)\n')
  console.log('3. Si no tienes una app, regístrala con nombre: "Center Gym Web"\n')
  console.log('4. Copia las credenciales del objeto firebaseConfig y edita el archivo .env\n')
  console.log('5. Ejemplo de lo que deberías ver:')
  console.log('   const firebaseConfig = {')
  console.log('     apiKey: "AIza...",')
  console.log('     authDomain: "center-gym-yacanto.firebaseapp.com",')
  console.log('     projectId: "center-gym-yacanto",')
  console.log('     storageBucket: "center-gym-yacanto.appspot.com",')
  console.log('     messagingSenderId: "123456789",')
  console.log('     appId: "1:123456789:web:abc123"')
  console.log('   };\n')
  console.log('6. Copia cada valor en el .env correspondiente\n')
  
} catch (error) {
  console.error('❌ Error:', error.message)
  process.exit(1)
}


