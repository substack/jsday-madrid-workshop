var regl = require('regl')()
var camera = require('regl-camera')(regl, {
  distance: 50, phi: 0.1, theta: Math.PI/2 })
var teapot = require('teapot')
var bunny = require('bunny')
var glsl = require('glslify')
var anormals = require('angle-normals')

function createTeapot () {
  var mesh = bunny
  return regl({
    frag: glsl`
      precision highp float;
      #pragma glslify: snoise = require('glsl-noise/simplex/4d')
      #pragma glslify: hsl2rgb = require('glsl-hsl2rgb')
      uniform float time;
      varying vec3 vpos;
      void main () {
        float h = snoise(vec4(vpos*0.2,time*0.1))*0.2;
        gl_FragColor = vec4(hsl2rgb(h,1.0,0.5),1);
      }
    `,
    vert: glsl`
      precision highp float;
      #pragma glslify: snoise = require('glsl-noise/simplex/4d')
      attribute vec3 position, normal;
      uniform mat4 projection, view;
      uniform float time;
      varying vec3 vpos;
      void main () {
        vpos = position + normal*snoise(vec4(position,time))*0.5;
        gl_Position = projection * view * vec4(vpos,1);
      }
    `,
    attributes: {
      position: mesh.positions,
      normal: anormals(mesh.cells, mesh.positions)
    },
    uniforms: {
      time: regl.context('time')
    },
    elements: mesh.cells
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
