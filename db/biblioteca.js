var level = require('level')
var db = level('./books.db', { valueEncoding: 'json' })
var randomBytes = require('crypto').randomBytes
var to = require('to2')
var strftime = require('strftime')

if (process.argv[2] === 'add-book') {
  var id = randomBytes(8).toString('hex')
  var title = process.argv.slice(3).join(' ')
  db.put('book!' + id, { title: title }, function (err) {
    if (err) console.error(err)
    else console.log(id)
  })
} else if (process.argv[2] === 'list-books') {
  var opts = { gt: 'book!', lt: 'book!~' }
  db.createReadStream(opts).pipe(to.obj(function (row, enc, next) {
    var id = row.key.split('!')[1]
    console.log(Object.assign({ id: id }, row.value))
    next()
  }))
} else if (process.argv[2] === 'add-patron') {
  var id = randomBytes(8).toString('hex')
  var name = process.argv.slice(3).join(' ')
  var now = new Date
  var doc = { name: name, date: now.valueOf() }
  db.batch([
    { type: 'put', key: 'patron!' + id, value: doc },
    { type: 'put', key: 'patron-date!' + strftime('%F %T',now) + '!' + id, value: '' },
    { type: 'put', key: 'patron-name!' + name + '!' + id, value: '' },
  ], function (err) {
    if (err) console.error(err)
  })
} else if (process.argv[2] === 'list-patrons') {
  var opts = { gt: 'patron!', lt: 'patron!~' }
  db.createReadStream(opts).pipe(to.obj(function (row, enc, next) {
    var id = row.key.split('!')[1]
    console.log(Object.assign({ id: id }, row.value))
    next()
  }))
} else if (process.argv[2] === 'list-patrons-by-date') {
  var opts = { gt: 'patron-date!', lt: 'patron-date!~' }
  db.createReadStream(opts).pipe(to.obj(function (row, enc, next) {
    var id = row.key.split('!')[2]
    db.get('patron!' + id, function (err, doc) {
      if (err) console.error(err)
      else console.log(Object.assign({ id: id }, doc))
    })
    next()
  }))
} else if (process.argv[2] === 'list-patrons-by-name') {
  var opts = { gt: 'patron-name!', lt: 'patron-name!~' }
  db.createReadStream(opts).pipe(to.obj(function (row, enc, next) {
    var id = row.key.split('!')[2]
    db.get('patron!' + id, function (err, doc) {
      if (err) console.error(err)
      else console.log(Object.assign({ id: id }, doc))
    })
    next()
  }))
}
