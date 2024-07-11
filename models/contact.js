// models/contact.js

const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '.env.local' });

const sequelize = new Sequelize(
  process.env.NEXT_POSTGRES_DATABASE,
  process.env.NEXT_POSTGRES_USER,
  process.env.NEXT_POSTGRES_PASSWORD,
  {
    host: process.env.NEXT_POSTGRES_HOST,
    port: process.env.NEXT_POSTGRES_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Adjust based on your PostgreSQL SSL configuration
      }
    },
    logging: console.log, // Enable logging if needed
  }
);

module.exports = sequelize;

