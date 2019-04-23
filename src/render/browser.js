import React from 'react';
import { hydrate } from 'react-dom'
import moduleMaps from './map'

const preloadedState = window.__PRELOADED_STATE__

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__

const reRender = ({comp, title, name}) => {
  hydrate(
    comp,
    document.getElementById('root')  
  )
}
window._fms = {}
moduleMaps.forEach(item => {
  window._fms[item.name] = () => reRender({...item, comp: <item.comp/>})
})