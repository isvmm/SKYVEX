const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('ERROR: DATABASE_URL environment variable is missing in .env. A Supabase PostgreSQL connection is required to start the backend.');
  process.exit(1);
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Necessary for Supabase SSL connections
    }
  },
  logging: false
});

module.exports = sequelize;
