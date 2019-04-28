
/*  */
const path = require('path')
const Koa = require('koa')
const session = require('koa-session')
const redisStore = require('koa-redis')
const koaBody = require('koa-body')
const Router = require('koa-router')
const serve = require('koa-static')
const conn = require('./src/model/mysql')
const allRouters = require('./router');
const config = require('./config')
const fs = require('fs')
const app = new Koa();
const router = new Router();

app.keys = ['fms'];

router.all('*', async (ctx, next) => {
  ctx.response.set('X-Power-By', 'fms');
  ctx.response.set('Cache-Control', 'no-cache');
  if(ctx.method.toLowerCase() === 'get' && ctx.path !== '/auth/login' && ctx.path.indexOf('.')<0){
    if(!ctx.session.user){
      ctx.redirect('/auth/login')
    }else{
      await next();
    }
  }else{
    await next();
  }
})

router.get('/', async (ctx, next) => {
  let session = ctx.session;
  if(!session.user){
    ctx.redirect('/auth/login')
  }else{
    ctx.redirect('/project/all')
  }
})

let rootPath = [];
Object.keys(allRouters.views).forEach(item => {
  let result = item.match(/\/([\w-]+)\//)
  if(result.length > 0){
    let path = result[1];
    !rootPath.includes(path) && rootPath.push(path);
  }
  router.get(item,async (ctx, next) => {
    try{
      const html = await allRouters.views[item](ctx);
      ctx.status = 200
      ctx.set('Content-Type', 'text/html')
      ctx.body = html
    }catch(err){
      ctx.status = 500;
      ctx.body = '服务器发生错误'
      console.log(err)
    }
  });
})

rootPath.forEach(item =>{
  router.get('/' + item, async (ctx, next) =>{
    let status = ctx.status || 404;
    if(status === 404){
      ctx.redirect('/' + item + '/all');
    }
  })
})

Object.keys(allRouters.apis.get).forEach(item => {
  router.get(item, allRouters.apis.get[item]);
})
Object.keys(allRouters.apis.post).forEach(item => {
  router.post(item, allRouters.apis.post[item]);
})

const redisConf = process.env.NODE_ENV === 'development'? config.local.redis: config.prod.redis
app.use(session({
  key:'fms:sess',
  store: redisStore({
    host: redisConf.host,
    port: redisConf.port,
    db: redisConf.db
  })
}, app))


app.on('error', (err, evt)=>{
  console.error(err);
})

app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: './.temp',
    keepExtensions: true
  }
}));
app.use(router.routes()).use(router.allowedMethods())
app.use(serve('./dist', {
  maxage: 0
}))
app.listen(4000 ,()=>{
  console.info('Server start at 4000.');
});

//创建路径
fs.access(path.resolve(__dirname , './.temp'), fs.constants.F_OK, (err) => {
  if(err){
    fs.mkdir(path.resolve(__dirname , './.temp'), (err) => {
      if(err) throw err
    })
  }
})
