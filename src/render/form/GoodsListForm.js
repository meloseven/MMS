import React, {Fragment, useState, useEffect} from 'react';
import {Modal, Input, Switch, Select, message} from 'antd'
import config from '../../component/config';
import FormItem from './FormItem';
Object.assign(GoodsListForm, config.GoodsList);
const Option = Select.Option;

export default function GoodsListForm({visible, onOk, onCancel, ...outerProps}){
  const [show, setShow] = useState(visible);
  const [topicId, setTopicId] = useState('');
  const [quantity, setQuantity] = useState(12);
  const [type, setType] = useState('1R2C');
  const [tag, setTag] = useState('');

  useEffect(()=>{
    setShow(visible)
    if(outerProps.topicId != null){
      setTopicId(outerProps.topicId)
    }
    if(outerProps.quantity != null){
      setQuantity(outerProps.quantity)
    }
    if(outerProps.type != null){
      setType(outerProps.type)
    }
    if(outerProps.tag != null){
      setTag(outerProps.tag)
    }
  }, [visible, ...Object.keys(outerProps).map(item => outerProps[item])])

  const handleOkButton = () => {
    if(!topicId){
      message.error('请输入专题ID');
      return;
    }
    onOk((outerProps.topicId != null), {topicId, quantity, type, tag})
  }
  return (
    <Modal title={GoodsListForm.title} visible={show} centered 
      onOk={handleOkButton} onCancel={onCancel}>
      <FormItem label="专题ID" comp={
        <Input placeholder="请输入专题ID" value={topicId} onChange={e=>setTopicId(e.target.value)}/>
      }/>
      <FormItem label="显示数量" comp={
        <Input placeholder="请输入数量" type="number" value={quantity} onChange={e=>setQuantity(parseInt(e.target.value))}/>
      }/>
      <FormItem label="样式" comp={
        <Select defaultValue={type} onChange={(v)=>setType(v)} style={{width: '100px'}}>
          <Option value={'1R1C'}>一排一列</Option>
          <Option value={'1R2C'}>一排两列</Option>
          <Option value={'1R3C'}>一排三列</Option>
        </Select>
      }/>
      <FormItem label="标签" comp={
        <Input placeholder="请输入标签" value={tag} onChange={e=>setTag(e.target.value)}/>
      }/>
    </Modal>
  )
}