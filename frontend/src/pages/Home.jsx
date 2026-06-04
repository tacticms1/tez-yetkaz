import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { RESTAURANTS, CATEGORIES, formatPrice } from '../data'

function RestaurantCard({ r }) {
  return (
    <Link to={`/restoran/${r.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        border: '1.5px solid var(--gray-border)',
        transition: 'all 0.25s',
        cursor: 'pointer',
        opacity: r.isOpen ? 1 : 0.6
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = 'var(--shadow-hover)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}>
        {/* Image area */}
        <div style={{
          height: 140,
          background: r.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 72,
          position: 'relative'
        }}>
          {r.image}
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: r.isOpen ? '#E8FAF0' : '#F5F5F5',
            color: r.isOpen ? 'var(--green-dark)' : 'var(--gray)',
            padding: '4px 10px', borderRadius: 20,
            fontSize: 11, fontWeight: 700,
            fontFamily: 'Nunito'
          }}>
            {r.isOpen ? '● Ochiq' : '● Yopiq'}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '14px 16px' }}>
          <h3 style={{ fontSize: 17, marginBottom: 4, color: 'var(--dark)' }}>{r.name}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
            {r.tags.map(t => (
              <span key={t} style={{
                fontSize: 11, padding: '2px 8px',
                background: 'var(--gray-light)', color: 'var(--gray)',
                borderRadius: 20, fontWeight: 600
              }}>{t}</span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'var(--gray)' }}>
            <span>⭐ <b style={{ color: 'var(--dark)' }}>{r.rating}</b> ({r.reviewCount})</span>
            <span>🕐 {r.deliveryTime} daq</span>
            <span>🛵 {formatPrice(r.deliveryFee)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('all')

  const filtered = useMemo(() => {
    return RESTAURANTS.filter(r => {
      const matchCat = cat === 'all' || r.category === cat
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      return matchCat && matchSearch
    })
  }, [search, cat])

  return (
    <div className="page-enter">
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #FF4757 0%, #FF6B81 100%)',
        padding: '50px 20px',
        textAlign: 'center',
        color: '#fff'
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h1 style={{ fontSize: 42, marginBottom: 12, fontWeight: 900, color: '#fff' }}>
            🍽️ Sevimli taomingiz<br />bir zumda eshigingizda
          </h1>
          <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 28 }}>
            Toshkentdagi eng yaxshi restoranlardan yetkazib beramiz
          </p>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 480, margin: '0 auto' }}>
            <span style={{
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
              fontSize: 20
            }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Restoran yoki taom qidiring..."
              style={{
                width: '100%', padding: '16px 16px 16px 48px',
                borderRadius: 16, border: 'none',
                fontSize: 16, background: '#fff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>
        {/* Stats bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))',
          gap: 12, marginBottom: 36
        }}>
          {[
            { emoji: '🏪', n: `${RESTAURANTS.length}`, label: 'Restoran' },
            { emoji: '🛵', n: '45+', label: "Kuryer yo'lda" },
            { emoji: '⭐', n: '4.8', label: "O'rtacha baho" },
            { emoji: '📦', n: '1,240+', label: 'Bugungi buyurtma' },
          ].map(s => (
            <div key={s.label} style={{
              background: '#fff', borderRadius: 14,
              padding: '16px', textAlign: 'center',
              border: '1.5px solid var(--gray-border)'
            }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{s.emoji}</div>
              <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'Nunito', color: 'var(--primary)' }}>{s.n}</div>
              <div style={{ fontSize: 12, color: 'var(--gray)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, marginBottom: 28 }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)} style={{
              padding: '10px 18px',
              borderRadius: 40,
              fontSize: 13,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              background: cat === c.id ? 'var(--primary)' : '#fff',
              color: cat === c.id ? '#fff' : 'var(--dark-soft)',
              border: cat === c.id ? 'none' : '1.5px solid var(--gray-border)',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.2s'
            }}>
              <span>{c.emoji}</span> {c.label}
            </button>
          ))}
        </div>

        {/* Restaurant grid */}
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ fontSize: 22, marginBottom: 20, color: 'var(--dark)' }}>
            {cat === 'all' ? 'Barcha restoranlar' : CATEGORIES.find(c => c.id === cat)?.label}
            <span style={{ fontSize: 14, color: 'var(--gray)', fontWeight: 600, marginLeft: 8 }}>
              ({filtered.length} ta)
            </span>
          </h2>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🍽️</div>
              <h3>Hech narsa topilmadi</h3>
              <p>Boshqa so'z bilan qidiring</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20
            }}>
              {filtered.map(r => <RestaurantCard key={r.id} r={r} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
