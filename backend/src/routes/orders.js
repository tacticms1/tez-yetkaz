const express = require('express')
const router = express.Router()
const { Order } = require('../models')

router.get('/', async (req, res) => {
  try {
    const data = await Order.findAll({ order: [['createdAt', 'DESC']] })
    res.json(data)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body)
    res.status(201).json(order)
  } catch (e) { res.status(400).json({ error: e.message }) }
})

router.put('/:id/status', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id)
    if (!order) return res.status(404).json({ error: 'Topilmadi' })
    await order.update({ status: req.body.status })
    res.json(order)
  } catch (e) { res.status(400).json({ error: e.message }) }
})

module.exports = router
