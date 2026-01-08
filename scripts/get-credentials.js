// Script para obtener credenciales de Firebase automáticamente
// Ejecutar con: node scripts/get-credentials.js

import { execSync } from 'child_process'
import { writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROJECT_ID = 'center-gym-yacanto'
const ENV_FILE = join(__dirname, '..', '.env')

console.log('🔍 Obteniendo credenciales de Firebase para:', PROJECT_ID, '\n')

try {
  // Verificar Firebase CLI
  try {
    execSync('firebase --version', { stdio: 'pipe' })
  } catch (error) {
    console.error('❌ Firebase CLI no está instalado.')
    console.error('   Instala con: npm install -g firebase-tools\n')
    process.exit(1)
  }

  // Verificar autenticación
  try {
    const projects = execSync('firebase projects:list --json', { encoding: 'utf-8' })
    const projectsData = JSON.parse(projects)
    const project = projectsData.result?.find(p => p.projectId === PROJECT_ID)
    
    if (!project) {
      console.log('⚠️  Proyecto no encontrado en tu cuenta.')
      console.log('   Ejecuta: firebase use --add\n')
    } else {
      console.log('✅ Proyecto encontrado:', project.projectId)
    }
  } catch (error) {
    console.log('⚠️  No estás autenticado o hay un error.')
    console.log('   Ejecuta: firebase login\n')
  }

  // Intentar obtener configuración usando Firebase CLI
  console.log('📋 Intentando obtener configuración del proyecto...\n')
  
  // Nota: Firebase CLI no tiene un comando directo para obtener las credenciales de la app web
  // Necesitamos usar la API REST de Firebase o pedir al usuario que las obtenga manualmente
  
  console.log('ℹ️  Firebase CLI no puede obtener las credenciales automáticamente.')
  console.log('   Debes obtenerlas desde la consola web.\n')
  
  console.log('🔗 Abre este enlace:')
  console.log(`   https://console.firebase.google.com/project/${PROJECT_ID}/settings/general\n`)
  
  console.log('📝 Instrucciones:')
  console.log('   1. Busca la sección "Tus aplicaciones"')
  console.log('   2. Haz clic en tu app web o crea una nueva (ícono </>)')
  console.log('   3. Copia las credenciales del objeto firebaseConfig\n')
  
  console.log('💡 O ejecuta: npm run setup:credentials')
  console.log('   para un asistente interactivo.\n')

} catch (error) {
  console.error('❌ Error:', error.message)
  process.exit(1)
}
