import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ShopContainer from './components/ShopContainer.jsx'
import ItemListContainer from './components/ItemListContainer.jsx'
import ItemDetailContainer from './components/ItemDetailContainer.jsx'
import Cart from './components/Cart.jsx'
import './index.css'

function App() {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const handleAddToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === product.id)
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity
        if (newQuantity > product.stock) {
          return prevItems
        }
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        )
      } else {
        return [...prevItems, { ...product, quantity }]
      }
    })
    setIsCartOpen(true)
  }

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return
    
    setCartItems((prevItems) => {
      const item = prevItems.find(item => item.id === productId)
      if (!item || newQuantity > item.stock) return prevItems
      
      return prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    })
  }

  const handleRemoveItem = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId))
  }

  const handleClearCart = () => {
    setCartItems([])
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <BrowserRouter>
      <Navbar cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
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
            path="/item/:itemId" 
            element={<ItemDetailContainer onAddToCart={handleAddToCart} />} 
          />
        </Routes>
      </main>
      <Cart
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onClose={() => setIsCartOpen(false)}
        isOpen={isCartOpen}
      />
    </BrowserRouter>
  )
}

export default App


