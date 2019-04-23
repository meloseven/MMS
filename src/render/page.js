import React, {useState, useEffect} from 'react';
import Wrapper from './wrapper';
import {Table, Skeleton, Divider, Input, Button, Card, Icon} from 'antd'
import axios from 'axios';
import util from '../util'

const { Meta } = Card;
const {Search} = Input;
const padZero = str => str < 10 ? ('0' + str) : ('' + str);

function Page(){
  const [listData, setListData] = useState([]);
  const [projectId, setProjectId] = useState('');
  useEffect(()=>{
    setProjectId(util.getQueryString().projectId)
    axios({
      url: '/api/page/getList',
    }).then(({data})=>{
      if(data.code === 200){
        setListData(data.data);
      }
    })
  },[])
  return (
    <div className="page">
      <div className="toolbar">
        <div className="left">
          <Button type="primary" shape="round" icon="plus" onClick={()=>(location.href= `/project/page/create?projectId=${projectId}`)}>新建</Button>
        </div>
        <div className="right">
          <Search placeholder="请输入关键词进行搜索" onSearch={()=>{}} style={{width: 200}}/>
        </div>
      </div>
      <div className="content">
        {
          listData.map(item =>(
            <Card 
              style={{display: 'inline-block', width: 200,marginTop: '10px', marginLeft:'10px'}}
              cover={<img src={item.snapshot}/>}
              actions = {
                [<Icon type="setting" />, 
                <Icon type="edit" onClick={() => location.href= `/project/page/create?projectId=${projectId}&pageId=${item.id}`}/>, 
                <Icon type="ellipsis" />]
                }
              >
              <div className="card-content">
                {item.title}
              </div>
            </Card>
          ))
        }
      </div>
      <style jsx>{`
          
        `}</style>
    </div>
  )
}
export default Wrapper(Page);