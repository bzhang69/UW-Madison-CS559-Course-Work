precision highp float;
uniform float time;
uniform vec2 resolution;
varying vec3 fPosition;
varying vec3 fNormal;

void main()
{
  vec3 lightdir = vec3(1.0,1.0,1.0);
  vec3 n=normalize(fNormal);
  float diffusion=max(0.0, dot(n,lightdir));
  gl_FragColor = vec4(fNormal, 1.0)*(0.3+diffusion);
}