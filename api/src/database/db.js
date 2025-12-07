require("dotenv").config();
const { Pool } = require("pg");

// O 'pg' já está instalado como dependência no seu package.json
// Ele é o driver recomendado para PostgreSQL no Node.js

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necessário para conexões com o Neon
  },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};