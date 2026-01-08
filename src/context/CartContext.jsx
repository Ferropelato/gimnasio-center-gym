import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const CartContext = createContext(null)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  const addToCart = useCallback((product, quantity = 1) => {
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
  }, [])

  const updateQuantity = useCallback((productId, newQuantity) => {
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
  }, [])

  const removeItem = useCallback((productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId))
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }, [cartItems])

  const cartTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      return acc + (item.price * item.quantity)
    }, 0)
  }, [cartItems])

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

