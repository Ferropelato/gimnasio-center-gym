// Firestore Orders Service
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { db, functions } from './config'

const ORDERS_COLLECTION = 'orders'

/**
 * Crea una nueva orden de compra
 */
export const createOrder = async (orderData, userId) => {
  try {
    const orderRef = collection(db, ORDERS_COLLECTION)
    
    const order = {
      ...orderData,
      userId,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    const docRef = await addDoc(orderRef, order)
    return { orderId: docRef.id, error: null }
  } catch (error) {
    console.error('Error creando orden:', error)
    return { orderId: null, error: 'Error al crear la orden' }
  }
}

/**
 * Obtiene las órdenes de un usuario
 */
export const getUserOrders = async (userId) => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION)
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    )
    
    const querySnapshot = await getDocs(q)
    const orders = []
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return { orders, error: null }
  } catch (error) {
    console.error('Error obteniendo órdenes:', error)
    return { orders: [], error: 'Error al cargar las órdenes' }
  }
}

/**
 * Procesa el pago de una orden usando Cloud Function
 */
export const processPayment = async (orderData) => {
  try {
    const processPaymentFunction = httpsCallable(functions, 'processPayment')
    const result = await processPaymentFunction(orderData)
    return { result: result.data, error: null }
  } catch (error) {
    console.error('Error procesando pago:', error)
    return { result: null, error: error.message || 'Error al procesar el pago' }
  }
}


