const mysql = require('mysql2');
const config = require('../../config').local;
const logger = require('../util/logger');
const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  database: config.db.database,
  password: config.db.password,
  connectionLimit: 10,
});

module.exports = pool.promise();