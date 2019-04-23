import React, {Fragment, useState, useEffect} from 'react';
import {Modal, Input, Switch, Select, message, Button} from 'antd'
import config from '../../component/config';
import FormItem from './FormItem';
Object.assign(TabNavigatorForm, config.TabNavigator);
const Option = Select.Option;

const MenuSection = function ({menuItem, onChange, onRemove, idx}) {
  const [name, setName] = useState('');
  const [anchor, setAnchor] = useState('');
  useEffect(() => {
    if(menuItem.name !== null) {setName(menuItem.name)}
    if(menuItem.anchor !== null) {setAnchor(menuItem.anchor)}
  }, [...Object.keys(menuItem)])

  useEffect(()=>{
    onChange({name, anchor})
  },[name, anchor])

  
  return (
    <Fragment>
      <FormItem label={`第${(idx + 1)}菜单`} comp={<Button type="danger" icon="delete" onClick={onRemove}/>} />
      <FormItem label="名称" comp={
        <Input placeholder="请输入名称" value={name} onChange={e=>setName(e.target.value)}/>
      }/>
      <FormItem label="锚点" comp={
        <Input placeholder="请输入锚点" value={anchor} onChange={e=>setAnchor(e.target.value)}/>
      }/>
    </Fragment>
  )
}
export default function TabNavigatorForm({visible, onOk, onCancel, ...outerProps}){
  const [show, setShow] = useState(visible);
  const [menu, setMenu] = useState([]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fontColor, setFontColor] = useState('#444444');
  const [fontActiveColor, setFontActiveColor] = useState('#000000');
  const [borderColor, setBorderColor] = useState('#000000');

  useEffect(()=>{
    setShow(visible)
    if(outerProps.menu != null){
      setMenu([...outerProps.menu])
    }
    if(outerProps.bgColor != null){
      setBgColor(outerProps.bgColor)
    }
    if(outerProps.fontColor != null){
      setFontColor(outerProps.fontColor)
    }
    if(outerProps.fontActiveColor != null){
      setFontActiveColor(outerProps.fontActiveColor)
    }
    if(outerProps.borderColor != null){
      setBorderColor(outerProps.borderColor)
    }
  }, [visible, ...Object.keys(outerProps).map(item => outerProps[item])])

  const handleOkButton = () => {
    if(menu.length === 0){
      message.error('请输入菜单')
      return;
    }
    onOk((outerProps.menu != null), {menu, bgColor, fontColor, fontActiveColor, borderColor})
  }
  const addMenu = () => {
    setMenu(prev => {
      prev.push({
        name: '',
        anchor: ''
      });
      return prev.slice()
    })
  }
  const handleMenuChange = (index, menuItem) => {
    setMenu(prev => {
      prev.splice(index, 1, menuItem);
      return prev.slice()
    })
  }

  const handleMenuRemove = (index) => {
    setMenu(prev => {
      prev.splice(index, 1);
      return prev.slice()
    })
  }

  return (
    <Modal title={TabNavigatorForm.title} visible={show} centered 
      onOk={handleOkButton} onCancel={onCancel}>
      <FormItem label="添加菜单" comp={
        <Button type="primary" icon="plus" onClick={addMenu}/>
      }/>
      {
        menu.map((item, index) => {
          return <MenuSection menuItem={item} key={index} idx={index} 
            onChange={(menuItem) => handleMenuChange(index, menuItem)}
            onRemove={()=>handleMenuRemove(index)}/>
        })
      }
      <FormItem label="背景色" comp={
        <Input placeholder="默认#ffffff" value={bgColor} onChange={e=>setBgColor(e.target.value)}/>
      }/>
      <FormItem label="字体颜色" comp={
        <Input placeholder="默认#444444" value={fontColor} onChange={e=>setFontColor(e.target.value)}/>
      }/>
      <FormItem label="选中字体色" comp={
        <Input placeholder="默认#000000" value={fontActiveColor} onChange={e=>setFontActiveColor(e.target.value)}/>
      }/>
      <FormItem label="边框颜色" comp={
        <Input placeholder="默认#000000" value={borderColor} onChange={e=>setBorderColor(e.target.value)}/>
      }/>
    </Modal>
  )
}