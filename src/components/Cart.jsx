import { useState, useEffect } from 'react'

function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart, onClose, isOpen }) {
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const calculateTotal = () => {
      const sum = cartItems.reduce((acc, item) => {
        return acc + (item.price * item.quantity)
      }, 0)
      setTotal(sum)
    }
    calculateTotal()
  }, [cartItems])

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
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="cart-quantity-value">{item.quantity}</span>
                      <button 
                        className="cart-quantity-btn"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
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
                      onClick={() => onRemoveItem(item.id)}
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
                      onClearCart()
                    }
                  }}
                >
                  Vaciar Carrito
                </button>
                <div className="cart-total">
                  <p className="cart-total__label">Total:</p>
                  <p className="cart-total__amount">${total.toLocaleString('es-AR')}</p>
                </div>
                <button className="cart-checkout-btn">
                  Finalizar Compra
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

