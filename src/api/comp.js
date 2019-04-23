const compConf = require('../component/config')
const util = require('../util')
const ws = require('./ws')
const {COMPONENT_ACTION} = require('../constants')
const path = require('path');
const fxSharedNode = require('fx-shared-node');
const rimraf = require('rimraf');
module.exports = {
  getList: async (ctx, next)=>{
    let comps = Object.values(compConf);
    ctx.body = util.response(comps);
  },
  add: async (ctx, next) =>{
    const session = ctx.session;
    const wsClient = ws.getWsForSession(session);
    const {uid, props} = ctx.request.body;
    if(wsClient){
      ctx.body = util.response();
      wsClient.send(JSON.stringify({uid, props, action: COMPONENT_ACTION.ADD}))
    }else{
      ctx.body = util.response(null, 400, '请稍等!');
    }
  },
  edit: async (ctx, next) =>{
    const session = ctx.session;
    const wsClient = ws.getWsForSession(session);
    const {uid, props, index} = ctx.request.body;
    if(wsClient){
      ctx.body = util.response();
      wsClient.send(JSON.stringify({uid, props, action: COMPONENT_ACTION.MODIFY, index}))
    }else{
      ctx.body = util.response(null, 400, '请稍等!');
    }
  },
  uploadImage: async (ctx, next) =>{
    const file = ctx.request.files.file;
    const filePath = path.resolve(process.cwd(), file.path);
    const fileName = file.path.match(/\/([\w\.]+)/)[1];
    try{
      await fxSharedNode.uploadOSS('.temp', 'fms', 'fenxianghome');
      await new Promise((resolve, reject)=>{
        rimraf(filePath, (e)=>{
          if(e){
            reject();
          }else{
            resolve();
          }
        })
      });
    }catch(e){
      console.log(e)
    }
    ctx.body = util.response({imgUrl: `http://static.fenxianglife.com/fms/${fileName}`});
  },
}