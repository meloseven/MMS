import React, {Fragment, useState, useEffect} from 'react';
import {Modal, Input, Switch, Select, Button, message} from 'antd'
import config from '../../component/config';
import FormItem from './FormItem';
import PicUploader from './PicUploader';
Object.assign(MultiPicUrlForm, config.MultiPicUrl);
const Option = Select.Option;

const LinkSection = function ({link, onChange, onRemove, idx}) {
  const [openType, setOpenType] = useState(0);
  const [url, setUrl] = useState('');
  useEffect(() => {
    if(link.openType !== null) {setOpenType(link.openType)}
    if(link.url !== null) {setUrl(link.url)}
  }, [...Object.keys(link)])

  useEffect(()=>{
    onChange({openType, url})
  },[openType, url])

  
  return (
    <Fragment>
      <FormItem label={`第${(idx + 1)}区块`} comp={<Button type="danger" icon="delete" onClick={onRemove}/>} />
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

export default function MultiPicUrlForm({visible, onOk, onCancel, ...outerProps}){
  const [show, setShow] = useState(visible);
  const [imgUrl, setImgUrl] = useState('');
  const [anchor, setAnchor] = useState('');
  const [section, setSection] = useState([]);

  useEffect(()=>{
    setShow(visible)
    if(outerProps.imgUrl != null){
      setImgUrl(outerProps.imgUrl);
    }
    if(outerProps.anchor != null){
      setAnchor(outerProps.anchor);
    }
    if(outerProps.section != null){
      setSection([...outerProps.section]);
    }
  }, [visible, ...Object.keys(outerProps).map(item => outerProps[item])])

  const addSection = () => {
    setSection(prev => {
      prev.push({
        openType: 0,
        url: ''
      });
      return prev.slice()
    })
  }
  const handleSectionChange = (index, link) => {
    setSection(prev => {
      prev.splice(index, 1, link);
      return prev.slice()
    })
  }

  const handleSectionRemove = (index) => {
    setSection(prev => {
      prev.splice(index, 1);
      return prev.slice()
    })
  }

  const handleOkButton = () => {
    if(imgUrl === ''){
      message.error('请选择图片'); 
      return
    }
    onOk((outerProps.imgUrl != null), {imgUrl, anchor, section})
  }
  return (
    <Modal title={MultiPicUrlForm.title} visible={show} centered 
      onOk={handleOkButton} onCancel={onCancel}>
      <FormItem label="添加区块" comp={
        <Button type="primary" icon="plus" onClick={addSection}/>
      }/>
      {
        section.map((item, index) => {
          return <LinkSection link={item} key={index} idx={index} 
            onChange={(link) => handleSectionChange(index, link)}
            onRemove={()=>handleSectionRemove(index)}/>
        })
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