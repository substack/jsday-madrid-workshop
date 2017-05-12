var randomBytes = require('crypto').randomBytes
var through = require('through2')
var strftime = require('strftime')
var pumpify = require('pumpify')

module.exports = Library

function Library (db) {
  if (!(this instanceof Library)) return new Library(db)
  this.db = db
}
Library.prototype.addBook = function (title, cb) {
  var id = randomBytes(8).toString('hex')
  this.db.put('book!' + id, { title: title }, function (err) {
    if (err) cb(err)
    else cb(null, id)
  })
}
Library.prototype.listBooks = function () {
  var opts = { gt: 'book!', lt: 'book!~' }
  return pumpify.obj(
    this.db.createReadStream(opts),
    through.obj(function (row, enc, next) {
      var id = row.key.split('!')[1]
      next(null, Object.assign({ id: id }, row.value))
    })
  )
}
Library.prototype.addPatron = function (name, cb) {
  var id = randomBytes(8).toString('hex')
  var now = new Date
  var doc = { name: name, date: now.valueOf() }
  this.db.batch([
    { type: 'put', key: 'patron!' + id, value: doc },
    { type: 'put', key: 'patron-date!' + strftime('%F %T',now) + '!' + id, value: '' },
    { type: 'put', key: 'patron-name!' + name + '!' + id, value: '' },
  ], function (err) {
    if (err) cb(err)
    else cb(null, id)
  })
}
Library.prototype.listPatrons = function () {
  var opts = { gt: 'patron!', lt: 'patron!~' }
  return pumpify.obj(
    this.db.createReadStream(opts),
    through.obj(function (row, enc, next) {
      var id = row.key.split('!')[1]
      next(null, Object.assign({ id: id }, row.value))
    })
  )
}
Library.prototype.listPatronsByDate = function () {
  var opts = { gt: 'patron-date!', lt: 'patron-date!~' }
  var db = this.db
  return pumpify.obj(
    db.createReadStream(opts),
    through.obj(function (row, enc, next) {
      var id = row.key.split('!')[2]
      db.get('patron!' + id, function (err, doc) {
        if (err) next(err)
        else next(null, Object.assign({ id: id }, doc))
      })
    })
  )
}
Library.prototype.listPatronsByName = function () {
  var opts = { gt: 'patron-name!', lt: 'patron-name!~' }
  var db = this.db
  return pumpify.obj(
    db.createReadStream(opts),
    through.obj(function (row, enc, next) {
      var id = row.key.split('!')[2]
      db.get('patron!' + id, function (err, doc) {
        if (err) next(err)
        else next(null, log(Object.assign({ id: id }, doc)))
      })
    })
  )
}
