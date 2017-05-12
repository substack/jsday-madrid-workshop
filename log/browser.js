var level = require('level-browserify')
var db = level('./feed.db')
var to = require('to2')
var wsock = require('websocket-stream')
var hyperlog = require('hyperlog')
var log = hyperlog(db, { valueEncoding: 'json' })
var html = require('yo-yo')
var root = document.body.appendChild(document.createElement('div'))
var state = { messages: [] }
read()

function read () {
  var msgs = []
  log.createReadStream().pipe(to.obj(write, end))
  function write (row, enc, next) {
    msgs.push(row)
    next()
  }
  function end () {
    state.messages = msgs
    update()
  }
}

function update () {
  return html.update(root, html`<div>
    <form onsubmit=${add}>
      <textarea name="msg"></textarea>
      <button type="submit">POST</button>
    </form>
    <form onsubmit=${sync}>
      <input type="text" value="ws://" name="href">
      <button type="submit">SYNC</button>
    </form>
    <hr>
    <div>
      ${state.messages.map(function (msg) {
        return html`<pre>${JSON.stringify(msg)}</pre>`
      })}
    </div>
  </div>`)

  function add (ev) {
    ev.preventDefault()
    var msg = this.elements.msg.value
    var doc = { msg: msg }
    log.append(doc, function (err, node) {
      if (err) return console.error(err)
      state.messages.push(node)
      update()
    })
  }
  function sync (ev) {
    ev.preventDefault()
    var href = this.elements.href.value
    console.log('sync', href)
    var stream = wsock(href)
    stream.pipe(log.replicate()).pipe(stream)
  }
}
