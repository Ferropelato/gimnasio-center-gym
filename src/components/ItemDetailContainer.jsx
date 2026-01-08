import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import ItemDetail from './ItemDetail'
import { getProductById } from '../firebase/products'

function ItemDetailContainer() {
  // TODOS LOS HOOKS DEBEN IR PRIMERO, antes de cualquier return condicional
  const { addToCart } = useCart()
  const { itemId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleAddToCart = useCallback((product, quantity) => {
    addToCart(product, quantity)
  }, [addToCart])

  const loadProduct = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      console.log('📦 ItemDetailContainer: Cargando producto con ID:', itemId)
      const result = await getProductById(itemId)
      
      console.log('📦 ItemDetailContainer: Resultado:', result)
      
      if (result.error || !result.product) {
        console.error('❌ ItemDetailContainer: Error o producto no encontrado:', result.error)
        setError(result.error || 'Producto no encontrado')
      } else {
        console.log('✅ ItemDetailContainer: Producto cargado:', result.product.name)
        setProduct(result.product)
      }
    } catch (err) {
      console.error('❌ ItemDetailContainer: Error cargando producto:', err)
      setError(`Error al cargar el producto: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [itemId])

  useEffect(() => {
    if (itemId) {
      console.log('🔄 ItemDetailContainer: itemId cambió a:', itemId)
      loadProduct()
    } else {
      console.warn('⚠️ ItemDetailContainer: No hay itemId')
      setError('ID de producto no válido')
      setLoading(false)
    }
  }, [itemId, loadProduct])

  // AHORA SÍ, después de todos los hooks, podemos hacer returns condicionales
  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando producto...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={loadProduct}>Reintentar</button>
      </div>
    )
  }

  if (!loading && !product) {
    return (
      <div className="error-container">
        <p>Producto no encontrado</p>
        <button onClick={loadProduct}>Reintentar</button>
      </div>
    )
  }

  return <ItemDetail product={product} onAddToCart={handleAddToCart} />
}

export default ItemDetailContainer

