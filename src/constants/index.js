module.exports = {
  //命令
  COMMAND: {
    INIT: '[init]',
    HEARTBEAT: '[heartbeat]',
    MESSAGE: '[message]',
    CLOSE: '[close]'
  },
  //组件行为，server->preview
  COMPONENT_ACTION: {
    ADD: 'a',
    DELETE: 'b',
    MODIFY: 'm',
    UP: 'u',
    DOWN: 'd',
    SAVE: 's'
  },
  //页面状态
  PAGE_STATUS:{
    NOPUB: 0, //未发布
    PUB: 1 //发布
  }
}