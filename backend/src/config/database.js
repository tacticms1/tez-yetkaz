const { Sequelize } = require('sequelize')

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false
    })
  : process.env.DB_DIALECT === 'sqlite'
    ? new Sequelize({
        dialect: 'sqlite',
        storage: './database.sqlite',
        logging: false
      })
    : new Sequelize(
        process.env.DB_NAME || 'tez_yetkaz',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASS || 'password',
        {
          host: process.env.DB_HOST || 'localhost',
          port: process.env.DB_PORT || 5432,
          dialect: 'postgres',
          logging: false,
          pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
        }
      )

module.exports = { sequelize }
