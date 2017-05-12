var http = require('http')
var ecstatic = require('ecstatic')
var st = ecstatic(__dirname + '/public')
var onend = require('end-of-stream')

var level = require('level')
var db = level('./counter.db')

var counter = 0
db.get('counter', function (err, value) {
  counter = Number(value || 0)
})

var server = http.createServer(function (req, res) {
  console.log(req.method, req.url, req.headers)
  res.setHeader('set-cookie','visited-before=')
  if (req.url === '/' && !req.headers.cookie) {
    counter++
    db.put('counter', counter, function (err) {
      if (err) console.error(err)
    })
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
