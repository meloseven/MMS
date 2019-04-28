module.exports = {
  local: {
    timeout: 1000*60,
    port: 8080,
    clientPort:8080
  },
  prod: {
    timeout: 1000*60,
    port: 8081,
    clientPort: 8082
  }
}