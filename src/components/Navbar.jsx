import { Link } from 'react-router-dom'
import CartWidget from './CartWidget.jsx'

function Navbar({ cartCount, onCartClick }) {
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
        <Link to="/" className="nav-link">Inicio</Link>
        <Link to="/productos" className="nav-link">Productos</Link>
      </nav>

      <CartWidget count={cartCount} onClick={onCartClick} />
    </header>
  )
}

export default Navbar


