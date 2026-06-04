const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Restaurant = sequelize.define('Restaurant', {
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING },
  rating: { type: DataTypes.FLOAT, defaultValue: 4.5 },
  reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  deliveryTime: { type: DataTypes.STRING },
  deliveryFee: { type: DataTypes.INTEGER, defaultValue: 10000 },
  minOrder: { type: DataTypes.INTEGER, defaultValue: 30000 },
  isOpen: { type: DataTypes.BOOLEAN, defaultValue: true },
  address: { type: DataTypes.STRING },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] }
})

const MenuItem = sequelize.define('MenuItem', {
  restaurantId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  emoji: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  desc: { type: DataTypes.TEXT },
  popular: { type: DataTypes.BOOLEAN, defaultValue: false },
  time: { type: DataTypes.STRING }
})

const Order = sequelize.define('Order', {
  restaurantId: { type: DataTypes.INTEGER },
  restaurantName: { type: DataTypes.STRING },
  items: { type: DataTypes.JSONB, defaultValue: [] },
  address: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  comment: { type: DataTypes.TEXT },
  subtotal: { type: DataTypes.INTEGER, defaultValue: 0 },
  deliveryFee: { type: DataTypes.INTEGER, defaultValue: 0 },
  total: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'on_way', 'delivered', 'cancelled'),
    defaultValue: 'confirmed'
  }
})

module.exports = { Restaurant, MenuItem, Order }
