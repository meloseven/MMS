import React, {useEffect} from 'react'
import { Popover, Icon } from 'antd';
import {COMPONENT_ACTION} from '../constants';

function Operation({uid, dispatch, index, compProps}) {
  const edit = () => {
    top.postMessage({uid, index, props:compProps, type:'edit'}, '*')
  }
  const up = () => {
    dispatch({
      type:COMPONENT_ACTION.UP,
      uid,
      index
    })
  }
  const down = () => {
    dispatch({
      type:COMPONENT_ACTION.DOWN,
      uid,
      index
    })
  }
  const del = () => {
    dispatch({
      type:COMPONENT_ACTION.DELETE,
      uid,
      index
    })
  }

  return (
    <div className="operation">
      <div className="ope-item" onClick={()=>edit()}>
        <Icon type="edit" /><span>编辑</span>
      </div>
      <div className="ope-item" onClick={()=>up()}>
        <Icon type="up" /><span>上移</span>
      </div>
      <div className="ope-item" onClick={()=>down()}>
        <Icon type="down" /><span>下移</span>
      </div>
      <div className="ope-item" onClick={()=>del()}>
        <Icon type="delete" /><span>删除</span>
      </div>
    </div>
  )
}

export default function (InnerComponent, dispatch, index) {
  return (props) => (
    <Popover placement="bottom" title="组件操作" content={<Operation uid={InnerComponent.uid} dispatch={dispatch} index={index} compProps={props}/>}>
      <div className="wraper">
        <InnerComponent {...props}/>
      </div>
    </Popover>
  )
}