const bunyan = require('bunyan');
const fs = require('fs');

const logPath = '/var/log/fms-error.log';

module.exports = bunyan.createLogger({
  name: 'fms',
  serializers: {
    err: bunyan.stdSerializers.err
  },
  streams: [
    {
      level: 'info',
      stream: process.stdout
    }/* ,
    {
      type: 'rotating-file',
      level: 'error',
      path: '/var/log/fms-error.log',
      period: '1d'
    } */
  ]
})
