import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import ShopContainer from './components/ShopContainer.jsx'
import './index.css'

function App() {
  const [cartCount, setCartCount] = useState(0)

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1)
  }

  return (
    <>
      <Navbar cartCount={cartCount} />
      <main className="main-layout">
        <ShopContainer
          greeting="¡Bienvenido a React con Vite!"
          subtext="Próximamente verás el catálogo completo aquí."
          onAddToCart={handleAddToCart}
        />
      </main>
    </>
  )
}

export default App


