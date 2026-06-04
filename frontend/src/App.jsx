import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Restaurant from './pages/Restaurant'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restoran/:id" element={<Restaurant />} />
            <Route path="/savat" element={<Cart />} />
            <Route path="/buyurtmalar" element={<Orders />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  )
}
