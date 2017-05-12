var level = require('level')
var db = level('./cool.db')

db.get('count', function (err, value) {
  var count = Number(value || 0) + 1
  db.put('count', count, function (err) {
    if (err) console.error(err)
    else console.log(count)
  })
})
