import React, {useState, useEffect} from 'react'
import {Layout, Menu, Icon, Dropdown, Avatar, Affix} from 'antd'
import axios from 'axios';

const {
  Header, Content, Footer, Sider,
} = Layout;

const menus = [
  {
    iconType: 'project',
    name: '项目管理',
    path: '/project/'
  },
  {
    iconType: 'team',
    name: '成员管理',
    path: '/team/'
  },
  {
    iconType: 'file-jpg',
    name: '静态资源管理',
    path: '/static/'
  },
  {
    iconType: 'usb',
    name: '组件管理',
    path: '/component/'
  },
  {
    iconType: 'setting',
    name: '设置',
    path: '/setting/'
  },
  {
    iconType: 'read',
    name: '帮助说明',
    path: '/help/'
  }
]

function Frame(props){
  const [selectedKey, setSelectedKey] = useState('0');
  const [userInfo, setUserInfo] = useState(null);
  const [angle, setAngle] = useState(0)
  useEffect(()=>{
    axios({
      url:'/api/userInfo',
    }).then(({data})=>{
      if(data.code === 200) setUserInfo(data.data);
    })
    
    const {pathname} = window.location;
    const result = pathname.match(/\/([\w-]+)\//);
    if(result.length > 0){
      setSelectedKey('' + menus.findIndex(item => item.path === `/${result[1]}/`));
    }
  },[])
  const toModule = (path) => {window.location.href = path;}
  const logout = () => {
    axios({
      url: '/api/logout'
    }).then(({data})=>{
      if(data.code === 200){
        location.href = '/auth/login';
      }
    })
  }
 
  return (
    <Layout className="main" hasSider={true}>
      <Sider
        className="sider"
        collapsible={true}
      >
        <div className="logo">
          FMS
        </div>
        <Menu theme="dark" selectedKeys={[selectedKey]}>
          {
            menus.map((item, index) => (
              <Menu.Item key={'' + index} onClick={()=>toModule(item.path)}>
                <Icon type={item.iconType} />
                <span>{item.name}</span>
              </Menu.Item>
            ))
          }
        </Menu>
      </Sider>
      <Layout>
        <Header>
          <Dropdown overlay = {
            <Menu>
              <Menu.Item onClick={logout}>
                <a>退出</a>
              </Menu.Item>
            </Menu>
          } onVisibleChange={
            (visiable)=>setAngle(visiable?180:0)
          }>
            <a className="ant-dropdown-link">
              <Avatar style={{ backgroundColor: '#87d068', marginRight: '8px' }} icon="user" />
              {userInfo && userInfo.username}
              <Icon type='down' rotate={angle}/>
            </a>
          </Dropdown>
        </Header>
        <Content>
          {props.render()}
        </Content>
      </Layout>
    </Layout>
  )
}

export default function WrapComponent(InnerComponent){
  return (props) => <Frame render={()=><InnerComponent {...props}/>} {...props}></Frame>
}