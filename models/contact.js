// models/contact.js

const { Sequelize, DataTypes } = require('sequelize');
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
        rejectUnauthorized: false,
      },
    },
    logging: false,
  }
);

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'phone_number',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkedId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'linked_id',
  },
  linkPrecedence: {
    type: DataTypes.ENUM('primary', 'secondary'),
    allowNull: false,
    field: 'link_precedence',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    field: 'updated_at',
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_at',
  },
}, {
  timestamps: true,
  paranoid: true,
  underscored: true,
});

module.exports = { sequelize, Contact };
