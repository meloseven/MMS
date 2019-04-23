import React from 'react'
export default function({label, comp}){
  return (
    <div className="comp-item">
      <div className="comp-item-label">
        {label}
      </div>
      <div className="comp-item-cont">
        {comp}
      </div>
    </div>
  )
}