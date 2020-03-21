// FILE: <project>/backend/src/routes.js
'use strict'

const httpProxy = require('http-proxy')
const apiProxy = httpProxy.createProxyServer()
const CodeGeneratorController = require('./controllers/CodeGeneratorController')

// location of our exported language server
const LANGUAGE_SERVER = 'http://localhost:8090/'

/*
 * When an error with our proxy set up occures, we have to handle it
 * in some way. Otherwise our server will crash.
 * In this case we just print the error, and forward it to the client.
 */
apiProxy.on('error', function (error, req, res) {
  console.error('Proxy error:', error)
  if (!res.headersSent) {
    res.writeHead(500, { 'content-type': 'application/json' })
  }

  const json = { error: 'proxy_error', reason: error.message }
  res.end(JSON.stringify(json))
})

module.exports = (app) => {
  // Forward all types of HTTP request to the LANGUAGE_SERVER
  app.all('/xtext-service/*', function (req, res) {
    apiProxy.web(req, res, { target: LANGUAGE_SERVER })
  })

  app.post('/compile',
    CodeGeneratorController.compileToJS)
}
