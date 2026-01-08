// Script para intentar obtener credenciales usando Firebase CLI y API
import { execSync } from 'child_process'
import { writeFileSync, existsSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROJECT_ID = 'center-gym-yacanto'
const ENV_FILE = join(__dirname, '..', '.env')

console.log('🔍 Buscando credenciales de Firebase...\n')

try {
  // Intentar obtener token de acceso de Firebase CLI
  let accessToken = null
  try {
    // Firebase CLI almacena tokens en diferentes lugares según el OS
    const os = process.platform
    let tokenPath
    
    if (os === 'win32') {
      tokenPath = join(process.env.APPDATA || '', 'firebase', 'tokens.json')
    } else if (os === 'darwin') {
      tokenPath = join(process.env.HOME || '', 'Library', 'Application Support', 'firebase', 'tokens.json')
    } else {
      tokenPath = join(process.env.HOME || '', '.config', 'firebase', 'tokens.json')
    }

    if (existsSync(tokenPath)) {
      const tokens = JSON.parse(readFileSync(tokenPath, 'utf-8'))
      accessToken = tokens.refresh_token || tokens.access_token
    }
  } catch (error) {
    // No se pudo obtener el token, continuar con otros métodos
  }

  // Crear .env con valores por defecto conocidos
  const envContent = `# Firebase Configuration - center-gym-yacanto
# Este archivo fue generado automáticamente
# Completa las credenciales que faltan desde: https://console.firebase.google.com/project/${PROJECT_ID}/settings/general

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=${PROJECT_ID}.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=${PROJECT_ID}
VITE_FIREBASE_STORAGE_BUCKET=${PROJECT_ID}.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
`

  if (!existsSync(ENV_FILE)) {
    writeFileSync(ENV_FILE, envContent, 'utf-8')
    console.log('✅ Archivo .env creado\n')
  } else {
    console.log('ℹ️  Archivo .env ya existe\n')
  }

  console.log('📋 Para obtener las credenciales automáticamente:')
  console.log('\n   1. Abre este enlace en tu navegador:')
  console.log(`      https://console.firebase.google.com/project/${PROJECT_ID}/settings/general\n`)
  console.log('   2. Busca "Tus aplicaciones" y haz clic en tu app web')
  console.log('   3. Copia los valores y ejecuta: npm run setup:credentials\n')
  console.log('   O edita manualmente el archivo .env\n')

} catch (error) {
  console.error('❌ Error:', error.message)
}


