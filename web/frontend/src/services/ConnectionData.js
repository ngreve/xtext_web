// FILE: <project>/frontend/src/services/ConnectionData.js

module.exports = {
  baseUrl: (process.env.NODE_ENV === 'production') ? '<domain_or_IP>/api/' : 'localhost:8090/',
  protocol: 'http://'
}
