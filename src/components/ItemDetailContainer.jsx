import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ItemDetail from './ItemDetail'
import { getProductById } from '../data/products'

function ItemDetailContainer({ onAddToCart }) {
  const { itemId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const loadProduct = new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundProduct = getProductById(itemId)
        if (foundProduct) {
          resolve(foundProduct)
        } else {
          reject(new Error('Producto no encontrado'))
        }
      }, 500)
    })

    loadProduct
      .then((data) => {
        setProduct(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [itemId])

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando producto...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <p>Error: {error || 'Producto no encontrado'}</p>
      </div>
    )
  }

  return <ItemDetail product={product} onAddToCart={onAddToCart} />
}

export default ItemDetailContainer

