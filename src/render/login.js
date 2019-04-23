import React, {useState, useEffect} from 'react';
import {Input, Button, message} from 'antd';
import axios from 'axios';
import PexelsAPI from 'pexels-api-wrapper';
const pexelsClient = new PexelsAPI('563492ad6f917000010000010ea96d651d9841a087d6c63a997c9eb4');

function Login(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [bgSrc, setBgSrc] = useState('none');
  useEffect(()=>{
    pexelsClient.getCuratedPhotos(10, 1).then((res)=>{
      let photos = res.photos;
      let largeImages = photos.filter(item => {
        return (item.width/item.height > 1.3)
      })
      const getLandscape = photo => photo.src.landscape;
      setBgSrc(largeImages.length > 0? getLandscape(largeImages[0]) : getLandscape(photos[0]));
    })
  }, [])
  const login = ()=>{
    setLoading(true);
    if(username !== '' && password !== ''){
      axios({
        url:'/api/login',
        data: {
          username,
          password
        },
        method: 'post'
      }).then(({data})=>{
        if(data.code !== 200){
          setLoading(false);
          message.error(data.message);
          return
        }else{
          window.location.href = '/project/all'
        }
      },()=>{});
    }else{
      setLoading(false);
      message.error('请输入用户名或密码');
    }
  }
  return (
    <div className="login">
      <div className="mask">
        <div className="title">
          FMS
        </div>
        <div className="sub-title">
          The automatic platform that can create web page for FenxiangLife!
        </div>
        <div className="box">
          <div className="box-item">
            <Input addonBefore="用户" value={username} onChange={e=>setUsername(e.target.value)}/> 
          </div>
          <div className="box-item">
            <Input addonBefore="密码" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
          </div>
          <div className="box-item">
            <Button type="primary" onClick={()=>login()} loading={loading}>登录</Button>
          </div>
        </div>
        <div className="footer">©2019 杭州粉象家科技有限公司</div>
      </div>
      <style jsx>{`
        .login{
          width: 100%;
          height: 100%;
          background: url(${bgSrc}) no-repeat;
          background-size: 100% 100%;
          overflow: hidden;
        }
        .mask{
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 1;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        .title{
          font-size: 30px;
          font-family: Arial;
          color: #fff;
          padding-bottom: 30px;
        }
        .sub-title{
          font-size: 18px;
          font-family: Comic Sans MS;
          color: #fff;
          padding-bottom: 30px;
        }
        .box{
          width: 400px;
          background: #ffffff;
          padding: 50px 50px 18px 50px;
          display:flex;
          align-items: center;
          justify-content: center;
          text-align:center;
          flex-direction: column;
          border-radius: 4px;
        }
        .box-item{
          margin-bottom: 12px;
        }
        .footer{
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 12px;
          color: #FAFAFA;
        }
      `}</style>
    </div>
  )
}

export default (props) => <Login {...props}/>