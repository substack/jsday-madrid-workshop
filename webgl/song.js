var ms = [3,-2,5,9,17,-4,-6,8,4]

module.exports = function (t) {
  var m = Math.pow(2,ms[Math.floor(t*8)%ms.length]/12)
  var n = t % 2 > 1 ? 8 : 1
  return 0
    + sin_(sin(100)+sin(50),sin(1)*0.1+0.5)
      * Math.pow((1-saw(8))*0.5,4)
    + sin_(sin(80)+sin(40)+tri(800),sin(8)*0.2+.8)
      * Math.pow((1-saw(n))*0.5,8)*0.4
    + sin_(sin(400*m)+sin(200*m+4),sin(1)*0.1+.1)
      * Math.pow((1-saw(8))*0.5,8)*0.8
    

  function tri_ (x,t) { return Math.abs(1 - t % (1/x) * x * 2) * 2 - 1 }
  function tri (x) { return tri_(x,t) }
  function saw_ (x,t) { return t%(1/x)*x*2-1 }
  function saw (x) { return saw_(x,t) }
  function sin_ (x,t) { return Math.sin(2 * Math.PI * t * x) }
  function sin (x) { return sin_(x,t) }
  function sq_ (x,t) { return t*x % 1 < 0.5 ? -1 : 1 }
  function sq (x) { return sq_(x,t) }
  function clamp (x) { return Math.max(-1,Math.min(1,x)) }
}
