// Firestore Products Service
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore'
import { db } from './config'

const PRODUCTS_COLLECTION = 'products'

/**
 * Obtiene todos los productos
 */
export const getAllProducts = async () => {
  try {
    if (!db) {
      console.error('❌ Firestore no está inicializado')
      return { products: [], error: 'Firebase no está configurado correctamente' }
    }
    
    const productsRef = collection(db, PRODUCTS_COLLECTION)
    const querySnapshot = await getDocs(productsRef)
    
    const products = []
    querySnapshot.forEach((doc) => {
      const productData = {
        id: doc.id,
        ...doc.data()
      }
      products.push(productData)
      // Log de los primeros 3 productos para debug
      if (products.length <= 3) {
        console.log(`📦 Producto ${products.length}:`, {
          id: productData.id,
          name: productData.name,
          category: productData.category
        })
      }
    })
    
    console.log(`✅ Productos cargados: ${products.length}`)
    
    if (products.length === 0) {
      console.warn('⚠️ No hay productos en Firestore. Ejecuta: npm run migrate:products')
      return { products: [], error: 'No hay productos disponibles. Por favor, contacta al administrador.' }
    }
    
    return { products, error: null }
  } catch (error) {
    console.error('❌ Error obteniendo productos:', error)
    console.error('Detalles del error:', {
      code: error.code,
      message: error.message
    })
    return { products: [], error: `Error al cargar los productos: ${error.message}` }
  }
}

/**
 * Obtiene un producto por su ID
 */
export const getProductById = async (productId) => {
  try {
    if (!db) {
      return { product: null, error: 'Firebase no está inicializado' }
    }
    
    console.log('🔍 Buscando producto con ID:', productId)
    
    // Intentar buscar por ID de documento de Firestore primero
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId)
      const productSnap = await getDoc(productRef)
      
      if (productSnap.exists()) {
        const productData = {
          id: productSnap.id,
          ...productSnap.data()
        }
        console.log('✅ Producto encontrado por ID de documento:', productData.name)
        return {
          product: productData,
          error: null
        }
      }
    } catch (docError) {
      console.log('⚠️ Error al buscar por ID de documento:', docError.message)
    }
    
    // Si no se encuentra, obtener todos los productos y buscar por cualquier campo que coincida
    console.log('⚠️ Buscando en todos los productos...')
    const productsRef = collection(db, PRODUCTS_COLLECTION)
    const querySnapshot = await getDocs(productsRef)
    
    let foundProduct = null
    const allProductIds = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      allProductIds.push({ docId: doc.id, dataId: data.id, name: data.name })
      
      // Buscar por ID de documento (exacto)
      if (doc.id === productId) {
        foundProduct = {
          id: doc.id,
          ...data
        }
        return
      }
      
      // Buscar por campo id numérico si existe
      if (data.id && data.id.toString() === productId.toString()) {
        foundProduct = {
          id: doc.id,
          ...data
        }
        return
      }
      
      // Buscar por nombre como último recurso (si el ID es el nombre)
      if (data.name && data.name.toLowerCase().replace(/\s+/g, '-') === productId.toLowerCase()) {
        foundProduct = {
          id: doc.id,
          ...data
        }
        return
      }
    })
    
    if (foundProduct) {
      console.log('✅ Producto encontrado:', foundProduct.name)
      return {
        product: foundProduct,
        error: null
      }
    }
    
    console.error('❌ Producto no encontrado con ID:', productId)
    console.error('IDs disponibles:', allProductIds.slice(0, 5))
    return { product: null, error: `Producto no encontrado. ID buscado: ${productId}` }
  } catch (error) {
    console.error('❌ Error obteniendo producto:', error)
    console.error('Detalles:', {
      code: error.code,
      message: error.message
    })
    return { product: null, error: `Error al cargar el producto: ${error.message}` }
  }
}

/**
 * Obtiene productos por categoría
 */
export const getProductsByCategory = async (categoryId) => {
  try {
    if (!db) {
      console.error('❌ Firestore no está inicializado')
      return { products: [], error: 'Firebase no está configurado correctamente' }
    }
    
    const productsRef = collection(db, PRODUCTS_COLLECTION)
    // Filtrar por categoría (sin orderBy para evitar necesidad de índice compuesto)
    // Ordenaremos en memoria después
    const q = query(
      productsRef,
      where('category', '==', categoryId)
    )
    
    const querySnapshot = await getDocs(q)
    const products = []
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    // Ordenar por nombre en memoria
    products.sort((a, b) => {
      const nameA = (a.name || '').toLowerCase()
      const nameB = (b.name || '').toLowerCase()
      return nameA.localeCompare(nameB)
    })
    
    console.log(`✅ Productos por categoría "${categoryId}": ${products.length}`)
    
    return { products, error: null }
  } catch (error) {
    console.error('❌ Error obteniendo productos por categoría:', error)
    console.error('Detalles:', {
      code: error.code,
      message: error.message,
      categoryId
    })
    return { products: [], error: `Error al cargar los productos: ${error.message}` }
  }
}

/**
 * Obtiene todas las categorías disponibles
 */
export const getCategories = async () => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION)
    const querySnapshot = await getDocs(productsRef)
    
    const categoriesSet = new Set()
    querySnapshot.forEach((doc) => {
      const category = doc.data().category
      if (category) {
        categoriesSet.add(category)
      }
    })
    
    return { categories: Array.from(categoriesSet), error: null }
  } catch (error) {
    console.error('Error obteniendo categorías:', error)
    return { categories: [], error: 'Error al cargar las categorías' }
  }
}


