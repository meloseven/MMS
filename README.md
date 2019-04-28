# 粉象生活FMS 

通过页面操作，可以动态创建移动端页面，且支持自定义组件

## 必备条件

Redis
MySQL

## 开始

```shell
npm start
```
<<<<<<< HEAD

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
=======
>>>>>>> 88d2dfd044b1fd9fdbb4506caa9e61c7592b4094
