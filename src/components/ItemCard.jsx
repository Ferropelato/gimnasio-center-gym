import { Link } from 'react-router-dom'

function ItemCard({ product }) {
  return (
    <div className="item-card">
      <Link to={`/item/${product.id}`} className="item-card__link">
        <div className="item-card__image-container">
          <img 
            src={product.image} 
            alt={product.name}
            className="item-card__image"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Sin+Imagen'
            }}
          />
        </div>
        <div className="item-card__info">
          <h3 className="item-card__title">{product.name}</h3>
          <p className="item-card__price">${product.price.toLocaleString('es-AR')}</p>
          <p className="item-card__stock">
            {product.stock > 0 
              ? `Stock: ${product.stock} unidades` 
              : 'Sin stock'}
          </p>
        </div>
      </Link>
    </div>
  )
}

export default ItemCard

