import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import config from './config';
import common from './common'
import fxShared from 'fx-shared'
Object.assign(TabNavigator, config.TabNavigator);
TabNavigator.propTypes = {
  //菜单
  menu: PropTypes.arrayOf(PropTypes.shape({
    //名称
    name: PropTypes.string,
    //锚点
    anchor: PropTypes.string
  })),
  //背景色
  bgColor: PropTypes.string,
  //字体颜色
  fontColor: PropTypes.string,
  //选中字体颜色
  fontActiveColor: PropTypes.string,
  //边框颜色
  borderColor: PropTypes.string,
}
TabNavigator.defaultProps = {
  menu: [],
  bgColor: '#ffffff',
  fontColor: '#444444',
  fontActiveColor: '#000000',
  borderColor: '#000000',
};

const TouchCallbacks = () => {
  let touchStartX = 0;
  return {
    touchStart: (event, container) =>{
      touchStartX = event.touches.item(0).clientX;
      container.style['transition'] = 'none'
    },
    touchMove: (event, container, tab) =>{
      if(touchStartX !== 0){
        const touch = event.touches.item(0);
        const ctLeft = container.getBoundingClientRect().left;
        const ctWidth = container.getBoundingClientRect().width;
        const tabWidth = tab.getBoundingClientRect().width;
        let translateX = touchStartX - touch.clientX - ctLeft;
        if(translateX < -60){
            translateX = -60;
        }else if(translateX > (ctWidth - tabWidth + 60)){
            translateX = ctWidth - tabWidth + 60;
        }
        touchStartX = touch.clientX;
        container.style['transform'] = 'translateX(' + (-translateX) + 'px)';
      }
    },
    touchEnd:(event, container, tab) =>{
      touchStartX = 0;
      container.style['transition'] = 'transform .4s linear';
      const ctLeft = container.getBoundingClientRect().left;
      const ctWidth = container.getBoundingClientRect().width;
      const tabWidth = tab.getBoundingClientRect().width;
      if(ctLeft > 0){
          container.style['transform'] = 'translateX(0px)';
      }else if(ctLeft < (tabWidth - ctWidth)){
          container.style['transform'] ='translateX('+(tabWidth - ctWidth)+'px)';
      }
    }
  }
}

export default function TabNavigator (props){
  const {menu, bgColor, fontColor, fontActiveColor, borderColor} = props;
  const [activeIndex, setActiveIndex] = useState(-1);
  const [transform, setTransfrom] = useState('none');
  const [tabFix, setTabFix] = useState(false);
  const tabRef = useRef(null);
  const containerRef = useRef(null);
  const touchCb = TouchCallbacks();
  const changeTabSelect = (index) => {
    setActiveIndex(index)
    const container = containerRef.current;
    const tab = tabRef.current;
    const itemElem = container.children.item(index);
    const ctLeft = container.getBoundingClientRect().left;
    const tabWidth = tab.getBoundingClientRect().width;
    const left = itemElem.getBoundingClientRect().left
    const width = itemElem.getBoundingClientRect().width
    //当菜单藏在前面
    if(left < 0){
      let transX = left - ctLeft;
      container.style['transform'] = `translateX(-${transX}px)`
    //当菜单藏在后面
    }else if((left + width) > tabWidth){
      let transX = left - ctLeft - (tabWidth - width)
      container.style['transform'] = `translateX(-${transX}px)`
    }
  }
  const fixNav = ()=>{
    const tabInitTop = tabRef.current.getBoundingClientRect().top
    if(tabInitTop < 0){
      setTabFix(true)
    }else{
      setTabFix(false)
    }
  }
  const handleScroll = () => {
    menu.forEach((item, index)=> {
      let target = document.getElementById(item.anchor);
      if(target){
        let top = target.getBoundingClientRect().top;
        if(top > 0 && top < 200){
          changeTabSelect(index);
        }
      }
    })
    fixNav();
  }
  useEffect(() => {
    const tab = tabRef.current;
    const scrollFn = common.debounce(handleScroll, 10)
    const body = window.document.body;
    body.addEventListener('scroll', scrollFn);
    return ()=>{
      body.removeEventListener('scroll', scrollFn)
    }
  }, [])
  
  const handleMenuClick = (anchor, index) => {
    changeTabSelect(index);
    const target = document.getElementById(anchor);
    if(!target){
      return;
    }
    const targetTop = target.getBoundingClientRect().top;
    const tabHeight = tabRef.current.getBoundingClientRect().height;
    document.body.scrollTop = document.body.scrollTop + targetTop - tabHeight
    //document.documentElement.scrollTop = document.documentElement.scrollTop + targetTop - tabHeight
  }
  
  const handleTouchStart = (event)=>{
    touchCb.touchStart(event, containerRef.current)
  }
  const handleTouchMove = (event)=>{
    touchCb.touchMove(event, containerRef.current, tabRef.current)
  }
  const handleTouchEnd = (event)=>{
    touchCb.touchEnd(event, containerRef.current, tabRef.current)
  }

  return (
    <div className={`tab-nav`} ref={tabRef} 
      style={{backgroundColor: bgColor, color: fontColor}}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}>
      <div className={`tab-nav-cp${tabFix?' fixed':''}`} 
        style={{backgroundColor: bgColor}}>
        <div className="tab-container" ref={containerRef} style={{transform}}>
          {
            menu.map((item, index) => {
              return (
                <div className={`tab-item${activeIndex===index?' active':' '}`} 
                  onClick={()=>handleMenuClick(item.anchor, index)} key={index}>
                  {item.name}
                </div>
              )
            })
          }
        </div>
      </div>
      <style jsx>{`
        .active{
          border-bottom: 2px solid ${borderColor} !important;
          color:${fontActiveColor}
        }
      `}</style>
    </div>
  )
}