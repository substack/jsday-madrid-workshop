var regl = require('regl')()
var mesh = require('teapot')
var draw = regl({
  frag: `
    precision highp float;
    void main () {
      gl_FragColor = vec4(0,1,0,1);
    }
  `,
  vert: `
    precision highp float;
    attribute vec3 position;
    void main () {
      gl_Position = vec4(position.xy*0.05,0,1);
    }
  `,
  attributes: {
    position: mesh.positions
  },
  elements: mesh.cells
})
draw()
