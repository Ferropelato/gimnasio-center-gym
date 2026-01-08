// Script para actualizar credenciales de Firebase en .env
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROJECT_ID = 'center-gym-yacanto'
const ENV_FILE = join(__dirname, '..', '.env')

const envContent = `# Firebase Configuration para ${PROJECT_ID}
VITE_FIREBASE_API_KEY=AIzaSyBn76k3iLtEy02JWcPC5V2fEgUATSfVI6c
VITE_FIREBASE_AUTH_DOMAIN=center-gym-yacanto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=center-gym-yacanto
VITE_FIREBASE_STORAGE_BUCKET=center-gym-yacanto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=50592316638
VITE_FIREBASE_APP_ID=1:50592316638:web:7e69c2b6de9efa25e0564f
`

try {
  writeFileSync(ENV_FILE, envContent, 'utf-8')
  console.log('✅ Archivo .env actualizado con las credenciales correctas!\n')
} catch (error) {
  console.error('❌ Error:', error.message)
  process.exit(1)
}
