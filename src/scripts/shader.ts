// Hero background: a domain-warped noise field rendered with raw WebGL.
// ~2 KB instead of a full 3D engine, so the page stays fast.

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `
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
}`;

export function startShader(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'u_res');
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uMouse = gl.getUniformLocation(prog, 'u_mouse');

  // Render at reduced resolution: it is a soft gradient, nobody can tell.
  const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.5;
  const resize = () => {
    const w = Math.max(1, Math.floor(canvas.clientWidth * scale));
    const h = Math.max(1, Math.floor(canvas.clientHeight * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(uRes, w, h);
  };
  resize();
  addEventListener('resize', resize);

  const mouse = { x: 0.6, y: 0.6, tx: 0.6, ty: 0.6 };
  addEventListener(
    'pointermove',
    (e) => {
      mouse.tx = e.clientX / innerWidth;
      mouse.ty = 1 - e.clientY / innerHeight;
    },
    { passive: true },
  );

  let visible = true;
  let running = false;
  const start = performance.now();
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !running) requestAnimationFrame(frame);
  }).observe(canvas);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && visible && !running) requestAnimationFrame(frame);
  });

  function frame(now: number) {
    if (!visible || document.hidden) {
      running = false;
      return;
    }
    running = true;
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    gl!.uniform1f(uTime, (now - start) / 1000 + 12);
    gl!.uniform2f(uMouse, mouse.x, mouse.y);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame((t) => {
    frame(t);
    canvas.classList.add('is-live');
  });
}
