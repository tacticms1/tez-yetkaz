import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice, STATUS_MAP, RESTAURANTS } from '../data'

const STEPS = ['confirmed', 'preparing', 'on_way', 'delivered']

function StatusStepper({ status }) {
  const idx = STEPS.indexOf(status)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, margin: '16px 0' }}>
      {STEPS.map((s, i) => {
        const info = STATUS_MAP[s]
        const done = i <= idx
        const active = i === idx
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: done ? 'var(--primary)' : 'var(--gray-light)',
                color: done ? '#fff' : 'var(--gray)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
                border: active ? '3px solid var(--primary-dark)' : 'none',
                transition: 'all 0.3s'
              }}>{info.emoji}</div>
              <span style={{ fontSize: 10, color: done ? 'var(--primary)' : 'var(--gray)', fontWeight: done ? 700 : 400, whiteSpace: 'nowrap' }}>
                {info.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 3, marginBottom: 20,
                background: i < idx ? 'var(--primary)' : 'var(--gray-border)',
                transition: 'background 0.3s'
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function OrderCard({ order, onStatusChange }) {
  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending
  const restaurant = RESTAURANTS.find(r => r.id === Number(order.restaurantId))
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{
      background: '#fff',
      borderRadius: 20, padding: 20,
      border: `2px solid ${order.status === 'delivered' ? '#C8FAD6' : order.status === 'cancelled' ? '#FFE4E4' : 'var(--gray-border)'}`,
      marginBottom: 16
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 28 }}>{restaurant?.image || '🍽️'}</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17 }}>{order.restaurantName}</div>
              <div style={{ fontSize: 12, color: 'var(--gray)' }}>
                #{String(order.id).slice(-6)} · {new Date(order.createdAt).toLocaleString('uz-UZ')}
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`badge badge-${statusInfo.color === 'green' ? 'green' : statusInfo.color === 'red' ? 'red' : 'orange'}`}>
            {statusInfo.emoji} {statusInfo.label}
          </span>
          <button onClick={() => setExpanded(!expanded)} style={{
            background: 'var(--gray-light)', color: 'var(--gray)',
            padding: '6px 12px', borderRadius: 8, fontSize: 12
          }}>{expanded ? '▲' : '▼'}</button>
        </div>
      </div>

      {/* Status stepper (only for active orders) */}
      {!['delivered', 'cancelled'].includes(order.status) && (
        <StatusStepper status={order.status} />
      )}

      {/* Summary */}
      <div style={{ fontSize: 14, color: 'var(--gray)' }}>
        {order.items.length} ta mahsulot · {formatPrice(order.total)}
        {order.status === 'on_way' && <span style={{ color: 'var(--green-dark)', fontWeight: 700 }}> · 🛵 Yo'lda, 10-15 daqiqa qoldi!</span>}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{ marginTop: 16, borderTop: '1.5px solid var(--gray-border)', paddingTop: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span>{item.emoji} {item.name} × {item.qty}</span>
                <span style={{ fontWeight: 700 }}>{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: 'var(--gray)', borderTop: '1px dashed var(--gray-border)', paddingTop: 10 }}>
            <div>📍 {order.address}</div>
            <div>📞 {order.phone}</div>
            {order.comment && <div>💬 {order.comment}</div>}
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontWeight: 900, fontSize: 16, color: 'var(--primary)',
            marginTop: 10, paddingTop: 10, borderTop: '1.5px solid var(--gray-border)'
          }}>
            <span>Jami:</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      )}

      {/* Admin: advance status */}
      {!['delivered', 'cancelled'].includes(order.status) && (
        <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {STEPS.indexOf(order.status) < STEPS.length - 1 && (
            <button onClick={() => onStatusChange(order.id, STEPS[STEPS.indexOf(order.status) + 1])}
              style={{
                background: 'var(--primary-light)', color: 'var(--primary)',
                padding: '8px 16px', borderRadius: 10, fontSize: 13
              }}>
              ▶ Keyingi bosqich
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const load = () => {
      const data = JSON.parse(localStorage.getItem('tez-orders') || '[]')
      setOrders(data)
    }
    load()
    const t = setInterval(load, 3000)
    return () => clearInterval(t)
  }, [])

  const handleStatusChange = (orderId, newStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    setOrders(updated)
    localStorage.setItem('tez-orders', JSON.stringify(updated))
  }

  const filters = [
    { id: 'all', label: 'Barchasi' },
    { id: 'active', label: 'Faol' },
    { id: 'delivered', label: 'Yetkazildi' },
  ]

  const filtered = orders.filter(o => {
    if (filter === 'active') return !['delivered', 'cancelled'].includes(o.status)
    if (filter === 'delivered') return o.status === 'delivered'
    return true
  })

  return (
    <div className="page-enter" style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>📋 Buyurtmalarim</h1>

      {orders.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: '8px 18px', borderRadius: 40, fontSize: 13, fontWeight: 700,
              background: filter === f.id ? 'var(--primary)' : 'var(--gray-light)',
              color: filter === f.id ? '#fff' : 'var(--dark-soft)',
              border: 'none', transition: 'all 0.2s'
            }}>{f.label}</button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📋</div>
          <h3>Buyurtmalar yo'q</h3>
          <p>Hali hech narsa buyurtma qilmadingiz</p>
          <Link to="/">
            <button style={{
              marginTop: 20, background: 'var(--primary)', color: '#fff',
              padding: '12px 28px', borderRadius: 12, fontSize: 15
            }}>Buyurtma berish</button>
          </Link>
        </div>
      ) : (
        filtered.map(order => (
          <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
        ))
      )}
    </div>
  )
}
