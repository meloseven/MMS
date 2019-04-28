import React, {useState, useEffect, Fragment, useRef} from 'react';
import Wrapper from './wrapper';
import {Table, Skeleton, Divider, Input, Button, Card, Icon, Tabs, Modal, Spin, message, Row, Col} from 'antd'
import axios from 'axios';
import util from '../util'
import componentForms from './forms'

const TabPane = Tabs.TabPane;
const padZero = str => str < 10 ? ('0' + str) : ('' + str);

function PageCreator(){
  const [showPane, setShowPane] = useState(false);
  const [compList, setCompList] = useState([])
  const [compsVisible, setCompsVisible] = useState([])
  const [spinning, setSpinning] = useState(true)
  const [iframeSrc, setIframeSrc] = useState('')
  const [selectedCompsList, setSelectedCompsList] = useState([])
  const [pageTitle, setPageTitle] = useState('')
  const [projectId, setProjectId] = useState('');
  const [pageId, setPageId] = useState(null);
  const [pagePathName, setPagePathName] = useState('');
  const [isDraft, setIsDraft] = useState(false);
  const [publishStatus, setPublishStatus] = useState(0)
  const iframeRef = useRef();
  useEffect(()=>{
    const qs = util.getQueryString();
    setProjectId(qs.projectId)
    //编辑模式
    if(qs.pageId){
      setPageId(qs.pageId)
      getPageInfo(qs.pageId)
      setIframeSrc(`/api/page/preview?pageId=${qs.pageId}`)
    }else{
      setIframeSrc('/api/page/preview')
    }
    componentForms.forEach(item => {
      setCompsVisible(compsVisList => {
        compsVisList.push({uid: item.uid, visible: false, props: {}})
        return compsVisList.slice();
      })
    })

    //获取所有组件
    axios({
      url: '/api/comp/getList'
    }).then(({data})=>{
      if(data.code === 200){
        setCompList(data.data)
      }
    })

    iframeRef.current.onload = function(){
      setSpinning(false);
    }
    

    //页面关闭时需要关闭ws
    window.onbeforeunload = ()=>{
      axios({url: '/api/page/close'})
    }

    let trackTimes = 0;
    //监听子窗口事件
    window.addEventListener('message', (event)=>{
      const data = event.data;
      if(data.type === 'edit'){
        const {uid, index, props} = data;
        openOrCloseModal(uid, true, props, index);
      }else if(data.type === 'mutate'){
        const {comps} = data;
        setSelectedCompsList(comps);
        //区分是否是componentDidUpdate
        if(trackTimes > 0){
          setIsDraft(true)
        }
        trackTimes += 1;
      }
    }, false)
  },[])


  const togglePane = () =>{
    setShowPane(!showPane);
  }
  const openOrCloseModal = (uid, show, props, index) =>{
    setCompsVisible(compsVisList => {
      return compsVisList.map(item => {
        if(item.uid === uid) {
          item.visible = show;
          item.props = props
          item.index = index;
        }
        return item;
      })
    });
  }
  const addComp = (uid, isEdit, index, props)=> {
    const url = isEdit ? '/api/comp/edit': '/api/comp/add'
    const postData = isEdit ? {uid, index, props}: {uid, props}
    axios({
      url,
      method: 'post',
      data: postData
    }).then(({data})=>{
      if(data.code === 200){
        openOrCloseModal(uid, false)
      }else{
        message.error(data.message)
      }
    }).catch(()=>{
      message.error('网络错误')
    })
  }

  const savePage = () => {
    if(pageTitle.length == 0){
      message.error('请先输入标题')
      return
    }
    if(pageId){
      return updatePage();
    }
    let pageInfo = {
      projectId,
      title: pageTitle,
      delta: selectedCompsList
    }
    return axios({
      url: '/api/page/save',
      method: 'post',
      data: pageInfo
    }).then(({data})=>{
      if(data.code === 200){
        message.success('保存成功')
        setPageId(data.data.pageId);
        setPagePathName(data.data.fileName)
        setIsDraft(false)
      }else{
        message.error(data.message)
      }
    })
  }

  const getPageInfo = (id) => {
    axios({
      url: '/api/page/detail',
      method: 'get',
      params: {
        id
      }
    }).then(({data})=>{
      if(data.code === 200){
        const pageInfo = data.data;
        setPageTitle(pageInfo.title)
        setPagePathName(pageInfo.fileName)
      }else{
        message.error(data.message)
      }
    }).catch(()=>{
      message.error('网络错误')
    })
  }

  const updatePage = ()=>{
    let pageInfo = {
      pageId,
      title: pageTitle,
      delta: selectedCompsList
    }
    return axios({
      url: '/api/page/update',
      method: 'post',
      data: pageInfo
    }).then(({data})=>{
      if(data.code === 200){
        message.success('保存成功')
        setIsDraft(false)
      }else{
        message.error(data.message)
      }
    })
  }

  const publishPage = () => {
    Modal.confirm({
      centered: true,
      title: '提示',
      content: '确认发布？',
      onOk: () =>{
        if(isDraft){
          setPublishStatus(1)
          savePage().then(() => {
            requestPublish();
          })
        }else{
          setPublishStatus(1)
          requestPublish();
        }
      }
    })
  }

  const requestPublish = () =>{
    axios({
      url: '/api/page/publish',
      method: 'post',
      data: {
        pageId
      }
    }).then(({data})=>{
      if(data.code === 200){
        setPublishStatus(2)
        setTimeout(()=>{
          setPublishStatus(0)
        }, 2000)
      }else{
        message.error(data.message)
      }
    }).catch(()=>{
      message.error('网络错误')
    })
  }

  const getLink = ()=>{
    const host = process.env.NODE_ENV === 'development'?'http://front.fenxianglife.com':'https://m.fenxianglife.com'
    const url = `${host}/fms/${projectId}/${pagePathName}/index.html`
    Modal.info({title: '页面链接', content: url})
  }

  const spinStyle = {
    width: '100%', 
    height: '100%', 
    display: 'flex', 
    alignItems:'center', 
    justifyContent:'center', 
    flexDirection:'column'
  }
  return (
    <div className="create">
      <div className="preview">
        <div className="phone" style={{transform: `translateX(${showPane?'-200px':'0'})`}}>
          <Spin tip="请稍等..." spinning={spinning} style={spinStyle}></Spin>
          <iframe src={iframeSrc} ref={iframeRef}>
          </iframe>
        </div>
      </div>
      <div className="tool" style={{right: showPane?'0':'-320px'}}>
        <div className="tool-toggle" onClick={togglePane}>
          <Icon type={showPane?`caret-right`:`caret-left`} style={{marginLeft: '8px'}}/>
        </div>
        <Tabs type="card" style={{width: '100%', flex: '1 1 auto',padding: '0 10px'}}>
          <TabPane tab="页面信息" key="1">
            <p>基本信息</p>
            <Row>
              <Col span={6}>标题</Col>
              <Col span={18}><Input value={pageTitle} onChange={(e)=>{setPageTitle(e.target.value)}}/></Col>
            </Row>
            <p>已选择组件</p>
          </TabPane>
          <TabPane tab="组件选择" key="2">
            {
              compList.map(item => (
                <div className="comp" key={item.uid} onClick={()=>openOrCloseModal(item.uid, true)}>
                  {
                    item.title
                  }
                </div>
              ))
            }
          </TabPane>
          <TabPane tab="分享信息" key="3">
          </TabPane>
        </Tabs>
        <div className="tool-bottom">
          <Button type="primary" icon="save" onClick={savePage}>保存</Button>
          <Button type="primary" icon="link" style={{marginLeft: '10px'}} onClick={getLink} disabled={!pageId}>链接</Button>
          <Button type="danger" icon="rocket" style={{marginLeft: '10px'}} onClick={publishPage} loading={publishStatus==1} disabled={!pageId}>
            {
              publishStatus === 0?'发布':(publishStatus === 1?'发布中...': '发布成功！')
            }
          </Button>
        </div>
      </div>
      <Fragment>
        {
          componentForms.map(CompForm => {
            let visItem = compsVisible.find(item => item.uid === CompForm.uid)
            let visible = false
            let props = {};
            let index = 0;
            if(visItem){
              visible = visItem.visible
              props = visItem.props
              index = visItem.index
            }
            return <CompForm 
              onOk={(isEdit, ...params)=>addComp(CompForm.uid, isEdit, index, ...params)} 
              onCancel={()=>openOrCloseModal(CompForm.uid, false)} 
              visible={visible} 
              key={CompForm.uid}
              {...props}/>
          })
        }
      </Fragment>
    </div>
  )
}
export default Wrapper(PageCreator);