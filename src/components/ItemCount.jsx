import { useState, useEffect } from 'react'

function ItemCount({ stock = 0, initial = 1, onAdd }) {
  // Validar que stock sea un número válido
  const validStock = typeof stock === 'number' && stock > 0 ? stock : 0
  const validInitial = typeof initial === 'number' && initial > 0 ? initial : 1
  const [quantity, setQuantity] = useState(Math.min(validInitial, validStock || 1))

  useEffect(() => {
    setQuantity(Math.min(validInitial, validStock || 1))
  }, [validInitial, validStock])

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10) || validInitial
    if (value >= 1 && value <= validStock) {
      setQuantity(value)
    }
  }

  const increment = () => {
    if (quantity < validStock) {
      setQuantity(quantity + 1)
    }
  }

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleAdd = () => {
    if (validStock > 0 && onAdd) {
      try {
        onAdd(quantity)
      } catch (error) {
        console.error('Error en handleAdd:', error)
      }
    }
  }

  return (
    <div className="item-count">
      <div className="quantity-selector">
        <button
          type="button"
          className="quantity-btn"
          onClick={decrement}
          disabled={quantity <= 1}
        >
          -
        </button>
        <input
          type="number"
          min="1"
          max={validStock}
          value={quantity}
          onChange={handleChange}
          className="quantity-input"
        />
        <button
          type="button"
          className="quantity-btn"
          onClick={increment}
          disabled={quantity >= validStock}
        >
          +
        </button>
      </div>
      <button
        type="button"
        className="add-to-cart-btn"
        onClick={handleAdd}
        disabled={validStock < 1}
      >
        Agregar al Carrito
      </button>
    </div>
  )
}

export default ItemCount





