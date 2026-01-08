import { NavLink, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartWidget from './CartWidget.jsx'

function Navbar({ onCartClick, user, onLoginClick, onLogout }) {
  const { cartCount } = useCart()
  const categories = [
    { id: 'remeras-hombre', label: 'Remeras Hombre' },
    { id: 'remeras-mujer', label: 'Remeras Mujer' },
    { id: 'calzas', label: 'Calzas' },
    { id: 'gorras', label: 'Gorras' },
    { id: 'proteinas', label: 'Proteínas' },
    { id: 'creatina', label: 'Creatina' },
    { id: 'otros', label: 'Otros' }
  ]

  return (
    <header className="navbar">
      <Link to="/" className="navbar__logo">
        <img
          src="/logogym.png"
          alt="Logo"
          className="logo-img"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = '/vite.svg'
          }}
        />
        <span className="logo-text">Center Gym</span>
      </Link>

      <nav className="navbar__links">
        <NavLink to="/" className="nav-link">Inicio</NavLink>
        <NavLink to="/productos" className="nav-link">Productos</NavLink>
        {categories.map(category => (
          <NavLink
            key={category.id}
            to={`/category/${category.id}`}
            className="nav-link"
          >
            {category.label}
          </NavLink>
        ))}
      </nav>

      <div className="navbar__actions">
        {user ? (
          <div className="navbar__user">
            <span className="navbar__user-name">
              {user.displayName || user.email}
            </span>
            <button className="navbar__logout-btn" onClick={onLogout}>
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <button className="navbar__login-btn" onClick={onLoginClick}>
            Iniciar Sesión
          </button>
        )}
        <CartWidget count={cartCount} onClick={onCartClick} />
      </div>
    </header>
  )
}

export default Navbar


