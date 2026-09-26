const mysql = require('mysql2');
require('dotenv').config();

// Creamos un pool de conexiones en lugar de una sola conexión.
// Un pool reutiliza conexiones automáticamente, lo que es más eficiente.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

// .promise() nos permite usar async/await en lugar de callbacks
module.exports = pool.promise();
