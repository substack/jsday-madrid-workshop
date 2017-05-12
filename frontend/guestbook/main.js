var html = require('choo/html')
var choo = require('choo')
var app = choo()

var to = require('to2')
var split = require('split2')
var wsock = require('websocket-stream')
var stream = wsock('ws://' + location.host)

app.use(function (state, emitter) {
  stream.pipe(split()).pipe(to(function (buf, enc, next) {
    var count = Number(buf.toString())
    emitter.emit('count', count)
    next()
  }))
})

app.route('/', function (state, emit) {
  return html`<body>
    <h1>HELLO</h1>
    <div>${state.n*5}</div>
    <button onclick=${reset}>CLICK ME TO RESET</button>
    <div>NUMBER OF COOL PEEPS ${state.count}</div>
  </body>`
  function reset () { emit('reset') }
})
app.use(function (state, emitter) {
  state.n = 0
  state.count = 0
  emitter.on('count', function (count) {
    state.count = count
    emitter.emit('render')
  })
  emitter.on('increment', function () {
    state.n ++
    emitter.emit('render')
  })
  emitter.on('reset', function () {
    state.n = 0
    emitter.emit('render')
  })
  setInterval(function () {
    emitter.emit('increment')
  }, 1000)
})
app.mount('body')
