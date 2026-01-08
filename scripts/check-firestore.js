// Script para verificar Firestore y obtener información del proyecto
import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROJECT_ID = 'center-gym-yacanto'

console.log('🔍 Verificando proyecto Firebase:', PROJECT_ID, '\n')

try {
  // Verificar Firebase CLI
  try {
    execSync('firebase --version', { stdio: 'pipe' })
    console.log('✅ Firebase CLI instalado\n')
  } catch (error) {
    console.log('❌ Firebase CLI no instalado. Instala con: npm install -g firebase-tools\n')
    process.exit(1)
  }

  // Verificar autenticación y obtener información del proyecto
  try {
    console.log('📋 Obteniendo información del proyecto...\n')
    
    // Obtener lista de proyectos
    const projectsOutput = execSync('firebase projects:list --json', { encoding: 'utf-8' })
    const projects = JSON.parse(projectsOutput)
    
    const project = projects.result?.find(p => p.projectId === PROJECT_ID)
    
    if (project) {
      console.log('✅ Proyecto encontrado:')
      console.log(`   Project ID: ${project.projectId}`)
      console.log(`   Display Name: ${project.displayName || 'N/A'}`)
      console.log(`   Project Number: ${project.projectNumber || 'N/A'}\n`)
    } else {
      console.log('⚠️  Proyecto no encontrado en tu cuenta')
      console.log('   Ejecuta: firebase use --add\n')
    }

    // Intentar obtener configuración del proyecto
    try {
      execSync(`firebase use ${PROJECT_ID}`, { stdio: 'pipe' })
      console.log('✅ Proyecto seleccionado\n')
    } catch (error) {
      console.log('⚠️  No se pudo seleccionar el proyecto automáticamente\n')
    }

    console.log('📊 ENLACES DIRECTOS A TU PROYECTO:\n')
    console.log('Firestore Database:')
    console.log(`   https://console.firebase.google.com/project/${PROJECT_ID}/firestore\n`)
    
    console.log('Firestore Data (vista de datos):')
    console.log(`   https://console.firebase.google.com/project/${PROJECT_ID}/firestore/data\n`)
    
    console.log('Firestore Collections:')
    console.log(`   https://console.firebase.google.com/project/${PROJECT_ID}/firestore/data/~2F\n`)

    console.log('Configuración General:')
    console.log(`   https://console.firebase.google.com/project/${PROJECT_ID}/settings/general\n`)

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\n💡 Asegúrate de estar autenticado: firebase login\n')
  }

} catch (error) {
  console.error('❌ Error general:', error.message)
}


