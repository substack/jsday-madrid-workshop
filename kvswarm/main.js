var html = require('yo-yo')
var root = document.body.appendChild(document.createElement('div'))
var level = require('level-browserify')
var db = level('¡WOW!')
var hyperlog = require('hyperlog')
var sub = require('subleveldown')

var log = hyperlog(sub(db,'log'), { valueEncoding: 'json' })
var hyperkv = require('hyperkv')
var kv = hyperkv({ db: sub(db,'kv'), log: log })

var state = { currentKey: '', currentValue: {} }
update()

function update () {
  html.update(root, html`<div>
    <h1>${state.currentKey}</h1>
    <form onsubmit=${setValue}>
      <textarea name="content">${
        Object.keys(state.currentValue).map(function (key) {
          return '# ' + key + '\n' + state.currentValue[key].value
        })
      }</textarea>
      <button type="submit">SAVE</button>
    </form>
    <form onsubmit=${setKey}>
      <input type="text" name="key" value=${state.currentKey} />
      <button type="submit">load key</button>
    </form>
    <h1>sync</h1>
    <form onsubmit=${sync}>
      <button>SYNC</button>
    </form>
  </div>`)
  function setValue (ev) {
    ev.preventDefault()
    var key = state.currentKey
    var value = this.elements.content.value
    kv.put(key, value, function (err, node) {
      if (err) return console.error(err)
      state.currentValue[node.key] = { value: value }
      update()
    })
  }
  function setKey (ev) {
    ev.preventDefault()
    var key = this.elements.key.value
    state.currentKey = key
    state.currentValues = {}
    update()
    kv.get(key, function (err, values) {
      if (err) return console.error(err)
      state.currentValue = values
      update()
    })
  }
  function sync (ev) {
    ev.preventDefault()
    // TODO
  }
}
