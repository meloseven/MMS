const conn = require('../model/mysql');
const CryptoJS = require('crypto-js');
const util = require('../util')

module.exports = {
  login: async (ctx, next)=>{
    const {username, password} = ctx.request.body;
    const encPass = CryptoJS.MD5(password).toString();
    const [rows, fields] = await conn.query('SELECT * FROM `dms_user` WHERE `username` = ? AND `password` = ?',[username, encPass]);
    if(rows.length === 0){
      ctx.body = util.response({}, 401, '用户名或密码错误')
      return;
    }
    ctx.session.user = rows[0];
    ctx.body = util.response({}, 200, '登入成功')
  },
  getCurrentUser: async (ctx, next)=>{
    ctx.body = util.response(ctx.session.user, 200)
  },
  logout: async (ctx, next) =>{
    ctx.session.user = null;
    ctx.body = util.response({}, 200, '退出成功')
  }
}