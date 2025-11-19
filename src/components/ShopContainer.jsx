import { Link } from 'react-router-dom'

function ShopContainer() {
  return (
    <section className="shop-container" id="home">
      <h1 className="welcome-title">Bienvenidos a Red de gimnasios Center Gym</h1>
      <p className="welcome-subtext">Tu destino para equipamiento y suplementos de calidad</p>
      
      <Link to="/productos" className="primary-btn">
        Ver Catálogo de Productos
      </Link>
    </section>
  )
}

export default ShopContainer


