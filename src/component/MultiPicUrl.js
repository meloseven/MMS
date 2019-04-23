import React from 'react';
import PropTypes from 'prop-types';
import config from './config';
import common from './common'
import fxShared from 'fx-shared'
Object.assign(MultiPicUrl, config.MultiPicUrl);
MultiPicUrl.propTypes = {
  //图片链接
  imgUrl: PropTypes.string,
  //锚点
  anchor: PropTypes.string,
  //片段
  section: PropTypes.arrayOf(PropTypes.shape({
    //打开方式，0 h5本页，1 粉象， 2 淘宝，3 小程序
    openType: PropTypes.number,
    //链接
    url: PropTypes.string
  }))
}
MultiPicUrl.defaultProps = {
  imgUrl: '',
  anchor: '',
  section: []
};

export default function MultiPicUrl (props){
  const {section, imgUrl, anchor} = props;

  return (
    <div className="multi-pic-url" id={anchor}>
      <img src={imgUrl}/>
      <div className="pic-hover">
        {
          section.map((item, index) => {
            return <div className="pic-hover-item" onClick={() => common.openUrl(item)} key={index}></div>
          })
        }
      </div>
      <style jsx>{`
        img{
          width: 100%;
        }
        .multi-pic-url{
          position: relative;
        }
        .pic-hover{
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          display: flex;
        }
        .pic-hover-item{
          flex:1 1 auto;
        }
      `}</style>
    </div>
  )
}