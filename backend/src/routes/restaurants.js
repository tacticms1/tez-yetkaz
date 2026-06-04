// routes/restaurants.js
const express = require('express')
const router = express.Router()
const { Restaurant } = require('../models')

router.get('/', async (req, res) => {
  try {
    const data = await Restaurant.findAll({ order: [['rating', 'DESC']] })
    res.json(data)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.get('/:id', async (req, res) => {
  try {
    const r = await Restaurant.findByPk(req.params.id)
    if (!r) return res.status(404).json({ error: 'Topilmadi' })
    res.json(r)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

module.exports = router
