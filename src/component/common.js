import fxShared from 'fx-shared'

//小程序原始ID
const originId = 'gh_2612b8ec16f1';
const executeFrame = (url)=>{
  var iframe = document.createElement('IFRAME')
  iframe.setAttribute('src', url)
  document.documentElement.appendChild(iframe)
  iframe.parentNode.removeChild(iframe)
  iframe = null
}

const query = fxShared.utils.getQueryString();
const queryInfo = {};
queryInfo.uid = (query.uid != null)?query.uid:'';
queryInfo.token = (query.token != null)?query.token:'';
const platform = (query.platform != null)?query.platform:'';
//是否是分享出去的页面
const isShared = (platform !== 'ios') && (platform !== 'android');
//是否登录
const isLogin = (queryInfo.uid !== '') && (queryInfo.token !== '');



export default {
  apiHost: {
    njia: {
      dev: 'http://dev.fenxianglife.com/njia', 
      //http://njiatest.fenxianglife.com/njia
      prod: 'https://api.fenxianglife.com/njia',
    },
    self: {
      dev: 'https://testself.fenxianglife.com/njia-self',//'https://dev.shareproductaa.com/njia-self',
      //https://testself.fenxianglife.com/njia-self',
      prod: 'https://self-api.fenxianglife.com/njia-self'
    } 
  },
  env: {
    queryInfo,
    platform,
    isShared,
    isLogin
  },
  assetsPath: 'http://static.fenxianglife.com/fms/static/',
  originId,
  urls: {
    njia: {
      getGoodsList: '/topic/goods'
    },
    self: {
      getGoodsList: '/topic/findTopicItems'
    }
  },
  executeFrame,
  getTraceId(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  openUrl:({openType, url}) => {
    const isInApp = !!platform
    switch(openType){
      case 0:
        if(url.indexOf('?') > -1){
          url += '&'
        }else{
          url += '?'
        }
        if(isInApp){
          url += `token=${queryInfo.token}&uid=${queryInfo.uid}`
        }else{
          let prefix = window.location.protocol + '//' + window.location.hostname;
          url = url.replace(/http[s]?:\/\/[\w\.\-]+?\//, prefix + '/');
          url += `token=${queryInfo.token}&uid=${queryInfo.uid}`
        }
        window.location.href = url;
        break;
      case 1:
        if(isInApp){
          executeFrame(url);
        }
        break;
      case 2:
        if(isInApp){
          fxShared.brige.openTb(url);
        }
        break;
      case 3:
        if(isInApp){
          fxShared.brige.openMiniApp(originId, url);
        }
        break;
    }
  },
  getScrollTop(){
    return document.body.scrollTop;
  },
  //简单节流函数
  throttle(fn, timeout){
    let _timer = null;
    return function (){
      if(!_timer){
        _timer = setTimeout(() =>{
          fn();
          clearTimeout(_timer)
          _timer = null;
        }, timeout);
      }
    }
  },
  //简单debounce函数
  debounce(fn, timeout){
    let _timer = null;
    return function (){
      _timer && clearTimeout(_timer)
      _timer = setTimeout(() =>{
        fn();
        clearTimeout(_timer)
        _timer = null;
      }, timeout);
    }
  }
}