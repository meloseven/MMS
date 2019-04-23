import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import config from './config';
import common from './common'
import 'lazysizes';
import axios from 'axios';
import {Toast} from 'antd-mobile'
import fxShared from 'fx-shared'

Object.assign(GoodsList, config.GoodsList);
GoodsList.propTypes = {
  //专题ID
  topicId: PropTypes.string,
  //显示数量
  quantity: PropTypes.number,
  //样式 一排一列，一排两列，一排三列
  type: PropTypes.oneOf(['1R1C', '1R2C', '1R3C']),
  //标签
  tag: PropTypes.string
}
GoodsList.defaultProps = {
  topicId: '',
  quantity: 12,
  type: '1R2C',
  tag: ''
};

const requestList = (topicId, pageSize) => {
  const host = process.env._isTest?common.apiHost.njia.dev: common.apiHost.njia.prod;
  const url = host + common.urls.njia.getGoodsList;
  return axios.get(url, {
    params: {
      topicId,
      page: 0,
      size: pageSize
    }
  })
}

const getSourceIcon = (shopType) =>{
  switch(shopType){
    case 'B':
      return common.assetsPath + 'icon_tmall.svg';
    case 'C':
      return common.assetsPath + 'icon_taobao.svg';
    case 'J':
      return common.assetsPath + 'icon_jd.svg';
    case 'D':
      return common.assetsPath + 'icon_pdd.svg';
  }
}

const TwoColumn = ({item}) =>{
  const count = item.itemPrice-item.itemDiscountPrice
  const saleText = item.itemSale > 0 ? `月销 ${item.itemSale}`: '上新'
  return (
    <Fragment>
      <div className="img-cover">
        <img className="lazyload" data-src={item.itemPicUrl}/>
      </div>
      <div className="goods-title">
        <div className="goods-title-from">
          <img src={getSourceIcon(item.shopType)}/>
        </div>
        <div className="goods-title-text">
          {item.itemFullTitle}
        </div>
      </div>
      <div className="goods-coupon">
        <div className="goods-coupon-1">
          奖 ¥{(item.totalComm/100).toFixed(2)}
        </div>
        <div className="goods-coupon-2">
          ¥{(count/100).toFixed(2)}
        </div>
      </div>
      <div className="goods-price">{(item.itemDiscountPrice/100).toFixed(2)}</div>
      <div className="goods-bottom">
        <div className="goods-org-price">{(item.itemPrice/100).toFixed(2)}</div>
        <div className="goods-sales">{saleText}</div>
      </div>
    </Fragment>
  )
}

const ThreeColumn = ({item}) =>{
  const count = item.itemPrice-item.itemDiscountPrice
  const saleText = item.itemSale > 0 ? `月销 ${item.itemSale}`: '上新'
  return (
    <Fragment>
      <div className="img-cover">
        <img className="lazyload" data-src={item.itemPicUrl}/>
      </div>
      <div className="goods-title">
        <div className="goods-title-from">
          <img src={getSourceIcon(item.shopType)}/>
        </div>
        <div className="goods-title-text">
          {item.itemFullTitle}
        </div>
      </div>
      <div className="goods-coupon">
        <div className="goods-coupon-1">
          奖¥{(item.totalComm/100).toFixed(2)}
        </div>
        <div className="goods-coupon-2">
          券¥{(count/100).toFixed(2)}
        </div>
      </div>
      <div className="goods-price">
        <div className="goods-now-price">{(item.itemDiscountPrice/100).toFixed(2)}</div>
        <div className="goods-org-price">{(item.itemPrice/100).toFixed(2)}</div>
      </div>
      <div className="goods-sales">{saleText}</div>
    </Fragment>
  )
}

const OneColumn = ({item, tag}) => {
  const count = item.itemPrice-item.itemDiscountPrice
  const saleText = item.itemSale > 0 ? `月销 ${item.itemSale}`: '上新'
  return (
    <Fragment>
      <div className="item-left">
        <div className="img-cover">
          <img className="lazyload" data-src={item.itemPicUrl}/>
        </div>
      </div>
      <div className="item-right">
        <div className="goods-title">
          <div className="goods-title-from">
            <img src={getSourceIcon(item.shopType)}/>
          </div>
          <div className="goods-title-text">
            {item.itemFullTitle}
          </div>
        </div>
        <div className="goods-price">
          <div className="goods-org-price">{(item.itemPrice/100).toFixed(2)}</div>
          <div className="goods-coupon">
            <div className="goods-coupon-2">
              <span>¥{(count/100).toFixed(2)}</span>
            </div>
            <div className="goods-coupon-1">
              <span style={{fontSize: '10px'}}>奖</span> ¥{(item.totalComm/100).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="goods-sales">{saleText}</div>
        <div className="goods-bottom">
          <div className="goods-now-price">¥<span className="num">{(item.itemDiscountPrice/100).toFixed(2)}</span><span className="info">{count>0?'券后价':'抢购价'}</span></div>
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

export default function GoodsList (props){
  const {topicId, quantity, type, tag} = props;
  const [list, setList] = useState([]);
  useEffect(() => {
    requestList(topicId, quantity).then(({data}) => {
      if(data.code === 200){
        setList(data.data.list);
      }else{
        Toast.fail(data.data.message)
      }
    }).catch(e => {
      Toast.fail('网络错误')
    })
  }, [])

  const liClass = (type === '1R1C' ? 'one-column' : (type === '1R2C' ? 'two-column': 'three-column'))
  const ColumnElem = (type === '1R1C' ? OneColumn : (type === '1R2C' ? TwoColumn: ThreeColumn))
  
  const toDetail = (itemId, shopType) => {
    const env = common.env;
    const params = {
      itemId,
      shopType,
      existed: 1,
      token: env.queryInfo.token,
      uid: env.queryInfo.uid
    }
    const link = Object.keys(params).reduce((prev, item)=>{
      prev.push(`${item}=${params[item]}`)
      return prev;
    }, []).join('&');
    //在粉象APP内
    if(!env.isShared){
      if(!env.isLogin){
        fxShared.brige.openLogin();
      }else{
        common.executeFrame(`nplus://nativePage/productDetail?${link}`)
      }
      return;
    }else{
      location.href = `/better-m/detail/index.html?${link}`
    }
  }

  return (
    <div className="goods-list">
      <ul>
        {
          list.map(item => {
            return (
              <li key={item.id} className={liClass} onClick={()=>toDetail(item.itemId, item.shopType)}>
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