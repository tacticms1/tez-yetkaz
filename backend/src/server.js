require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { sequelize } = require('./config/database')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/restaurants', require('./routes/restaurants'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/menu', require('./routes/menu'))

// Health check (for Load Balancer)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TezYetkaz API',
    instance: process.env.INSTANCE_ID || 'backend-1',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  })
})

// Cloud metrics endpoint
app.get('/api/metrics', (req, res) => {
  res.json({
    cpu: Math.floor(Math.random() * 60 + 20),
    memory: Math.floor(Math.random() * 40 + 40),
    requests_per_sec: Math.floor(Math.random() * 100 + 50),
    active_connections: Math.floor(Math.random() * 200 + 100),
    instance: process.env.INSTANCE_ID || 'backend-1'
  })
})

// Start server
async function start() {
  try {
    await sequelize.authenticate()
    console.log('✅ Database connected')
    await sequelize.sync({ alter: true })
    console.log('✅ Models synced')
    app.listen(PORT, () => {
      console.log(`🚀 TezYetkaz API running on port ${PORT}`)
      console.log(`📍 Instance: ${process.env.INSTANCE_ID || 'backend-1'}`)
    })
  } catch (err) {
    console.error('❌ Startup error:', err)
    process.exit(1)
  }
}

start()
