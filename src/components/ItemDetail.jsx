import { useState, useRef } from 'react'

function ItemDetail({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1)
  const quantityInputRef = useRef(null)

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1
    if (value >= 1 && value <= product.stock) {
      setQuantity(value)
    }
  }

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleAddToCart = () => {
    onAddToCart(product, quantity)
    setQuantity(1)
  }

  return (
    <div className="item-detail">
      <div className="item-detail__container">
        <div className="item-detail__image-section">
          <img 
            src={product.image} 
            alt={product.name}
            className="item-detail__image"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = 'https://via.placeholder.com/500x500?text=Sin+Imagen'
            }}
          />
        </div>
        
        <div className="item-detail__info-section">
          <h1 className="item-detail__title">{product.name}</h1>
          <p className="item-detail__category">Categoría: {product.category}</p>
          <p className="item-detail__price">${product.price.toLocaleString('es-AR')}</p>
          
          <div className="item-detail__description">
            <h3>Descripción</h3>
            <p>{product.description}</p>
          </div>

          <div className="item-detail__stock">
            <p>
              {product.stock > 0 
                ? `Disponible: ${product.stock} unidades` 
                : 'Sin stock disponible'}
            </p>
          </div>

          {product.stock > 0 && (
            <div className="item-detail__actions">
              <div className="quantity-selector">
                <button 
                  className="quantity-btn" 
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  ref={quantityInputRef}
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="quantity-input"
                />
                <button 
                  className="quantity-btn" 
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                Agregar al Carrito
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ItemDetail

