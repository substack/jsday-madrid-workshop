var html = require('choo/html')
var choo = require('choo')
var app = choo()
app.route('/', function (state, emit) {
  return html`<body>
    <h1>HELLO</h1>
    <div>${state.n*5}</div>
    <button onclick=${reset}>CLICK ME TO RESET</button>
  </body>`
  function reset () { emit('reset') }
})
app.use(function (state, emitter) {
  state.n = 0
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
