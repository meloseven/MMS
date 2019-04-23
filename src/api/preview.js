/**
 * 通过后台输入组件，合成页面，再通过webpack打包生成静态文件，输出到前端
 */
const webpack = require('webpack');
const getConfig = require('../build/view')
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const ws = require('./ws')
const util = require('../util')
const conn = require('../model/mysql');

module.exports = {
  /**
   * 预览
   * @param ctx
   * @param next
   */
  pre: async (ctx, next) => {
    const {session} = ctx;
    try{
      ws.start(session);
      const qs = ctx.query;
      let _comps = [];
      //如果是编辑页面，需要先获取之前状态
      if(qs.pageId){
        const [rows, fields] = await conn.query('SELECT * FROM `dms_page` WHERE id=?', qs.pageId);
        if(rows.length > 0){
          const delta = rows[0].delta
          if(delta.length > 0){
            _comps = JSON.parse(rows[0].delta);
          }
        }
      }
      const tempPath = `preview-${Date.now()}${Math.floor(Math.random() * 10)}`;
      session.tempPath = tempPath;
      await new Promise((resolve, reject) => {
        webpack(getConfig(_comps, util.getSessionKey(session), tempPath, 0)).run((err, stats)=>{
          err ? reject(err): resolve()
        })
      })
      ctx.set('Content-Type', 'text/html')
      ctx.body = fs.readFileSync(path.resolve(process.cwd(), `./dist/${tempPath}/index.html`));
    }catch(e){
      console.log(e)
    }
  },
  /**
   * 关闭预览
   * @param ctx
   * @param next
   */
  closePre: async (ctx, next) =>{
    ctx.body = util.response();
    ctx.session.props = [];
    rimraf(path.resolve(process.cwd(), `./dist/${ctx.session.tempPath}`), (e)=>{
      if(e){
        throw new Error(e);
      }
    });
  },
  /**
   * 发布
   * @param ctx
   * @param next
   */
  pub: async (ctx, next) =>{
    const tempPath = `publish-${Date.now()}${Math.floor(Math.random() * 10)}`;
    await new Promise((resolve, reject) => {
      webpack(getConfig(_comps, util.getSessionKey(session), tempPath, 1)).run((err, stats)=>{
        err ? reject(err): resolve()
      })
    })
  }
}