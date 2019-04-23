import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import config from './config';
import common from './common'
import 'lazysizes';
import axios from 'axios';
import {Toast} from 'antd-mobile'
import fxShared from 'fx-shared'
import wx from 'weixin-js-sdk'
import request from './request'

Object.assign(SelfGoodsList, config.SelfGoodsList);
SelfGoodsList.propTypes = {
  //专题ID
  topicId: PropTypes.string,
  //样式 一排一列，一排两列，一排三列
  type: PropTypes.oneOf(['1R1C', '1R2C', '1R3C']),
  //标签
  tag: PropTypes.string
}
SelfGoodsList.defaultProps = {
  topicId: '',
  type: '1R2C',
  tag: ''
};

const requestList = (topicId) => {
  const host = process.env._isTest?common.apiHost.self.dev: common.apiHost.self.prod;
  const url = host + common.urls.self.getGoodsList;
  return axios.post(url, {
    topicId
  })
}

const TwoColumn = ({item}) =>{
  const saleText = item.salesNum > 0 ? `月销 ${item.salesNum}`: '上新'
  return (
    <Fragment>
      <div className="img-cover">
        <img className="lazyload" data-src={item.defaultPicUrl}/>
      </div>
      <div className="goods-title">
        <div className="goods-title-text">
          {item.itemTitle}
        </div>
      </div>
      <div className="goods-coupon">
        <div className="goods-coupon-1">
          奖 ¥{(item.agentFee/100).toFixed(2)}
        </div>
      </div>
      <div className="goods-price">{(item.salePrice/100).toFixed(2)}</div>
      <div className="goods-bottom">
        <div className="goods-org-price">{(item.marketPrice/100).toFixed(2)}</div>
        <div className="goods-sales">{saleText}</div>
      </div>
    </Fragment>
  )
}

const ThreeColumn = ({item}) =>{
  const saleText = item.salesNum > 0 ? `月销 ${item.salesNum}`: '上新'
  return (
    <Fragment>
      <div className="img-cover">
        <img className="lazyload" data-src={item.defaultPicUrl}/>
      </div>
      <div className="goods-title">
        <div className="goods-title-text">
          {item.itemTitle}
        </div>
      </div>
      <div className="goods-coupon">
        <div className="goods-coupon-1">
          奖¥{(item.agentFee/100).toFixed(2)}
        </div>
      </div>
      <div className="goods-price">
        <div className="goods-now-price">{(item.salePrice/100).toFixed(2)}</div>
        <div className="goods-org-price">{(item.marketPrice/100).toFixed(2)}</div>
      </div>
      <div className="goods-sales">{saleText}</div>
    </Fragment>
  )
}

const OneColumn = ({item, tag}) => {
  const saleText = item.salesNum > 0 ? `月销 ${item.salesNum}`: '上新'
  return (
    <Fragment>
      <div className="item-left">
        <div className="img-cover">
          <img className="lazyload" data-src={item.defaultPicUrl}/>
        </div>
      </div>
      <div className="item-right">
        <div className="goods-title">
          <div className="goods-title-text">
            {item.itemTitle}
          </div>
        </div>
        <div className="goods-price">
          <div className="goods-org-price">{(item.marketPrice/100).toFixed(2)}</div>
          <div className="goods-coupon">
            <div className="goods-coupon-1">
              <span style={{fontSize: '10px'}}>奖</span> ¥{(item.agentFee/100).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="goods-sales">{saleText}</div>
        <div className="goods-bottom">
          <div className="goods-now-price">¥<span className="num">{(item.salePrice/100).toFixed(2)}</span><span className="info">抢购价</span></div>
          <div className="buy-btn">
            <span>立即抢</span>
            <i className="buy-btn-icon"></i>
          </div>
        </div>
        <div className="flag">{tag}</div>
      </div>
    </Fragment>
  )
}

export default function SelfGoodsList (props){
  const {topicId, type, tag} = props;
  const [list, setList] = useState([]);
  const [isMini, setIsMini] = useState(false)
  useEffect(() => {
    requestList(topicId).then(({data}) => {
      if(data.code === 200){
        if(data.data && data.data.topicItemList){
          setList(data.data.topicItemList);
        }
      }else{
        Toast.fail(data.data.message)
      }
    }).catch(e => {
      Toast.fail('网络错误')
    })
  }, [])

  useEffect(() => {
    wx.miniProgram.getEnv((res) => {
      setIsMini(res.miniprogram)
    });
  }, [])

  const liClass = (type === '1R1C' ? 'one-column' : (type === '1R2C' ? 'two-column': 'three-column'))
  const ColumnElem = (type === '1R1C' ? OneColumn : (type === '1R2C' ? TwoColumn: ThreeColumn))
  
  const toDetail = (id) => {
    if(isMini){
      wx.miniProgram.navigateTo({
        url:`/pages/selfhome/detail/index?id=${id}`
      })
    }else if(!common.env.isShared){
      fxShared.brige.openMiniApp(`/pages/selfhome/detail/index?id=${id}`)
    }else{
      request.getUserInfo().then((userInfo) =>{
        const invitedCode = userInfo.vipInvitationCode?userInfo.vipInvitationCode:userInfo.invitationCode
        window.location.href = `/act/invite/index.html?code=${invitedCode}&source=topic`;
      })
    }
  }

  return (
    <div className="goods-list goods-self">
      <ul>
        {
          list.map(item => {
            return (
              <li key={item.id} className={liClass} onClick={()=>toDetail(item.id)}>
                <div className='goods-item'>
                  <ColumnElem item={item} tag={tag}/>
                </div>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}