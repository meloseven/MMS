import React from 'react';
import PropTypes from 'prop-types';
import config from './config';
import common from './common'
import fxShared from 'fx-shared'
Object.assign(SinglePicUrl, config.SinglePicUrl);
SinglePicUrl.propTypes = {
  //是否有链接触发行为
  hasTrigger: PropTypes.bool,
  //打开方式，0 h5本页，1 粉象， 2 淘宝，3 小程序
  openType: PropTypes.number,
  //链接
  url: PropTypes.string,
  //图片链接
  imgUrl: PropTypes.string,
  //锚点
  anchor: PropTypes.string
}
SinglePicUrl.defaultProps = {
  hasTrigger: false,
  openType: 0,
  url: '',
  imgUrl: '',
  anchor: ''
};

export default function SinglePicUrl (props){
  const {hasTrigger, openType, url, imgUrl, anchor} = props;

  const openUrl = () => {
    if(!hasTrigger) return;
    common.openUrl({openType, url})
  }
  
  return (
    <div className="single-pic-url" id={anchor}>
      <a onClick={openUrl}>
        <img src={imgUrl}/>
      </a>
      <style jsx>{`
        img{
          width: 100%;
        }
      `}</style>
    </div>
  )
}