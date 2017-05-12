var regl = require('regl')()
var camera = require('regl-camera')(regl, {
  distance: 50, phi: 0.1, theta: Math.PI/2 })
var teapot = require('teapot')

function createTeapot () {
  return regl({
    frag: `
      precision highp float;
      void main () {
        gl_FragColor = vec4(0,1,1,1);
      }
    `,
    vert: `
      precision highp float;
      attribute vec3 position;
      uniform mat4 projection, view;
      void main () {
        gl_Position = projection * view * vec4(position,1);
      }
    `,
    attributes: {
      position: teapot.positions
    },
    elements: teapot.cells
  })
}
var draw = {
  teapot: createTeapot()
}
regl.frame(function () {
  camera(function () {
    regl.clear({ color: [0,0,0,1], depth: true })
    draw.teapot()
  })
})
