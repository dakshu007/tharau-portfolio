const b="attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}",w=`
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  float t = u_time * 0.055;
  vec2 m = (u_mouse - 0.5) * vec2(u_res.x / u_res.y, 1.0);

  vec2 q = vec2(fbm(p * 1.3 + t), fbm(p * 1.3 - t + 3.1));
  vec2 r = vec2(fbm(p * 1.2 + 2.0 * q + vec2(1.7, 9.2) + t * 1.3 + m * 0.35),
                fbm(p * 1.2 + 2.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.1 + 2.4 * r);

  vec3 ink = vec3(0.035, 0.035, 0.043);
  vec3 saffron = vec3(1.0, 0.48, 0.24);
  vec3 rose = vec3(1.0, 0.36, 0.58);
  vec3 violet = vec3(0.61, 0.54, 1.0);

  vec3 col = ink;
  col = mix(col, violet * 0.45, smoothstep(0.35, 0.95, r.y) * 0.75);
  col = mix(col, rose * 0.55, smoothstep(0.5, 1.0, f) * 0.65);
  col = mix(col, saffron * 0.95, pow(smoothstep(0.45, 1.0, f * q.x * 1.7), 2.0) * 0.85);
  col += pow(abs(sin((f + r.x) * 11.0)), 28.0) * 0.08 * vec3(1.0, 0.82, 0.7);

  // Glow drifts toward the pointer; keep the left (text) side calm.
  float glow = smoothstep(0.9, 0.0, length(p - m * 0.6 - vec2(0.35, 0.15)));
  col += glow * 0.06 * saffron;
  col *= mix(0.45, 1.0, smoothstep(0.05, 0.75, uv.x));
  col = mix(ink, col, smoothstep(1.35, 0.25, length(p * vec2(0.85, 1.1))));
  col = mix(ink, col, smoothstep(0.0, 0.4, uv.y));

  col += (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.0);
}`;function y(r){const e=r.getContext("webgl",{antialias:!1,alpha:!1,powerPreference:"low-power"});if(!e)return;const f=(t,n)=>{const m=e.createShader(t);return e.shaderSource(m,n),e.compileShader(m),e.getShaderParameter(m,e.COMPILE_STATUS)?m:null},l=f(e.VERTEX_SHADER,b),u=f(e.FRAGMENT_SHADER,w);if(!l||!u)return;const i=e.createProgram();if(e.attachShader(i,l),e.attachShader(i,u),e.linkProgram(i),!e.getProgramParameter(i,e.LINK_STATUS))return;e.useProgram(i);const d=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,d),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);const h=e.getAttribLocation(i,"p");e.enableVertexAttribArray(h),e.vertexAttribPointer(h,2,e.FLOAT,!1,0,0);const g=e.getUniformLocation(i,"u_res"),x=e.getUniformLocation(i,"u_time"),_=e.getUniformLocation(i,"u_mouse"),v=Math.min(window.devicePixelRatio||1,1.5)*.5,p=()=>{const t=Math.max(1,Math.floor(r.clientWidth*v)),n=Math.max(1,Math.floor(r.clientHeight*v));(r.width!==t||r.height!==n)&&(r.width=t,r.height=n,e.viewport(0,0,t,n)),e.uniform2f(g,t,n)};p(),addEventListener("resize",p);const o={x:.6,y:.6,tx:.6,ty:.6};addEventListener("pointermove",t=>{o.tx=t.clientX/innerWidth,o.ty=1-t.clientY/innerHeight},{passive:!0});let c=!0,s=!1;const A=performance.now();new IntersectionObserver(([t])=>{c=t.isIntersecting,c&&!s&&requestAnimationFrame(a)}).observe(r),document.addEventListener("visibilitychange",()=>{!document.hidden&&c&&!s&&requestAnimationFrame(a)});function a(t){if(!c||document.hidden){s=!1;return}s=!0,o.x+=(o.tx-o.x)*.04,o.y+=(o.ty-o.y)*.04,e.uniform1f(x,(t-A)/1e3+12),e.uniform2f(_,o.x,o.y),e.drawArrays(e.TRIANGLES,0,3),requestAnimationFrame(a)}requestAnimationFrame(t=>{a(t),r.classList.add("is-live")})}export{y as startShader};
