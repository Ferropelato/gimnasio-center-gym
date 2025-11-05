import { useEffect } from 'react'

function ShopContainer({ greeting, subtext, onAddToCart }) {
  useEffect(() => {
    // Montaje del contenedor
    // Aquí podrías cargar productos en el futuro
  }, [])

  return (
    <section className="shop-container" id="home">
      <h1 className="welcome-title">{greeting}</h1>
      {subtext && <p>{subtext}</p>}

      <div className="future-box">
        <p>Aquí irá el catálogo (cards, filtros, etc.).</p>
      </div>

      <button className="primary-btn" onClick={onAddToCart}>
        Agregar producto de prueba al carrito
      </button>
    </section>
  )
}

export default ShopContainer


