import axios from 'axios'
import common from './common'

const njiaHost = process.env._isTest?common.apiHost.njia.dev: common.apiHost.njia.prod;

export default {
  getUserInfo(){
    return axios({
      url: njiaHost + '/users/info',
      headers: {
        'h5-tk': JSON.stringify(common.env.queryInfo),
        'traceId': common.getTraceId()
      }
    }).then(({data})=>{
      if(data.code === 200){
        return data.data;
      }
      Promise.reject(data.message);
    })
  }
}