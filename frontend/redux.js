var html = require('yo-yo')
var EventEmitter = require('events').EventEmitter

var state = { n: 0 }
var emitter = new EventEmitter

var root = document.body.appendChild(document.createElement('div'))
update()

emitter.on('increment', function () {
  state.n ++
  emitter.emit('render')
})
emitter.on('reset', function () {
  state.n = 0
  emitter.emit('render')
})
emitter.on('render', update)

setInterval(function () {
  emitter.emit('increment')
}, 1000)

function update () {
  html.update(root, html`<div>
    <h1>HELLO</h1>
    <div>${state.n*11}</div>
    <button onclick=${reset}>CLICK ME TO RESET</button>
  </div>`)
  function reset () {
    emitter.emit('reset')
  }
}
