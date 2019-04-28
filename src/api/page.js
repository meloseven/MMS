const conn = require('../model/mysql');
const preview = require('./preview')
const util = require('../util')
const webpack = require('webpack');
const getConfig = require('../build/view')
const path = require('path');
const rimraf = require('rimraf');
const {PAGE_STATUS} = require('../constants')
const fxSharedNode = require('fx-shared-node')
module.exports = {
  getList: async (ctx, next) => {
    const [rows, fields] = await conn.query('SELECT * FROM `dms_page` WHERE 1=1');
    ctx.body = util.response(rows);
  },
  preview: preview.pre,
  closePreview: preview.closePre,
  savePageInfo: async (ctx, next) => {
    const {projectId, title, delta} = ctx.request.body;
    const user = ctx.session.user;
    const fileName = util.generateUid(projectId + '-' + parseInt(Math.random()*10000)).slice(0, 6);
    const uid = user.id;
    const username = user.username;
    const status = PAGE_STATUS.NOPUB;
    const time = Date.now();
    try{
      const results = await conn.execute('INSERT INTO dms_page (title, projectId, fileName, delta, uid, username, status, createTime, updateTime) VALUES (' + 
      `'${title}', ${projectId}, '${fileName}', '${JSON.stringify(delta)}', ${uid}, '${username}', ${status}, ${time}, ${time})`)
      const pageId = results[0].insertId;
      ctx.body = util.response({pageId, fileName});
    }catch(e){
      console.log(e);
      ctx.body = util.response(null, 500, '保存错误');
    }
  },
  getPageInfo: async (ctx, next) => {
    const {id} = ctx.query;
    const [rows, fields] = await conn.query('SELECT * FROM `dms_page` WHERE `id` = ?', [id]);
    if(rows.length > 0){
      ctx.body = util.response(rows[0]);
    }else{
      ctx.body = util.response(null, 404, '未查询到该页面');
    }
  },
  updatePageInfo: async (ctx, next) => {
    const {pageId, title, delta} = ctx.request.body;
    const status = PAGE_STATUS.NOPUB;
    try{
      await conn.execute('UPDATE `dms_page` SET `title` = ?, `delta` = ?, `status` = ? WHERE `id` = ?', [title, JSON.stringify(delta), status, pageId])
      ctx.body = util.response();
    }catch(e){
      console.log(e);
      ctx.body = util.response(null, 500, '更新错误');
    }
  },
  publish: async (ctx, next) => {
    
    const {pageId} = ctx.request.body;
    const [rows, fields] = await conn.query('SELECT * FROM `dms_page` WHERE `id` = ?', [pageId]);
    if(rows.length > 0){
      const pageInfo = rows[0]
      const tempPath = `${pageInfo.projectId}/${pageInfo.fileName}`;
      const comps = JSON.parse(pageInfo.delta);
      await new Promise((resolve, reject) => {
        webpack(getConfig(comps, null, tempPath, 1, pageInfo.title)).run((err, stats)=>{
          err ? reject(err): resolve()
        })
      })
      const bucketPath = process.env.NODE_ENV==='development'?'fenxiang-test':'feixiangm'
      fxSharedNode.uploadOSS(`./dist/${tempPath}`, `fms/${tempPath}`, bucketPath)
      rimraf(path.resolve(process.cwd(), `./dist/${pageInfo.projectId}`), (e)=>{
        if(e){
          throw new Error(e);
        }
      });
      ctx.body = util.response(null, 200, '发布成功');
    }
  }
}