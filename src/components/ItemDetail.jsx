import { memo, useCallback, useState } from 'react'
import ItemCount from './ItemCount'

const ItemDetail = memo(function ItemDetail({ product, onAddToCart }) {
  // TODOS LOS HOOKS DEBEN IR PRIMERO, antes de cualquier return condicional
  const [itemAdded, setItemAdded] = useState(false)

  const handleAddToCart = useCallback((quantity) => {
    try {
      if (onAddToCart && product) {
        onAddToCart(product, quantity)
        setItemAdded(true)
      }
    } catch (error) {
      console.error('Error agregando al carrito:', error)
    }
  }, [product, onAddToCart])

  // Validar que product existe DESPUÉS de todos los hooks
  if (!product) {
    return (
      <div className="error-container">
        <p>Error: Producto no disponible</p>
      </div>
    )
  }

  const stock = product.stock || 0
  const price = product.price || 0
  const image = product.image || '/vite.svg'
  const name = product.name || 'Producto sin nombre'
  const category = product.category || 'Sin categoría'
  const description = product.description || 'Sin descripción'

  return (
    <div className="item-detail">
      <div className="item-detail__container">
        <div className="item-detail__image-section">
          <img 
            src={image} 
            alt={name}
            className="item-detail__image"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = 'https://via.placeholder.com/500x500?text=Sin+Imagen'
            }}
          />
        </div>
        
        <div className="item-detail__info-section">
          <h1 className="item-detail__title">{name}</h1>
          <p className="item-detail__category">Categoría: {category}</p>
          <p className="item-detail__price">${price.toLocaleString('es-AR')}</p>
          
          <div className="item-detail__description">
            <h3>Descripción</h3>
            <p>{description}</p>
          </div>

          <div className="item-detail__stock">
            <p>
              {stock > 0 
                ? `Disponible: ${stock} unidades` 
                : 'Sin stock disponible'}
            </p>
          </div>

          {stock > 0 && !itemAdded && (
            <div className="item-detail__actions">
              <ItemCount stock={stock} onAdd={handleAddToCart} />
            </div>
          )}
          {itemAdded && (
            <div className="item-detail__added-message">
              <p>✅ Producto agregado al carrito</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default ItemDetail

