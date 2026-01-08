import { memo } from 'react'
import ItemCard from './ItemCard'

const ItemList = memo(function ItemList({ products }) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>No se encontraron productos en esta categoría.</p>
      </div>
    )
  }

  return (
    <div className="item-grid">
      {products.map((product) => (
        <ItemCard key={product.id} product={product} />
      ))}
    </div>
  )
})

export default ItemList

