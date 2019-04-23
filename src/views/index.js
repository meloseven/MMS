import React, {useState, useEffect, Fragment, useRef, useReducer} from 'react';
import ReactDOM from 'react-dom';
import AllComponent from '../component';
import {COMPONENT_ACTION, COMMAND} from '../constants';
import {Toast} from 'antd-mobile';
import config from '../../config'
import './index.scss';
import usePrevious from './hooks/usePrevious';
import tool from './tool'
import 'antd-mobile/dist/antd-mobile.css'; 

const mode = parseInt(process.env._mode);

function reducer(comps, {type, uid, props, index}){
  switch(type){
    case COMPONENT_ACTION.ADD:
      comps.push({uid, props});
      return comps.slice();
    case COMPONENT_ACTION.DELETE:
      comps.splice(index, 1)
      return comps.slice();
    case COMPONENT_ACTION.MODIFY:
      comps.splice(index, 1, {uid, props})
      return comps.slice();
    case COMPONENT_ACTION.UP:
      if(index > 0){
        let upTemp = Object.assign({}, comps[index - 1])
        comps[index - 1] = Object.assign({}, comps[index])
        comps[index] = upTemp;
      }
      return comps.slice();
    case COMPONENT_ACTION.DOWN:
      if(index < comps.length - 1){
        let downTemp = Object.assign({}, comps[index + 1])
        comps[index + 1] = Object.assign({}, comps[index])
        comps[index] = downTemp;
      }
      return comps.slice();
    default:
      return comps;
  }
}

function App() {
  var [comps, dispatch] = useReducer(reducer, process.env._comps ? process.env._comps: [])
  if(mode === 0){
    var _sessKey = process.env._sessKey;
    useEffect(() =>{
      top.postMessage({comps, type:'mutate'}, '*')
    }, [comps])
    useEffect(() => {
      const ws = new WebSocket('ws://127.0.0.1:8080');
      ws.onmessage = function(msg){
        msg = JSON.parse(msg.data)
        const {uid, props, index} = {...msg};
        dispatch({
          type: msg.action,
          props,
          uid,
          index
        })
      }
      ws.onopen = function(){
        ws.send(COMMAND.INIT + _sessKey);
        setInterval(() => {
          if(ws.readyState === 1){
            ws.send(COMMAND.HEARTBEAT) 
          }
        }, config.local.wsTimeout - 5000)
      }
      ws.onerror = function(){
        Toast.fail('超时，请刷新页面');
      }
      window.onbeforeunload = ()=>{
        ws.send(COMMAND.CLOSE)
        ws.close();
      }
      return ()=>{
        ws.send(COMMAND.CLOSE)
        ws.close();
      }
    }, [])
  }
  
  return (
    <Fragment>
      {
        mode === 0 ?
        comps.map((item, index) => {
          let SelectedComp = Object.values(AllComponent).find(comp => comp.uid === item.uid)
          let Wrapper = tool(SelectedComp, dispatch, index)
          return <Wrapper {...item.props} key={index}/>
        }):
        comps.map((item, index) => {
          let SelectedComp = Object.values(AllComponent).find(comp => comp.uid === item.uid)
          return <SelectedComp {...item.props} key={index}/>
        })
      }
    </Fragment>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'))