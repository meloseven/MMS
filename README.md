# MMS 

H5页面搭建工具

动态创建移动端页面，支持自定义组件

## 必备条件

Redis
MySQL

## 开始

```shell
npm start
```

### 数据结构
页面数据结构：
PageFormats Array<SelfComponent>
SelfComponent Object {uid, props:{}}

通信数据结构：
changeFormats 
{
  uid: ‘’,
  action: ‘d/a/m’, (delete add modify)
  props: {}
}
