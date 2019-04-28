const mysql = require('mysql2');
const config = require('../../config');
const logger = require('../util/logger');
const dbConf = process.env.NODE_ENV === 'development'? config.local.db: config.prod.db
const pool = mysql.createPool({
  host: dbConf.host,
  user: dbConf.user,
  database: dbConf.database,
  password: dbConf.password,
  connectionLimit: 10,
});

module.exports = pool.promise();