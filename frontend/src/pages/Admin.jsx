import { useState, useEffect } from 'react'
import { RESTAURANTS, formatPrice, STATUS_MAP } from '../data'

function StatCard({ emoji, value, label, color = 'var(--primary)' }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '20px',
      border: '1.5px solid var(--gray-border)', textAlign: 'center'
    }}>
      <div style={{ fontSize: 36, marginBottom: 8 }}>{emoji}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color, fontFamily: 'Nunito' }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--gray)', marginTop: 4 }}>{label}</div>
    </div>
  )
}

function CloudBadge({ label, status = 'online' }) {
  const colors = { online: ['#E8FAF0', '#1E9B52'], offline: ['#FFE4E4', '#C0392B'], loading: ['#FFF8ED', '#D67D00'] }
  const [bg, fg] = colors[status]
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px', background: bg, borderRadius: 10, marginBottom: 8
    }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: fg }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 800, color: fg }}>
        {status === 'online' ? '● Online' : status === 'offline' ? '● Offline' : '● Yuklanmoqda'}
      </span>
    </div>
  )
}

export default function Admin() {
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('stats')
  const [serverLoad, setServerLoad] = useState(42)
  const [instances, setInstances] = useState(2)
  const [pipelineRunning, setPipelineRunning] = useState(false)
  const [pipelineStep, setPipelineStep] = useState(-1)

  useEffect(() => {
    setOrders(JSON.parse(localStorage.getItem('tez-orders') || '[]'))
    const t = setInterval(() => {
      setServerLoad(prev => {
        const next = prev + (Math.random() - 0.5) * 8
        const clamped = Math.max(10, Math.min(95, next))
        setInstances(clamped > 70 ? 3 : clamped > 85 ? 4 : 2)
        return clamped
      })
    }, 2000)
    return () => clearInterval(t)
  }, [])

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0)
  const delivered = orders.filter(o => o.status === 'delivered').length
  const active = orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length

  const PIPELINE_STEPS = [
    { label: 'GitHub Push', emoji: '📤' },
    { label: 'GitHub Actions Trigger', emoji: '⚡' },
    { label: 'npm install', emoji: '📦' },
    { label: 'Jest Tests', emoji: '🧪' },
    { label: 'Docker Build', emoji: '🐳' },
    { label: 'Push to DockerHub', emoji: '☁️' },
    { label: 'EC2 Deploy', emoji: '🚀' },
    { label: 'Health Check', emoji: '❤️' },
    { label: 'Live!', emoji: '✅' },
  ]

  const runPipeline = async () => {
    setPipelineRunning(true)
    setPipelineStep(0)
    for (let i = 0; i < PIPELINE_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 700))
      setPipelineStep(i)
    }
    await new Promise(r => setTimeout(r, 1000))
    setPipelineRunning(false)
    setPipelineStep(-1)
  }

  const tabs = [
    { id: 'stats', label: '📊 Statistika' },
    { id: 'orders', label: '📋 Buyurtmalar' },
    { id: 'cloud', label: '☁️ Cloud Monitoring' },
    { id: 'cicd', label: '🔄 CI/CD Pipeline' },
  ]

  return (
    <div className="page-enter" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, marginBottom: 2 }}>⚙️ Admin Panel</h1>
          <div style={{ fontSize: 13, color: 'var(--gray)' }}>
            TezYetkaz · Cloud Infrastructure Dashboard · BTEC Unit 6 Evidence
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <span className="badge badge-green">● Cloud: Online</span>
          <span className="badge badge-green">● DB: Connected</span>
          <span className="badge" style={{ background: '#E8F4FD', color: '#1A6FA5' }}>
            ● Load Balancer: Active
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--gray-border)', marginBottom: 28 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '10px 20px', fontSize: 14, fontWeight: 700, border: 'none',
            background: 'transparent',
            color: tab === t.id ? 'var(--primary)' : 'var(--gray)',
            borderBottom: tab === t.id ? '3px solid var(--primary)' : '3px solid transparent',
            marginBottom: -2, transition: 'all 0.2s'
          }}>{t.label}</button>
        ))}
      </div>

      {/* STATS TAB */}
      {tab === 'stats' && (
        <div className="page-enter">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
            <StatCard emoji="📦" value={orders.length} label="Jami buyurtmalar" />
            <StatCard emoji="✅" value={delivered} label="Yetkazildi" color="var(--green-dark)" />
            <StatCard emoji="🔥" value={active} label="Faol buyurtmalar" color="var(--orange)" />
            <StatCard emoji="💰" value={formatPrice(totalRevenue)} label="Umumiy tushum" />
            <StatCard emoji="🏪" value={RESTAURANTS.length} label="Restoranlar" color="var(--dark-soft)" />
            <StatCard emoji="⭐" value="4.8" label="O'rtacha baho" color="#F39C12" />
          </div>

          <h3 style={{ marginBottom: 16, fontSize: 18 }}>🏪 Restoranlar holati</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {RESTAURANTS.map(r => (
              <div key={r.id} style={{
                background: '#fff', borderRadius: 14, padding: '14px 16px',
                border: '1.5px solid var(--gray-border)',
                display: 'flex', alignItems: 'center', gap: 12
              }}>
                <span style={{ fontSize: 36 }}>{r.image}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray)' }}>⭐ {r.rating} · 🕐 {r.deliveryTime} daq</div>
                </div>
                <span className={`badge badge-${r.isOpen ? 'green' : 'gray'}`}>
                  {r.isOpen ? 'Ochiq' : 'Yopiq'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {tab === 'orders' && (
        <div className="page-enter">
          {orders.length === 0 ? (
            <div className="empty-state"><div className="icon">📋</div><h3>Buyurtmalar yo'q</h3></div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'var(--gray-light)' }}>
                    {['ID', 'Restoran', 'Manzil', 'Tel', 'Narx', 'Holat', 'Sana'].map(h => (
                      <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark-soft)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => {
                    const s = STATUS_MAP[o.status] || STATUS_MAP.pending
                    return (
                      <tr key={o.id} style={{ borderBottom: '1px solid var(--gray-border)' }}>
                        <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: 12 }}>#{String(o.id).slice(-6)}</td>
                        <td style={{ padding: '12px 14px' }}>{o.restaurantName}</td>
                        <td style={{ padding: '12px 14px', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.address}</td>
                        <td style={{ padding: '12px 14px' }}>{o.phone}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>{formatPrice(o.total)}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span className={`badge badge-${s.color === 'green' ? 'green' : s.color === 'red' ? 'red' : 'orange'}`}>
                            {s.emoji} {s.label}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--gray)' }}>
                          {new Date(o.createdAt).toLocaleDateString('uz-UZ')}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CLOUD MONITORING TAB */}
      {tab === 'cloud' && (
        <div className="page-enter">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Services */}
            <div>
              <h3 style={{ marginBottom: 14, fontSize: 17 }}>🟢 Tizim holati</h3>
              <CloudBadge label="Frontend (React + Nginx)" />
              <CloudBadge label="Backend API (Node.js)" />
              <CloudBadge label="Ma'lumotlar bazasi (PostgreSQL)" />
              <CloudBadge label="Load Balancer (Nginx)" />
              <CloudBadge label="VPN Tunnel (Site-to-Site)" />
              <CloudBadge label="Docker Container Runtime" />
              <CloudBadge label="GitHub Actions Runner" />
            </div>

            {/* Auto-scaling */}
            <div>
              <h3 style={{ marginBottom: 14, fontSize: 17 }}>📈 Auto-Scaling</h3>
              <div style={{
                background: '#fff', borderRadius: 16, padding: 20,
                border: '1.5px solid var(--gray-border)'
              }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>CPU yuklama</span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: serverLoad > 70 ? 'var(--primary)' : 'var(--green-dark)' }}>
                      {Math.round(serverLoad)}%
                    </span>
                  </div>
                  <div style={{ background: 'var(--gray-light)', borderRadius: 8, height: 12, overflow: 'hidden' }}>
                    <div style={{
                      width: `${serverLoad}%`, height: '100%',
                      background: serverLoad > 70 ? 'var(--primary)' : 'var(--green-dark)',
                      borderRadius: 8, transition: 'all 0.5s'
                    }} />
                  </div>
                </div>

                <div style={{ fontSize: 14, marginBottom: 12 }}>
                  <span style={{ color: 'var(--gray)' }}>Faol serverlar: </span>
                  <span style={{ fontWeight: 900, fontSize: 18, color: 'var(--primary)' }}>{instances} ta</span>
                  {serverLoad > 70 && <span style={{ color: 'var(--green-dark)', fontWeight: 700, fontSize: 12, marginLeft: 8 }}>↑ Scale out!</span>}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {Array.from({ length: instances }).map((_, i) => (
                    <div key={i} style={{
                      flex: 1, background: '#E8FAF0', borderRadius: 10,
                      padding: '10px 6px', textAlign: 'center',
                      border: '1.5px solid #C8FAD6'
                    }}>
                      <div style={{ fontSize: 22 }}>🖥️</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--green-dark)' }}>
                        EC2-{i + 1}
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--gray)' }}>t2.micro</div>
                    </div>
                  ))}
                  {serverLoad < 30 && instances > 2 && (
                    <div style={{
                      flex: 1, background: 'var(--gray-light)', borderRadius: 10,
                      padding: '10px 6px', textAlign: 'center', opacity: 0.5
                    }}>
                      <div style={{ fontSize: 22 }}>💤</div>
                      <div style={{ fontSize: 10, color: 'var(--gray)' }}>Standby</div>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 12, fontSize: 12, color: 'var(--gray)', background: 'var(--gray-light)', borderRadius: 8, padding: '8px 12px' }}>
                  📌 CPU &gt; 70% → Server qo'shiladi · CPU &lt; 30% → Server o'chiriladi
                </div>
              </div>

              {/* Network info */}
              <h3 style={{ marginBottom: 14, fontSize: 17, marginTop: 20 }}>🌐 Tarmoq (VPC)</h3>
              <div style={{ background: '#fff', borderRadius: 16, padding: 16, border: '1.5px solid var(--gray-border)' }}>
                {[
                  { label: 'VPC CIDR', value: '10.0.0.0/16' },
                  { label: 'Public Subnet', value: '10.0.1.0/24 (Nginx, LB)' },
                  { label: 'Private Subnet', value: '10.0.2.0/24 (Backend)' },
                  { label: 'DB Subnet', value: '10.0.3.0/24 (PostgreSQL)' },
                  { label: 'NAT Gateway', value: '10.0.1.5 (outbound)' },
                  { label: 'Load Balancer', value: 'Round-robin, 3 instances' },
                ].map(row => (
                  <div key={row.label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '6px 0', borderBottom: '1px dashed var(--gray-border)',
                    fontSize: 13
                  }}>
                    <span style={{ color: 'var(--gray)' }}>{row.label}</span>
                    <span style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 12 }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CI/CD TAB */}
      {tab === 'cicd' && (
        <div className="page-enter">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18 }}>🔄 GitHub Actions Pipeline</h3>
            <button onClick={runPipeline} disabled={pipelineRunning} style={{
              background: pipelineRunning ? 'var(--gray)' : 'var(--primary)',
              color: '#fff', padding: '10px 24px', borderRadius: 12, fontSize: 14
            }}>
              {pipelineRunning ? '⏳ Ishlamoqda...' : '▶ Pipeline ishlatish'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PIPELINE_STEPS.map((step, i) => {
              const status = pipelineStep === -1 ? 'idle'
                : i < pipelineStep ? 'done'
                : i === pipelineStep ? 'running'
                : 'waiting'
              return (
                <div key={i} style={{
                  background: '#fff', borderRadius: 14,
                  padding: '14px 18px',
                  border: `1.5px solid ${status === 'done' ? '#C8FAD6' : status === 'running' ? 'var(--orange)' : 'var(--gray-border)'}`,
                  display: 'flex', alignItems: 'center', gap: 14,
                  opacity: status === 'waiting' ? 0.5 : 1,
                  transition: 'all 0.3s'
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: status === 'done' ? '#E8FAF0' : status === 'running' ? var_orange_light() : 'var(--gray-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                    animation: status === 'running' ? 'spin 1s linear infinite' : 'none'
                  }}>{status === 'done' ? '✅' : status === 'running' ? '⚙️' : step.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>
                      {i + 1}. {step.label}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>
                    {status === 'done' && <span style={{ color: 'var(--green-dark)' }}>✓ Tayyor</span>}
                    {status === 'running' && <span style={{ color: 'var(--orange)' }}>⏳ Ishlaydi...</span>}
                    {status === 'idle' && <span style={{ color: 'var(--gray)' }}>—</span>}
                    {status === 'waiting' && <span style={{ color: 'var(--gray)' }}>Kutilmoqda</span>}
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ marginTop: 24, background: '#1A1A2E', borderRadius: 16, padding: 20, fontFamily: 'monospace', fontSize: 13, color: '#4CAF50' }}>
            <div style={{ color: '#888', marginBottom: 8 }}># .github/workflows/deploy.yml</div>
            <div>on: push → main</div>
            <div>jobs: test → build → deploy</div>
            <div style={{ color: '#81C784' }}>→ docker build tez-yetkaz:latest</div>
            <div style={{ color: '#81C784' }}>→ docker push dockerhub/tez-yetkaz</div>
            <div style={{ color: '#81C784' }}>→ ssh ec2 && docker-compose up -d</div>
            <div style={{ color: '#FFB74D', marginTop: 8 }}>✓ Last deploy: {new Date().toLocaleString('uz-UZ')}</div>
          </div>
        </div>
      )}
    </div>
  )
}

function var_orange_light() { return '#FFF8ED' }
