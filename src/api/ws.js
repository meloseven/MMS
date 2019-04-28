const WebSocket = require('ws');
const util = require('../util')
const config = require('../../ws.config')
const {COMMAND} = require('../constants')
const sessionList = [];
const sessionWsMap = new Map();//key:session external key, value:{sesion, ws}

const wsConf = process.env.NODE_ENV === 'development'?config.local: config.prod
const wss = new WebSocket.Server({port: wsConf.port});

wss.on('connection', function(ws){
  ws.isAlive = true;
  ws.on('pong', heartBeat);
  ws.on('message', function(message){
    let commandReg = /\[\w+\]/;
    let result = message.match(commandReg);
    if(result){
      let commandName = result[0];
      let params = message.slice(commandName.length);
      switch(commandName){
        case COMMAND.INIT:
          let _sessKey = params;
          let session = sessionList.find(item => util.getSessionKey(item) === _sessKey);
          if(session){
            sessionWsMap.set(util.getSessionKey(session), {ws, session})
          }
          break;
        case COMMAND.MESSAGE:

          break;
        case COMMAND.CLOSE:
          closeWs(ws);
          break;
        case COMMAND.HEARTBEAT:
          break;
      }
    }
  })
})
const interval = setInterval(function ping() {
  wss.clients.forEach(ws => {
    if(ws.isAlive === false){
      ws.terminate();
      return;
    }
    ws.isAlive = false;
    ws.ping(noop)
  })
}, wsConf.timeout)

function noop(){}
function heartBeat(){
  this.isAlive = true;
}
function getSessionKey(_ws){
  for(let [sessKey, {ws, session}] of sessionWsMap){
    if(ws === _ws){
      return session;
    }
  }
}

function closeWs(ws){
  ws.close();
  let session  = getSessionKey(ws);
  sessionWsMap.delete(util.getSessionKey(session))
}

module.exports = {
  start(session){
    sessionList.push(session);
  },
  getWsForSession(session){
    let m = sessionWsMap.get(util.getSessionKey(session))
    return m?m.ws: null
  }
}