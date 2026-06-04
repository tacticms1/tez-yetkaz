import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { RESTAURANTS, formatPrice } from '../data'

export default function Cart() {
  const { items, addItem, removeItem, clearCart, totalPrice, restaurantId } = useCart()
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [placing, setPlacing] = useState(false)

  const restaurant = RESTAURANTS.find(r => r.id === Number(restaurantId))
  const deliveryFee = restaurant?.deliveryFee || 0
  const total = totalPrice + deliveryFee

  const placeOrder = async () => {
    if (!address.trim() || !phone.trim()) {
      alert("Iltimos, manzil va telefon raqamini kiriting!")
      return
    }
    setPlacing(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500))

    const orderId = Date.now()
    const order = {
      id: orderId,
      restaurantId: Number(restaurantId),
      restaurantName: restaurant?.name,
      items: items.map(i => ({ ...i })),
      address,
      phone,
      comment,
      subtotal: totalPrice,
      deliveryFee,
      total,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }

    const existing = JSON.parse(localStorage.getItem('tez-orders') || '[]')
    localStorage.setItem('tez-orders', JSON.stringify([order, ...existing]))
    clearCart()
    navigate('/buyurtmalar')
  }

  if (items.length === 0) return (
    <div style={{ maxWidth: 500, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 80, marginBottom: 20 }}>🛒</div>
      <h2 style={{ fontSize: 24, marginBottom: 12 }}>Savat bo'sh</h2>
      <p style={{ color: 'var(--gray)', marginBottom: 28 }}>Restoranlardan taom tanlang</p>
      <Link to="/">
        <button style={{
          background: 'var(--primary)', color: '#fff',
          padding: '14px 36px', borderRadius: 14, fontSize: 16
        }}>Restoranlarni ko'rish</button>
      </Link>
    </div>
  )

  return (
    <div className="page-enter" style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontSize: 28, marginBottom: 28 }}>🛒 Savat</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>

        {/* Left: Items */}
        <div>
          {restaurant && (
            <div style={{
              background: restaurant.color,
              borderRadius: 16, padding: '14px 18px',
              marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12
            }}>
              <span style={{ fontSize: 36 }}>{restaurant.image}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17 }}>{restaurant.name}</div>
                <div style={{ fontSize: 13, color: 'var(--gray)' }}>
                  🛵 {formatPrice(restaurant.deliveryFee)} yetkazib berish · Min. {formatPrice(restaurant.minOrder || 0)}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map(item => (
              <div key={item.id} style={{
                background: '#fff', borderRadius: 14, padding: '14px 16px',
                border: '1.5px solid var(--gray-border)',
                display: 'flex', alignItems: 'center', gap: 14
              }}>
                <span style={{ fontSize: 44 }}>{item.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{item.name}</div>
                  <div style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 800 }}>
                    {formatPrice(item.price)} × {item.qty} = {formatPrice(item.price * item.qty)}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => removeItem(item.id)} style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 18
                  }}>−</button>
                  <span style={{ fontWeight: 800, fontSize: 17, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                  <button onClick={() => addItem(item, restaurantId)} style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'var(--primary)', color: '#fff', fontSize: 18
                  }}>+</button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={clearCart} style={{
            marginTop: 14, background: 'var(--gray-light)', color: 'var(--gray)',
            padding: '10px 20px', borderRadius: 10, fontSize: 13
          }}>🗑️ Savatni tozalash</button>
        </div>

        {/* Right: Order form */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: 24,
          border: '1.5px solid var(--gray-border)',
          position: 'sticky', top: 80
        }}>
          <h3 style={{ fontSize: 20, marginBottom: 20 }}>📝 Buyurtma ma'lumotlari</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray)', display: 'block', marginBottom: 6 }}>
                📍 Yetkazib berish manzili *
              </label>
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Ko'cha, uy raqami, kvartira"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10,
                  border: '1.5px solid var(--gray-border)', fontSize: 14
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray)', display: 'block', marginBottom: 6 }}>
                📞 Telefon raqami *
              </label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10,
                  border: '1.5px solid var(--gray-border)', fontSize: 14
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray)', display: 'block', marginBottom: 6 }}>
                💬 Izoh (ixtiyoriy)
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Kuryerga izoh..."
                rows={2}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10,
                  border: '1.5px solid var(--gray-border)', fontSize: 14, resize: 'none'
                }}
              />
            </div>
          </div>

          {/* Price summary */}
          <div style={{ borderTop: '1.5px solid var(--gray-border)', marginTop: 20, paddingTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
              <span style={{ color: 'var(--gray)' }}>Taomlar narxi</span>
              <span style={{ fontWeight: 700 }}>{formatPrice(totalPrice)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 12 }}>
              <span style={{ color: 'var(--gray)' }}>Yetkazib berish</span>
              <span style={{ fontWeight: 700 }}>{formatPrice(deliveryFee)}</span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 20, fontWeight: 900, color: 'var(--primary)',
              marginBottom: 20
            }}>
              <span>Jami</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button onClick={placeOrder} disabled={placing} style={{
              width: '100%', background: placing ? 'var(--gray)' : 'var(--primary)',
              color: '#fff', padding: '16px', borderRadius: 14, fontSize: 17
            }}>
              {placing ? '⏳ Yuborilmoqda...' : '✅ Buyurtma berish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
