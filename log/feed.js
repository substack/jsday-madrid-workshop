var level = require('level')
var db = level('./feed.db')
var hyperlog = require('hyperlog')
var to = require('to2')
var log = hyperlog(db, { valueEncoding: 'json' })
var http = require('http')
var wsock = require('websocket-stream')

if (process.argv[2] === 'add') {
  var msg = process.argv[3]
  var links = process.argv.slice(4)
  var doc = { msg: msg }
  log.add(links, doc, function (err, node) {
    if (err) console.error(err)
    else console.log(node)
  })
} else if (process.argv[2] === 'list') {
  log.createReadStream()
    .pipe(to.obj(function (row, enc, next) {
      console.log(row)
      next()
    }))
} else if (process.argv[2] === 'server') {
  var server = http.createServer(function (req, res) {
    res.end('GO AWAY\n')
  })
  wsock.createServer({ server: server }, function (stream) {
    stream.pipe(log.replicate()).pipe(stream)
    stream.pipe(process.stdout)
  })
  server.listen(5005)
}
