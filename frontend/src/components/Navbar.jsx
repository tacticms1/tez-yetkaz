import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { totalItems } = useCart()
  const loc = useLocation()

  const links = [
    { to: '/', label: 'Bosh sahifa', emoji: '🏠' },
    { to: '/buyurtmalar', label: 'Buyurtmalar', emoji: '📋' },
    { to: '/admin', label: 'Admin', emoji: '⚙️' },
  ]

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1.5px solid #FEE2E2',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 12px rgba(255,71,87,0.08)'
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <span style={{ fontSize: 32 }}>🛵</span>
          <div>
            <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 22, color: 'var(--primary)', lineHeight: 1 }}>
              TezYetkaz
            </div>
            <div style={{ fontSize: 10, color: 'var(--gray)', fontWeight: 500 }}>Tez va Mazali</div>
          </div>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding: '8px 16px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              color: loc.pathname === l.to ? 'var(--primary)' : 'var(--dark-soft)',
              background: loc.pathname === l.to ? 'var(--primary-light)' : 'transparent',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.2s',
              textDecoration: 'none'
            }}>
              <span>{l.emoji}</span>
              <span>{l.label}</span>
            </Link>
          ))}
        </div>

        {/* Cart */}
        <Link to="/savat" style={{ textDecoration: 'none' }}>
          <button style={{
            background: totalItems > 0 ? 'var(--primary)' : 'var(--gray-light)',
            color: totalItems > 0 ? '#fff' : 'var(--gray)',
            padding: '10px 20px',
            borderRadius: 12,
            fontSize: 14,
            display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all 0.2s'
          }}>
            <span>🛒</span>
            <span>Savat</span>
            {totalItems > 0 && (
              <span style={{
                background: '#fff',
                color: 'var(--primary)',
                width: 22, height: 22,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 900
              }}>{totalItems}</span>
            )}
          </button>
        </Link>
      </div>
    </nav>
  )
}
