const express = require('express')
const router = express.Router()
const { MenuItem } = require('../models')

router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const items = await MenuItem.findAll({
      where: { restaurantId: req.params.restaurantId },
      order: [['popular', 'DESC'], ['name', 'ASC']]
    })
    res.json(items)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

module.exports = router
