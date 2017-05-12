var http = require('http')
var ecstatic = require('ecstatic')
var st = ecstatic(__dirname + '/public')
var onend = require('end-of-stream')

var counter = 0
var server = http.createServer(function (req, res) {
  console.log(req.method, req.url, req.headers)
  res.setHeader('set-cookie','visited-before=')
  if (req.url === '/' && !req.headers.cookie) {
    counter++
    streams.forEach(function (stream) {
      stream.write(counter + '\n')
    })
  }
  st(req, res)
})
server.listen(5000)

var wsock = require('websocket-stream')
var streams = []
wsock.createServer({ server: server }, function (stream) {
  streams.push(stream)
  stream.write(counter + '\n')
  onend(stream, function () {
    var i = streams.indexOf(stream)
    streams.splice(i,1)
  })
})
