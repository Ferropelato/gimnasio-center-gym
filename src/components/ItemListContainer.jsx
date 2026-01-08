import { useState, useEffect, useMemo, useCallback } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import ItemList from './ItemList'
import { getAllProducts, getProductsByCategory, getCategories } from '../firebase/products'

function ItemListContainer() {
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const { categoryId } = useParams()

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let result
      if (categoryId) {
        result = await getProductsByCategory(categoryId)
      } else {
        result = await getAllProducts()
      }

      // Solo mostrar error si no hay productos Y hay un error
      if (result.error && (!result.products || result.products.length === 0)) {
        setError(result.error)
        setAllProducts([])
      } else if (result.products && result.products.length > 0) {
        // Si hay productos, no mostrar error aunque haya un mensaje de error menor
        setAllProducts(result.products)
        setError(null)
      } else {
        // Si no hay productos y no hay error específico
        setAllProducts([])
        setError('No se encontraron productos')
      }

      // Cargar categorías siempre (necesarias para los filtros)
      try {
        const categoriesResult = await getCategories()
        if (!categoriesResult.error && categoriesResult.categories) {
          setCategories(categoriesResult.categories)
        }
      } catch (catError) {
        console.warn('Error cargando categorías:', catError)
        // No bloquear si falla cargar categorías
      }
    } catch (err) {
      console.error('Error cargando productos:', err)
      setError(`Error al cargar los productos: ${err.message}`)
      setAllProducts([])
    } finally {
      setLoading(false)
    }
  }, [categoryId])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const filteredProducts = useMemo(() => {
    return allProducts
  }, [allProducts])
  
  const categoryNames = {
    'remeras-hombre': 'Remeras Hombre',
    'remeras-mujer': 'Remeras Mujer',
    'calzas': 'Calzas',
    'gorras': 'Gorras',
    'proteinas': 'Proteínas',
    'creatina': 'Creatina',
    'otros': 'Otros'
  }

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando productos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={loadProducts}>Reintentar</button>
      </div>
    )
  }

  return (
    <section className="item-list-container">
      <h1 className="section-title">Catálogo de Productos</h1>
      
      <div className="category-filters">
        <NavLink 
          to="/productos" 
          className={({ isActive }) => `filter-btn ${!categoryId && isActive ? 'active' : ''}`}
          end
        >
          Todos
        </NavLink>
        {categories.map(category => {
          const label = categoryNames[category] || category
          return (
            <NavLink
              key={category}
              to={`/category/${category}`}
              className={({ isActive }) => `filter-btn ${isActive ? 'active' : ''}`}
            >
              {label}
            </NavLink>
          )
        })}
      </div>
      
      <ItemList products={filteredProducts} />
    </section>
  )
}

export default ItemListContainer

