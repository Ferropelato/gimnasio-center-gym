import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { createOrder, processPayment } from '../firebase/orders'
import { getCurrentUser } from '../firebase/auth'

function Cart({ onClose, isOpen }) {
  const { cartItems, cartTotal, updateQuantity, removeItem, clearCart } = useCart()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState(null)
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const handleCheckout = async () => {
    const user = getCurrentUser()
    
    if (!user) {
      setCheckoutError('Debes iniciar sesión para realizar una compra')
      return
    }

    if (cartItems.length === 0) {
      setCheckoutError('El carrito está vacío')
      return
    }

    setCheckoutLoading(true)
    setCheckoutError(null)
    setCheckoutSuccess(false)

    try {
      // Crear la orden
      const items = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))

      const orderData = {
        items,
        total: cartTotal,
        userId: user.uid,
        userEmail: user.email,
        userDisplayName: user.displayName || 'Usuario'
      }

      const orderResult = await createOrder(orderData, user.uid)
      
      if (orderResult.error) {
        setCheckoutError(orderResult.error)
        setCheckoutLoading(false)
        return
      }

      // Guardar el ID de la orden
      setOrderId(orderResult.orderId)

      // Procesar el pago usando Cloud Function
      const paymentResult = await processPayment({
        orderId: orderResult.orderId,
        items,
        total: cartTotal
      })

      if (paymentResult.error) {
        setCheckoutError(paymentResult.error)
        setCheckoutLoading(false)
        return
      }

      // Éxito
      setCheckoutSuccess(true)
      clearCart()
      
      // Cerrar después de 5 segundos para que el usuario vea el ID
      setTimeout(() => {
        onClose()
        setCheckoutSuccess(false)
        setOrderId(null)
      }, 5000)

    } catch (error) {
      console.error('Error en checkout:', error)
      setCheckoutError('Error al procesar la compra. Intenta nuevamente.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Carrito de Compras</h2>
          <button className="cart-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="cart-item__image"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = 'https://via.placeholder.com/100x100?text=Sin+Imagen'
                      }}
                    />
                    <div className="cart-item__info">
                      <h3 className="cart-item__name">{item.name}</h3>
                      <p className="cart-item__price">${item.price.toLocaleString('es-AR')}</p>
                    </div>
                    <div className="cart-item__quantity">
                      <button 
                        className="cart-quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="cart-quantity-value">{item.quantity}</span>
                      <button 
                        className="cart-quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item__subtotal">
                      <p>${(item.price * item.quantity).toLocaleString('es-AR')}</p>
                    </div>
                    <button 
                      className="cart-remove-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="cart-footer">
                <button 
                  className="cart-clear-btn" 
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de vaciar el carrito?')) {
                      clearCart()
                    }
                  }}
                >
                  Vaciar Carrito
                </button>
                <div className="cart-total">
                  <p className="cart-total__label">Total:</p>
                  <p className="cart-total__amount">${cartTotal.toLocaleString('es-AR')}</p>
                </div>
                {checkoutSuccess && (
                  <div className="checkout-success">
                    <p>¡Compra realizada exitosamente! 🎉</p>
                    {orderId && (
                      <p className="order-id">
                        <strong>ID de tu orden:</strong> {orderId}
                      </p>
                    )}
                  </div>
                )}
                {checkoutError && (
                  <div className="checkout-error">
                    {checkoutError}
                  </div>
                )}
                <button 
                  className="cart-checkout-btn"
                  onClick={handleCheckout}
                  disabled={checkoutLoading || cartItems.length === 0}
                >
                  {checkoutLoading ? 'Procesando...' : 'Finalizar Compra'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart

