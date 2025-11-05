import CartWidget from './CartWidget.jsx'

function Navbar({ cartCount }) {
  return (
    <header className="navbar">
      <div className="navbar__logo">
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
      </div>

      <nav className="navbar__links">
        <a href="#home">Home</a>
        <a href="#equipos">Equipos</a>
        <a href="#planes">Planes</a>
      </nav>

      <CartWidget count={cartCount} />
    </header>
  )
}

export default Navbar


