const CryptoJS = require('crypto-js');
module.exports = {
  generateUid(str){
    return CryptoJS.MD5(str).toString()
  },
  response(data, code, message){
    return {
      data: data?data: {},
      code: code? code: 200,
      message: message? message: ''
    }
  },
  getSessionKey(session){
    return session._sessCtx.externalKey
  },
  getQueryString(url = window.location.href) {
    if (typeof url !== 'string') {
      return {}
    }
    if (url.match(/\?/)) url = url.slice(url.indexOf('?') + 1)
    if (url.match(/#/)) url = url.slice(0, url.indexOf('#'))
    return decodeURIComponent(url).split('&').map(function (param) {
      var tmp = param.split('=')
      var key = tmp[0]
      var value = tmp[1] || true
      /* 
      不自动转数值，防止数值过大，转为number失败
      if (typeof value === 'string' && isNaN(Number(value)) === false && !value.startsWith('0')) {
        value = Number(value)
      } */
  
      return {
        key: key,
        value: value
      }
    }).reduce(function (params, item) {
      var key = item.key,
        value = item.value
  
      if (typeof params[key] === 'undefined') {
        params[key] = value
      } else {
        params[key] = Array.isArray(params[key]) ? params[key] : [params[key]]
        params[key].push(value)
      }
  
      return params
    }, {})
  }
}