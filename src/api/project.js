const conn = require('../model/mysql');
const util = require('../util')

module.exports = {
  getList: async (ctx, next) => {
    const [rows, fields] = await conn.query('SELECT * FROM `dms_project` WHERE 1=1');
    ctx.body = util.response(rows)
  }
}