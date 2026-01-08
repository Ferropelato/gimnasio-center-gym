// Cloud Functions for Firebase
const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

const db = admin.firestore()

/**
 * Procesa el pago de una orden
 * Esta función simula el procesamiento de pago y actualiza el stock de productos
 */
exports.processPayment = functions.https.onCall(async (data, context) => {
  // Verificar autenticación
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'El usuario debe estar autenticado'
    )
  }

  const { orderId, items, total } = data

  try {
    // Validar datos
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'La orden debe contener items'
      )
    }

    // Verificar stock disponible
    const batch = db.batch()
    const productsRef = db.collection('products')

    for (const item of items) {
      const productRef = productsRef.doc(item.id)
      const productDoc = await productRef.get()

      if (!productDoc.exists) {
        throw new functions.https.HttpsError(
          'not-found',
          `Producto ${item.id} no encontrado`
        )
      }

      const productData = productDoc.data()
      const newStock = productData.stock - item.quantity

      if (newStock < 0) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          `Stock insuficiente para ${productData.name}`
        )
      }

      // Actualizar stock
      batch.update(productRef, { stock: newStock })
    }

    // Actualizar estado de la orden
    if (orderId) {
      const orderRef = db.collection('orders').doc(orderId)
      batch.update(orderRef, {
        status: 'paid',
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      })
    }

    // Ejecutar todas las actualizaciones
    await batch.commit()

    return {
      success: true,
      message: 'Pago procesado exitosamente',
      orderId
    }
  } catch (error) {
    console.error('Error procesando pago:', error)
    
    if (error instanceof functions.https.HttpsError) {
      throw error
    }

    throw new functions.https.HttpsError(
      'internal',
      'Error al procesar el pago'
    )
  }
})

/**
 * Obtiene estadísticas del inventario
 * Solo accesible para usuarios autenticados
 */
exports.getInventoryStats = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'El usuario debe estar autenticado'
    )
  }

  try {
    const productsSnapshot = await db.collection('products').get()
    
    const stats = {
      totalProducts: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0,
      totalStock: 0,
      categories: {}
    }

    productsSnapshot.forEach((doc) => {
      const product = doc.data()
      stats.totalProducts++
      stats.totalStock += product.stock || 0

      if ((product.stock || 0) === 0) {
        stats.outOfStockProducts++
      } else if ((product.stock || 0) < 5) {
        stats.lowStockProducts++
      }

      const category = product.category || 'uncategorized'
      stats.categories[category] = (stats.categories[category] || 0) + 1
    })

    return stats
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    throw new functions.https.HttpsError(
      'internal',
      'Error al obtener estadísticas'
    )
  }
})

/**
 * Envía email de confirmación de orden (requiere configuración adicional)
 * Esta función puede ser expandida con nodemailer o SendGrid
 */
exports.sendOrderConfirmation = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const orderData = snap.data()

    // Aquí puedes agregar lógica para enviar emails
    // Ejemplo con SendGrid o nodemailer
    
    console.log('Nueva orden creada:', context.params.orderId)
    console.log('Datos de la orden:', orderData)

    return null
  })


