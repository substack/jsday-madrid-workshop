var blobs = require('content-addressable-blob-store')
var store = blobs('./blobs.db')

if (process.argv[2] === 'write') {
  var w = store.createWriteStream()
  w.once('finish', function () {
    console.log(w.key.toString('hex'))
  })
  process.stdin.pipe(w)
} else if (process.argv[2] === 'read') {
  var key = process.argv[3]
  store.createReadStream(key).pipe(process.stdout)
}
