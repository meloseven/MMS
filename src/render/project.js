import React, {useState, useEffect} from 'react';
import Wrapper from './wrapper';
import {Table, Skeleton, Divider, Input, Button} from 'antd'
import axios from 'axios';

const {Column, ColumnGroup} = Table;
const {Search} = Input;
const padZero = str => str < 10 ? ('0' + str) : ('' + str);

function Project(){
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    axios({
      url: '/api/project/getList?_t='+Date.now(),
    }).then(({data})=>{
      if(data.code === 200){
        setListData(data.data);
      }
      setLoading(false);
    })
  },[])
  const toAdd = () => {
    location.href = '/project/add'
  }
  return (
    <div className="project">
      <div className="toolbar">
        <div className="left">
          <Button type="primary" shape="round" icon="plus" onClick={toAdd}>新建</Button>
        </div>
        <div className="right">
          <Search placeholder="请输入关键词进行搜索" onSearch={()=>{}} style={{width: 200}}/>
        </div>
      </div>
      <div className="content">
        <Table dataSource = {listData} loading={loading} pagination={{
          pageSize: 10
        }}>
          <Column align='center' title="项目名称" dataIndex="proname"/>
          <Column align='center' title="项目目录" dataIndex="dir"/>
          <Column align='center' title="创建者" dataIndex="username"/>
          <Column align='center' title="创建时间" dataIndex="time" render={(time)=>{
            let date = new Date(time);
            return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} 
            ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`
          }}/>
          <Column title="操作" key="action" fixed="right" dataIndex="id" render={(id)=>(
            <span>
              <a href="javascript:;">编辑</a>
              <Divider type="vertical" />
              <a href={`/project/page?projectId=${id}`}>页面管理</a>
              <Divider type="vertical" />
              <a href="javascript:;">删除</a>
            </span>
          )}/>
        </Table>
      </div>
      <style jsx>{`
          
        `}</style>
    </div>
  )
}
export default Wrapper(Project);