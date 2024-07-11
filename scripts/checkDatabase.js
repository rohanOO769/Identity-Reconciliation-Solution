// scripts/checkDatabase.js

const sequelize = require('../models/contact'); // Adjust path as per your project structure
const { Sequelize, QueryTypes } = require('sequelize');

// Ensure sequelize is an instance of Sequelize
if (!(sequelize instanceof Sequelize)) {
  throw new Error('Invalid Sequelize instance.');
}

async function checkDatabase() {
  try {
    // Check connection
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Example raw SQL query
    const sqlQuery = `
      SELECT * from contacts;
    `;

    // Execute raw query
    const contacts = await sequelize.query(sqlQuery, {
      type: QueryTypes.SELECT,
    });

    console.log('Contacts:', contacts);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    // Close connection when done
    if (sequelize) {
      await sequelize.close();
      console.log('Database connection closed.');
    }
  }
}

checkDatabase()