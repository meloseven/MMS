const conn = require('../model/mysql');
const util = require('../util')

module.exports = {
  getList: async (ctx, next) => {
    const [rows, fields] = await conn.query('SELECT * FROM `dms_project` WHERE 1=1');
    ctx.body = util.response(rows)
  },
  add: async (ctx, next) => {
    const {proname} = ctx.request.body;
    const user = ctx.session.user;
    const uid = user.id;
    const username = user.username;
    const time = Date.now();
    try{
      const [rows, fields] = await conn.query('SELECT * FROM `dms_project` WHERE `proname` = ?', [proname]);
      if(rows.length > 0){
        ctx.body = util.response(null, 400, '名称重复');
        return;
      }
      const results = await conn.execute('INSERT INTO dms_project (proname, uid, username, time) VALUES (' + 
      `'${proname}', ${uid}, '${username}', ${time})`)
      ctx.body = util.response({});
    }catch(e){
      console.log(e);
      ctx.body = util.response(null, 500, '保存错误');
    }
  },
}