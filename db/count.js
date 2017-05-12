var level = require('level-browserify')
var db = level('./cool.db')
var html = require('yo-yo')
var root = document.body.appendChild(document.createElement('div'))

var count = '?'
update()
function update () {
  html.update(root, html`<div>
    <h1>COUNT=${count}</h1>
  </div>`)
}

db.get('count', function (err, value) {
  count = Number(value || 0) + 1
  update()
  db.put('count', count, function (err) {
    if (err) console.error(err)
  })
})
