import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { RESTAURANTS, MENU_ITEMS, formatPrice } from '../data'
import { useCart } from '../context/CartContext'

export default function Restaurant() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { items, addItem, removeItem } = useCart()
  const [activeCategory, setActiveCategory] = useState('all')

  const restaurant = RESTAURANTS.find(r => r.id === Number(id))
  const menu = MENU_ITEMS[Number(id)] || []

  if (!restaurant) return (
    <div className="empty-state" style={{ paddingTop: 100 }}>
      <div className="icon">😕</div>
      <h3>Restoran topilmadi</h3>
      <button onClick={() => navigate('/')} style={{
        marginTop: 16, background: 'var(--primary)', color: '#fff',
        padding: '12px 28px', borderRadius: 12, fontSize: 15
      }}>Orqaga</button>
    </div>
  )

  const categories = ['all', ...new Set(menu.map(m => m.category))]
  const filtered = activeCategory === 'all' ? menu : menu.filter(m => m.category === activeCategory)

  const getQty = (itemId) => {
    const f = items.find(i => i.id === itemId)
    return f ? f.qty : 0
  }

  return (
    <div className="page-enter">
      {/* Header */}
      <div style={{
        background: restaurant.color,
        padding: '40px 20px 30px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <button onClick={() => navigate(-1)} style={{
          position: 'absolute', top: 20, left: 20,
          background: '#fff', color: 'var(--dark)',
          padding: '8px 16px', borderRadius: 10, fontSize: 14,
          border: '1.5px solid var(--gray-border)'
        }}>← Orqaga</button>

        <div style={{ fontSize: 80, marginBottom: 12 }}>{restaurant.image}</div>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>{restaurant.name}</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', fontSize: 14, color: 'var(--dark-soft)' }}>
          <span>⭐ {restaurant.rating} ({restaurant.reviewCount} sharh)</span>
          <span>🕐 {restaurant.deliveryTime} daq</span>
          <span>🛵 {formatPrice(restaurant.deliveryFee)}</span>
          <span>📍 {restaurant.address}</span>
          <span style={{
            color: restaurant.isOpen ? 'var(--green-dark)' : 'var(--gray)',
            fontWeight: 700
          }}>{restaurant.isOpen ? '● Ochiq' : '● Yopiq'}</span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>
        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 24 }}>
          {categories.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)} style={{
              padding: '8px 18px',
              borderRadius: 40, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
              background: activeCategory === c ? 'var(--primary)' : 'var(--gray-light)',
              color: activeCategory === c ? '#fff' : 'var(--dark-soft)',
              border: 'none', transition: 'all 0.2s'
            }}>
              {c === 'all' ? 'Barchasi' : c}
            </button>
          ))}
        </div>

        {/* Popular items highlight */}
        {activeCategory === 'all' && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              🔥 Mashhur taomlar
            </h2>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
              {menu.filter(m => m.popular).map(item => {
                const qty = getQty(item.id)
                return (
                  <div key={item.id} style={{
                    minWidth: 200, background: '#fff',
                    border: '2px solid var(--primary-light)',
                    borderRadius: 16, padding: 16,
                    flexShrink: 0
                  }}>
                    <div style={{ fontSize: 44, textAlign: 'center', marginBottom: 8 }}>{item.emoji}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: 'var(--dark)' }}>{item.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 800, marginBottom: 10 }}>
                      {formatPrice(item.price)}
                    </div>
                    {qty === 0 ? (
                      <button onClick={() => addItem(item, restaurant.id)} style={{
                        width: '100%', background: 'var(--primary)', color: '#fff',
                        padding: '8px', borderRadius: 10, fontSize: 13
                      }}>+ Qo'shish</button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                        <button onClick={() => removeItem(item.id)} style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: 'var(--primary-light)', color: 'var(--primary)',
                          fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>−</button>
                        <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--dark)' }}>{qty}</span>
                        <button onClick={() => addItem(item, restaurant.id)} style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: 'var(--primary)', color: '#fff',
                          fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>+</button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Full menu */}
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>
          {activeCategory === 'all' ? 'Barcha taomlar' : activeCategory}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(item => {
            const qty = getQty(item.id)
            return (
              <div key={item.id} style={{
                background: '#fff',
                borderRadius: 16,
                padding: '16px 20px',
                border: qty > 0 ? '2px solid var(--primary)' : '1.5px solid var(--gray-border)',
                display: 'flex', alignItems: 'center', gap: 16,
                transition: 'border-color 0.2s'
              }}>
                <div style={{ fontSize: 52, flexShrink: 0 }}>{item.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--dark)' }}>{item.name}</span>
                    {item.popular && (
                      <span style={{
                        background: 'var(--primary-light)', color: 'var(--primary)',
                        fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 700
                      }}>🔥 Mashhur</span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 4 }}>{item.desc}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray)' }}>🕐 {item.time}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--primary)', marginBottom: 10 }}>
                    {formatPrice(item.price)}
                  </div>
                  {qty === 0 ? (
                    <button onClick={() => addItem(item, restaurant.id)} style={{
                      background: 'var(--primary)', color: '#fff',
                      padding: '8px 20px', borderRadius: 10, fontSize: 14
                    }}>+ Qo'shish</button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button onClick={() => removeItem(item.id)} style={{
                        width: 34, height: 34, borderRadius: 8,
                        background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 20
                      }}>−</button>
                      <span style={{ fontWeight: 800, fontSize: 18, minWidth: 20, textAlign: 'center' }}>{qty}</span>
                      <button onClick={() => addItem(item, restaurant.id)} style={{
                        width: 34, height: 34, borderRadius: 8,
                        background: 'var(--primary)', color: '#fff', fontSize: 20
                      }}>+</button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
