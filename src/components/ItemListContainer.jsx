import { useState, useEffect } from 'react'
import ItemCard from './ItemCard'
import { products as productsData, getCategories } from '../data/products'

function ItemListContainer() {
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    
    const loadProducts = new Promise((resolve) => {
      setTimeout(() => {
        resolve(productsData)
      }, 500)
    })

    loadProducts
      .then((data) => {
        setAllProducts(data)
        setFilteredProducts(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error cargando productos:', error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (selectedCategory === '') {
      setFilteredProducts(allProducts)
    } else {
      const filtered = allProducts.filter(product => product.category === selectedCategory)
      setFilteredProducts(filtered)
    }
  }, [selectedCategory, allProducts])

  const categories = getCategories()
  
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

  return (
    <section className="item-list-container">
      <h1 className="section-title">Catálogo de Productos</h1>
      
      <div className="category-filters">
        <button 
          className={`filter-btn ${selectedCategory === '' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('')}
        >
          Todos
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {categoryNames[category] || category}
          </button>
        ))}
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron productos en esta categoría.</p>
        </div>
      ) : (
        <div className="item-grid">
          {filteredProducts.map((product) => (
            <ItemCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}

export default ItemListContainer

