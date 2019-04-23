import React, {Fragment, useState, useEffect} from 'react';
import {Modal, Input, Switch, Select, message} from 'antd'
import config from '../../component/config';
import FormItem from './FormItem';
import PicUploader from './PicUploader';
Object.assign(SinglePicUrlForm, config.SinglePicUrl);
const Option = Select.Option;

export default function SinglePicUrlForm({visible, onOk, onCancel, ...outerProps}){
  const [show, setShow] = useState(visible);
  const [hasTrigger, setHasTrigger] = useState(false);
  const [openType, setOpenType] = useState(0);
  const [url, setUrl] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [anchor, setAnchor] = useState('');
  useEffect(()=>{
    setShow(visible)
    if(outerProps.hasTrigger != null){
      setHasTrigger(outerProps.hasTrigger);
    }
    if(outerProps.openType != null){
      setOpenType(outerProps.openType);
    }
    if(outerProps.url != null){
      setUrl(outerProps.url);
    }
    if(outerProps.imgUrl != null){
      setImgUrl(outerProps.imgUrl);
    }
    if(outerProps.anchor != null){
      setAnchor(outerProps.anchor);
    }
  }, [visible, ...Object.keys(outerProps).map(item => outerProps[item])])

  const handleOkButton = () => {
    if(imgUrl === ''){
      message.error('请选择图片'); 
      return
    }
    onOk((outerProps.hasTrigger != null), {hasTrigger, openType, url, imgUrl, anchor})
  }
  return (
    <Modal title={SinglePicUrlForm.title} visible={show} centered 
      onOk={handleOkButton} onCancel={onCancel}>
      <FormItem label="开启链接" comp={
        <Switch checkedChildren="开" unCheckedChildren="关" checked={hasTrigger} onChange={v=>setHasTrigger(v)}/>
      }/>
      {
        hasTrigger && (
          <Fragment>
            <FormItem label="打开方式" comp={
              <Select defaultValue={openType} onChange={(v)=>setOpenType(v)} style={{width: '80px'}}>
                <Option value={0}>H5</Option>
                <Option value={1}>粉象</Option>
                <Option value={2}>淘宝</Option>
                <Option value={3}>小程序</Option>
              </Select>
            }/>
            <FormItem label="链接" comp={
              <Input placeholder="请输入链接" value={url} onChange={e=>setUrl(e.target.value)}/>
            }/>
          </Fragment>
        )
      }
      <FormItem label="上传图片" comp={
        <PicUploader imgUrl={outerProps.imgUrl?outerProps.imgUrl:''} onChange={v=>setImgUrl(v)}/>
      }/>
      <FormItem label="锚点" comp={
        <Input placeholder="可选" value={anchor} onChange={e=>setAnchor(e.target.value)}/>
      }/>
    </Modal>
  )
}