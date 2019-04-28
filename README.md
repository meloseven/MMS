# 粉象生活FMS 

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
