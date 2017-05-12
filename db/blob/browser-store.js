var blobs = require('idb-content-addressable-blob-store')
var store = blobs('./blobs.db')
var html = require('yo-yo')
var concat = require('concat-stream')
var root = document.body.appendChild(document.createElement('div'))
var state = { lastKey: '', value: '' }

update()
function update () {
  html.update(root, html`<div>
    <h1>write</h1>
    <form onsubmit=${writeSubmit}>
      <textarea name="msg"></textarea>
      <button type="submit">submit</button>
      <div>${state.lastKey}</div>
    </form>
    <h1>read</h1>
    <form onsubmit=${readSubmit}>
      <input type="text" name="key">
      <pre>${state.value}</pre>
    </form>
  </div>`)
  function writeSubmit (ev) {
    ev.preventDefault()
    var w = store.createWriteStream()
    w.once('finish', function () {
      state.lastKey = w.key.toString()
      update()
    })
    w.end(this.elements.msg.value)
  }
  function readSubmit (ev) {
    ev.preventDefault()
    var key = this.elements.key.value
    store.createReadStream(key).pipe(concat(function (body) {
      state.value = body.toString()
      update()
    }))
  }
}
