import React from 'react'
import ReactDOM from 'react-dom/server'
import {flushToHTML} from 'styled-jsx/server'
import moduleMaps from './map'
import './index.scss'
const conn = require('../model/mysql')

const router = ({comp, title, name}) =>{
  const rs = ReactDOM.renderToString(comp);
  const styles = flushToHTML();
  
  return `<!Doctype html>
    <html>
      <head>
        <meta charSet="utf-8"/>
        <title>${title}</title>
        <link href="/app.css" rel="stylesheet"/>
        ${styles}
      </head>
      <body>
        <div id="root">${rs}</div>
        <script src="/bundle.js"></script>
        <script>
          window.onload = function(){
            window._fms['${name}']();
          }
        </script>
      </body>
    </html>`
}


export default moduleMaps.reduce((prev, item) => {
  //check if async
  if(typeof item.comp().then === 'function'){
    prev[item.name] = async (ctx)=> {
      let Comp = await item.comp();
      return router({...item, comp: <Comp ctx={ctx}/>})
    }
  }else {
    let Comp = item.comp;
    prev[item.name] =(ctx) => router({...item, comp: <Comp ctx={ctx}/>})
  }
  return prev;
}, {})