// Script para configuración automática completa
// Ejecutar con: node scripts/auto-setup.js

import { execSync } from 'child_process'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROJECT_ID = 'center-gym-yacanto'
const ENV_FILE = join(__dirname, '..', '.env')

console.log('🚀 Configuración Automática de Firebase\n')
console.log(`Proyecto: ${PROJECT_ID}\n`)

async function autoSetup() {
  try {
    // Paso 1: Verificar Firebase CLI
    console.log('1️⃣ Verificando Firebase CLI...')
    try {
      const version = execSync('firebase --version', { encoding: 'utf-8' }).trim()
      console.log(`   ✅ Firebase CLI ${version} instalado\n`)
    } catch (error) {
      console.log('   ❌ Firebase CLI no está instalado')
      console.log('   📦 Instalando Firebase CLI globalmente...\n')
      execSync('npm install -g firebase-tools', { stdio: 'inherit' })
      console.log('   ✅ Firebase CLI instalado\n')
    }

    // Paso 2: Verificar autenticación
    console.log('2️⃣ Verificando autenticación...')
    try {
      execSync('firebase projects:list', { stdio: 'pipe' })
      console.log('   ✅ Autenticado en Firebase\n')
    } catch (error) {
      console.log('   ⚠️  No estás autenticado')
      console.log('   🔐 Iniciando proceso de login...\n')
      execSync('firebase login', { stdio: 'inherit' })
    }

    // Paso 3: Configurar proyecto
    console.log('3️⃣ Configurando proyecto Firebase...')
    try {
      execSync(`firebase use ${PROJECT_ID}`, { stdio: 'pipe' })
      console.log(`   ✅ Proyecto ${PROJECT_ID} seleccionado\n`)
    } catch (error) {
      console.log(`   ⚠️  Configurando proyecto ${PROJECT_ID}...\n`)
      try {
        execSync(`firebase use --add ${PROJECT_ID}`, { stdio: 'inherit' })
      } catch (err) {
        console.log('   ℹ️  Necesitas configurar el proyecto manualmente')
      }
    }

    // Paso 4: Verificar o crear .env
    console.log('4️⃣ Configurando archivo .env...')
    
    if (!existsSync(ENV_FILE)) {
      const envTemplate = `# Firebase Configuration
# Proyecto: ${PROJECT_ID}
# Obtén las credenciales en: https://console.firebase.google.com/project/${PROJECT_ID}/settings/general

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=${PROJECT_ID}.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=${PROJECT_ID}
VITE_FIREBASE_STORAGE_BUCKET=${PROJECT_ID}.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
`
      writeFileSync(ENV_FILE, envTemplate, 'utf-8')
      console.log('   ✅ Archivo .env creado\n')
      console.log('   ⚠️  Necesitas completar las credenciales')
      console.log('   💡 Ejecuta: npm run setup:credentials\n')
    } else {
      console.log('   ✅ Archivo .env existe\n')
      
      // Verificar si tiene valores
      const envContent = readFileSync(ENV_FILE, 'utf-8')
      const hasApiKey = envContent.includes('VITE_FIREBASE_API_KEY=') && 
                       !envContent.match(/VITE_FIREBASE_API_KEY=\s*$/m)
      const hasAppId = envContent.includes('VITE_FIREBASE_APP_ID=') && 
                      !envContent.match(/VITE_FIREBASE_APP_ID=\s*$/m)
      
      if (!hasApiKey || !hasAppId) {
        console.log('   ⚠️  Faltan credenciales en .env')
        console.log('   💡 Ejecuta: npm run setup:credentials\n')
      } else {
        console.log('   ✅ Credenciales encontradas\n')
      }
    }

    // Paso 5: Desplegar reglas de Firestore
    console.log('5️⃣ Verificando reglas de Firestore...')
    try {
      console.log('   📤 Desplegando reglas...\n')
      execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' })
      console.log('\n   ✅ Reglas desplegadas\n')
    } catch (error) {
      console.log('   ⚠️  Error al desplegar reglas (puede ser normal si ya están desplegadas)\n')
    }

    // Paso 6: Verificar productos
    console.log('6️⃣ Verificando productos en Firestore...')
    try {
      const { initializeApp } = await import('firebase/app')
      const { getFirestore, collection, getDocs } = await import('firebase/firestore')
      
      // Cargar variables de entorno
      const envContent = readFileSync(ENV_FILE, 'utf-8')
      const envVars = {}
      envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/)
        if (match && !match[1].trim().startsWith('#')) {
          const key = match[1].trim()
          const value = match[2].trim().replace(/^["']|["']$/g, '')
          if (value) envVars[key] = value
        }
      })

      if (envVars.VITE_FIREBASE_API_KEY && envVars.VITE_FIREBASE_APP_ID) {
        const firebaseConfig = {
          apiKey: envVars.VITE_FIREBASE_API_KEY,
          authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN || `${PROJECT_ID}.firebaseapp.com`,
          projectId: envVars.VITE_FIREBASE_PROJECT_ID || PROJECT_ID,
          storageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET || `${PROJECT_ID}.appspot.com`,
          messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
          appId: envVars.VITE_FIREBASE_APP_ID
        }

        const app = initializeApp(firebaseConfig)
        const db = getFirestore(app)
        const productsSnapshot = await getDocs(collection(db, 'products'))
        
        if (productsSnapshot.empty) {
          console.log('   ⚠️  No hay productos en Firestore')
          console.log('   💡 Ejecuta: npm run migrate:products\n')
        } else {
          console.log(`   ✅ ${productsSnapshot.size} productos encontrados\n`)
        }
      } else {
        console.log('   ⏳ Esperando credenciales...\n')
      }
    } catch (error) {
      console.log('   ⏳ No se puede verificar productos sin credenciales\n')
    }

    console.log('✅ Configuración automática completada!\n')
    console.log('📝 Próximos pasos:')
    console.log('   1. Si faltan credenciales: npm run setup:credentials')
    console.log('   2. Si faltan productos: npm run migrate:products')
    console.log('   3. Iniciar desarrollo: npm run dev\n')

  } catch (error) {
    console.error('\n❌ Error durante la configuración:', error.message)
    console.error('\n💡 Puedes ejecutar manualmente:')
    console.error('   - npm run setup:credentials (para configurar credenciales)')
    console.error('   - npm run setup:firebase (para verificar configuración)')
    process.exit(1)
  }
}

autoSetup()
