import React, {useState, useEffect} from 'react';
import {Modal, Input} from 'antd'
import config from '../../component/config';
import FormItem from './FormItem'
Object.assign(HelloForm, config.Hello);
export default function HelloForm({visible, onOk, onCancel, color}){
  const [innerColor, setInnerColor] = useState(color ? color: '');
  const [show, setShow] = useState(visible);
  useEffect(()=>{
    setShow(visible)
    setInnerColor(color)
  }, [visible, color])
  return (
    <Modal title={HelloForm.title} visible={show} centered onOk={() => onOk(!!color, {color: innerColor})} onCancel={onCancel}>
      <FormItem label="颜色" comp={
        <Input value={innerColor} 
          onChange={e=>setInnerColor(e.target.value)} 
          placeholder="请输入颜色值(默认rgba(0, 0, 0, 0.65))"/>
      }/>
    </Modal>
  )
}