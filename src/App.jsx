import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import Navbar from './components/Navbar.jsx'
import ShopContainer from './components/ShopContainer.jsx'
import ItemListContainer from './components/ItemListContainer.jsx'
import ItemDetailContainer from './components/ItemDetailContainer.jsx'
import Cart from './components/Cart.jsx'
import Login from './components/Auth/Login.jsx'
import Register from './components/Auth/Register.jsx'
import { onAuthChange, logoutUser } from './firebase/auth'
import './index.scss'

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'register'

  // Autenticación
  useEffect(() => {
    try {
      // Verificar que onAuthChange esté disponible
      if (typeof onAuthChange === 'function') {
        const unsubscribe = onAuthChange((currentUser) => {
          setUser(currentUser)
          setAuthLoading(false)
        })

        // Timeout de seguridad: si después de 2 segundos no hay respuesta, continuar de todas formas
        const timeout = setTimeout(() => {
          setAuthLoading(false)
        }, 2000)

        return () => {
          clearTimeout(timeout)
          if (typeof unsubscribe === 'function') {
            unsubscribe()
          }
        }
      } else {
        // Si onAuthChange no está disponible, continuar sin autenticación
        console.warn('⚠️ onAuthChange no está disponible, continuando sin autenticación')
        setAuthLoading(false)
      }
    } catch (error) {
      console.error('Error en autenticación:', error)
      setAuthLoading(false)
    }
  }, [])

  const handleLogout = useCallback(async () => {
    const result = await logoutUser()
    if (result.error) {
      console.error('Error al cerrar sesión:', result.error)
    }
  }, [])

  if (authLoading) {
    return (
      <div className="loading-container">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <CartProvider>
        <BrowserRouter>
          <Navbar 
            onCartClick={() => setIsCartOpen(true)}
            user={user}
            onLoginClick={() => {
              setAuthMode('login')
              setShowAuth(true)
            }}
            onLogout={handleLogout}
          />
          <main className="main-layout">
            <Routes>
              <Route 
                path="/" 
                element={<ShopContainer />} 
              />
              <Route 
                path="/productos" 
                element={<ItemListContainer />} 
              />
              <Route 
                path="/category/:categoryId" 
                element={<ItemListContainer />} 
              />
              <Route 
                path="/item/:itemId" 
                element={<ItemDetailContainer />} 
              />
            </Routes>
          </main>
          <Cart
            onClose={() => setIsCartOpen(false)}
            isOpen={isCartOpen}
          />
          {showAuth && authMode === 'login' && (
            <Login 
              onClose={() => setShowAuth(false)}
              onSwitchToRegister={() => setAuthMode('register')}
            />
          )}
          {showAuth && authMode === 'register' && (
            <Register 
              onClose={() => setShowAuth(false)}
              onSwitchToLogin={() => setAuthMode('login')}
            />
          )}
        </BrowserRouter>
      </CartProvider>
    </ErrorBoundary>
  )
}

export default App


