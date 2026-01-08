// Script para migrar productos desde el archivo estático a Firestore
// Ejecutar con: node scripts/migrate-products.js
// Nota: Este script requiere tener las credenciales de Firebase configuradas

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Cargar variables de entorno desde .env
const envFilePath = join(__dirname, '..', '.env')
let envVars = {}
try {
  const envContent = readFileSync(envFilePath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim()
      envVars[key] = value
    }
  })
} catch (error) {
  console.warn('⚠️  No se pudo cargar .env, usando variables de entorno del sistema')
}

// Importar productos desde el archivo de datos
const productsFilePath = join(__dirname, '..', 'src', 'data', 'products.js')
const productsFileContent = readFileSync(productsFilePath, 'utf-8')

// Extraer el array de productos - buscar desde "export const products" hasta el final del array
// Buscar el contenido entre "export const products = [" y el "];" final
const startIndex = productsFileContent.indexOf('export const products = [')
if (startIndex === -1) {
  console.error('❌ No se encontró "export const products" en el archivo')
  process.exit(1)
}

// Encontrar el final del array buscando el corchete de cierre correspondiente
let bracketCount = 0
let inString = false
let stringChar = null
let i = startIndex + 'export const products = '.length

for (; i < productsFileContent.length; i++) {
  const char = productsFileContent[i]
  
  if (!inString && (char === '"' || char === "'")) {
    inString = true
    stringChar = char
  } else if (inString && char === stringChar && productsFileContent[i - 1] !== '\\') {
    inString = false
    stringChar = null
  } else if (!inString) {
    if (char === '[') bracketCount++
    if (char === ']') {
      bracketCount--
      if (bracketCount === 0) {
        i++
        break
      }
    }
  }
}

const productsArrayStr = productsFileContent.substring(
  startIndex + 'export const products = '.length,
  i
)

// Evaluar el array de productos
let products
try {
  products = eval('(' + productsArrayStr + ')')
} catch (error) {
  console.error('❌ Error al parsear los productos:', error.message)
  process.exit(1)
}

// Configuración de Firebase (usa las mismas variables de entorno)
const firebaseConfig = {
  apiKey: envVars.VITE_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY || "",
  authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN || "center-gym-yacanto.firebaseapp.com",
  projectId: envVars.VITE_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || "center-gym-yacanto",
  storageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET || "center-gym-yacanto.firebasestorage.app",
  messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: envVars.VITE_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID || ""
}

// Validar configuración
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Error: Las credenciales de Firebase no están configuradas.')
  console.error('   Por favor, configura las variables de entorno o edita este script.')
  console.error('   Variables necesarias:')
  console.error('   - VITE_FIREBASE_API_KEY')
  console.error('   - VITE_FIREBASE_PROJECT_ID')
  console.error('   - VITE_FIREBASE_AUTH_DOMAIN')
  console.error('   - etc.')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function migrateProducts() {
  try {
    console.log('🚀 Iniciando migración de productos...')
    console.log(`   Productos a migrar: ${products.length}`)
    
    // Verificar si ya existen productos
    const productsSnapshot = await getDocs(collection(db, 'products'))
    if (!productsSnapshot.empty) {
      console.log(`⚠️  Ya existen ${productsSnapshot.size} productos en Firestore.`)
      console.log('   Continuando con la migración...')
      // No retornar, permitir agregar más productos
    }

    console.log('📦 Migrando productos a Firestore...')
    
    // Migrar productos
    const productsRef = collection(db, 'products')
    let successCount = 0
    let errorCount = 0

    for (const product of products) {
      try {
        // Remover el id del objeto ya que Firestore lo genera automáticamente
        const { id, ...productData } = product
        await addDoc(productsRef, productData)
        successCount++
        console.log(`   ✓ ${product.name}`)
      } catch (error) {
        errorCount++
        console.error(`   ✗ Error con ${product.name}:`, error.message)
      }
    }
    
    console.log('')
    console.log(`✅ Migración completada!`)
    console.log(`   Productos migrados: ${successCount}`)
    if (errorCount > 0) {
      console.log(`   Errores: ${errorCount}`)
    }
  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    console.error('   Verifica tu configuración de Firebase y las credenciales.')
    process.exit(1)
  }
}

migrateProducts()


