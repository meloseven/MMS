import React from 'react';
import PropTypes from 'prop-types';
import config from './config';
Object.assign(Hello, config.Hello);
Hello.propTypes = {
  color: PropTypes.string
}
export default function Hello (props){
  return (
    <div style={{...props}}>Hello FMS.</div>
  )
}