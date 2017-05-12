var level = require('level-browserify')
var db = level('./books.db', { valueEncoding: 'json' })
var Library = require('./books.js')
var to = require('to2')
var books = Library(db)
var root = document.body.appendChild(document.createElement('div'))

var html = require('yo-yo')
var state = { books: [] }
books.listBooks().pipe(to.obj(function (row, enc, next) {
  state.books.push(row)
  next()
  update()
}))
update()

function update () {
  html.update(root, html`<div>
    <h1>add book</h1>
    <form onsubmit=${addBook}>
      <input type="text" name="title">
      <button type="submit">add book</title>
    </form>
    <hr>
    <div>
      ${state.books.map(function (book) {
        return html`<div>${book.id}: ${book.title}</div>`
      })}
    </div>
  </div>`)
  function addBook (ev) {
    ev.preventDefault()
    var title = this.elements.title.value
    books.addBook(title, function (err, id) {
      if (err) return console.error(err)
      state.books.push({ title: title, id: id })
      update()
    })
  }
}
