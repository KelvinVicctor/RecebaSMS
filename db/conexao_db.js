const mysql = require('mysql2')
const dotenv = require('dotenv').config()

// Conexao Banco de dados

const db_config = {
  user: process.env.USER,
  password: process.env.DB_PASSWORD,
  host: process.env.HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE
}

function createConnection(){
  return mysql.createConnection(db_config)
}

module.exports = createConnection 
