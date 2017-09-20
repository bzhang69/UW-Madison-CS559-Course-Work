precision highp float;
uniform float time;
uniform vec2 resolution;
varying vec3 fPosition;
varying vec3 fNormal;
varying vec3 uPos;

void main()
{
  
  float red = 1.0;
  float green = 1.0;
  if(step(1.0,mod(sqrt(pow(uPos.x,2.0)+pow(uPos.y,2.0))*10.0,2.0))==1.0) {
    red=0.3;
    green=0.5;
  }

  float red2 = smoothstep(.45,.55,red);
  float green2 = smoothstep(.45,.55,green);
  
  vec3 n = normalize(fNormal);
  float diffuse = max(0.0, dot(n, vec3(1.0,1.0,0)));
  
  vec3 lightdir = vec3(1.0,1.0,1.0);
  float spectb = max(dot(n,lightdir),0.0);
  float spec = pow(spectb,8.0);
  vec3 specolor = vec3(0.1,0.0,0.1);
  
  gl_FragColor = vec4(red2, green2, 1.0, 1.0) *(0.25+diffuse)+vec4(specolor * (spec),1.0);
}
 