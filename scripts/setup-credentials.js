// Script interactivo para configurar credenciales de Firebase
// Ejecutar con: node scripts/setup-credentials.js

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { createInterface } from 'readline'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROJECT_ID = 'center-gym-yacanto'
const ENV_FILE = join(__dirname, '..', '.env')

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function setupCredentials() {
  console.log('\n🔧 Configuración de Credenciales de Firebase\n')
  console.log(`Proyecto: ${PROJECT_ID}\n`)
  
  // Cargar valores existentes si el archivo existe
  let existingValues = {}
  if (existsSync(ENV_FILE)) {
    const content = readFileSync(ENV_FILE, 'utf-8')
    content.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/)
      if (match && !match[1].trim().startsWith('#')) {
        const key = match[1].trim()
        const value = match[2].trim().replace(/^["']|["']$/g, '')
        if (value && !value.includes('tu-') && !value.includes('AQUI')) {
          existingValues[key] = value
        }
      }
    })
    console.log('✅ Archivo .env encontrado. Valores existentes serán usados si están vacíos.\n')
  }

  console.log('📋 Para obtener las credenciales:')
  console.log(`   1. Ve a: https://console.firebase.google.com/project/${PROJECT_ID}/settings/general`)
  console.log('   2. Busca "Tus aplicaciones" y haz clic en tu app web (o crea una)')
  console.log('   3. Copia los valores del objeto firebaseConfig\n')

  const apiKey = await question(`API Key ${existingValues.VITE_FIREBASE_API_KEY ? `(actual: ${existingValues.VITE_FIREBASE_API_KEY.substring(0, 20)}...)`: ''}: `) || existingValues.VITE_FIREBASE_API_KEY || ''
  
  const authDomain = await question(`Auth Domain (default: ${PROJECT_ID}.firebaseapp.com): `) || `${PROJECT_ID}.firebaseapp.com`
  
  const projectId = await question(`Project ID (default: ${PROJECT_ID}): `) || PROJECT_ID
  
  const storageBucket = await question(`Storage Bucket (default: ${PROJECT_ID}.appspot.com): `) || `${PROJECT_ID}.appspot.com`
  
  const messagingSenderId = await question(`Messaging Sender ID ${existingValues.VITE_FIREBASE_MESSAGING_SENDER_ID ? `(actual: ${existingValues.VITE_FIREBASE_MESSAGING_SENDER_ID})`: ''}: `) || existingValues.VITE_FIREBASE_MESSAGING_SENDER_ID || ''
  
  const appId = await question(`App ID ${existingValues.VITE_FIREBASE_APP_ID ? `(actual: ${existingValues.VITE_FIREBASE_APP_ID.substring(0, 20)}...)`: ''}: `) || existingValues.VITE_FIREBASE_APP_ID || ''

  // Validar valores críticos
  if (!apiKey || !messagingSenderId || !appId) {
    console.log('\n⚠️  Faltan valores críticos. El archivo se creará pero necesitarás completarlo.')
  }

  // Crear contenido del .env
  const envContent = `# Firebase Configuration
# Proyecto: ${PROJECT_ID}
# Generado automáticamente el ${new Date().toLocaleString('es-AR')}

VITE_FIREBASE_API_KEY=${apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${authDomain}
VITE_FIREBASE_PROJECT_ID=${projectId}
VITE_FIREBASE_STORAGE_BUCKET=${storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${messagingSenderId}
VITE_FIREBASE_APP_ID=${appId}
`

  writeFileSync(ENV_FILE, envContent, 'utf-8')
  
  console.log('\n✅ Archivo .env creado exitosamente!\n')
  console.log('📝 Verificando configuración...\n')
  
  rl.close()

  // Ejecutar verificación
  try {
    const { spawn } = await import('child_process')
    const setup = spawn('npm', ['run', 'setup:firebase'], {
      cwd: join(__dirname, '..'),
      stdio: 'inherit',
      shell: true
    })
    
    setup.on('close', (code) => {
      if (code === 0) {
        console.log('\n🎉 ¡Configuración completada exitosamente!')
        console.log('   Ejecuta: npm run dev\n')
      }
    })
  } catch (error) {
    console.log('\n⚠️  Ejecuta manualmente: npm run setup:firebase')
  }
}

setupCredentials().catch(error => {
  console.error('❌ Error:', error.message)
  rl.close()
  process.exit(1)
})
