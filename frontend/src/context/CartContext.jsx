import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tez-cart') || '[]')
    } catch { return [] }
  })
  const [restaurantId, setRestaurantId] = useState(() =>
    localStorage.getItem('tez-cart-restaurant') || null
  )

  useEffect(() => {
    localStorage.setItem('tez-cart', JSON.stringify(items))
    if (restaurantId) localStorage.setItem('tez-cart-restaurant', restaurantId)
    else localStorage.removeItem('tez-cart-restaurant')
  }, [items, restaurantId])

  const addItem = (item, restId) => {
    if (restaurantId && restaurantId !== String(restId)) {
      if (!window.confirm('Boshqa restoran. Savatni tozalash kerakmi?')) return
      setItems([])
    }
    setRestaurantId(String(restId))
    setItems(prev => {
      const ex = prev.find(i => i.id === item.id)
      if (ex) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const removeItem = (id) => {
    setItems(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0)
      if (updated.length === 0) setRestaurantId(null)
      return updated
    })
  }

  const clearCart = () => {
    setItems([])
    setRestaurantId(null)
  }

  const totalItems = items.reduce((s, i) => s + i.qty, 0)
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, restaurantId, addItem, removeItem, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
