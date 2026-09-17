import { themes } from './themes';
/** Decorative atmosphere only; no scientific data is represented. */
export function mountAtmosphere(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'low-power' });
  if (!gl) return; // The SVG landscape and CSS aurora are the complete static fallback.
  const vertex = `attribute vec2 a; void main(){gl_Position=vec4(a,0.,1.);}`;
  const fragment = `precision mediump float;
    uniform vec2 size; uniform float time; uniform float theme; uniform vec3 tint; uniform vec3 tint2;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
    void main(){
      vec2 uv=gl_FragCoord.xy/size; float t=time*.055;
      if(theme<.5){
        float x=uv.x; float wave=.67+.14*sin(x*5.+t)+.035*sin(x*15.-t);
        float ripple=.025*noise(vec2(x*30.,t));
        float band=exp(-abs(uv.y-wave-ripple)*15.);
        float curtain=.42+.58*pow(noise(vec2(x*110.+t,uv.y*.7-t)),2.);
        float veil=band*curtain*smoothstep(.18,.6,x)*smoothstep(.25,.6,uv.y);
        vec3 color=mix(tint,tint2,smoothstep(.0,.3,uv.y-wave));
        gl_FragColor=vec4(color*veil*.75,veil*.75);
      } else if(theme<1.5){
        vec2 p=uv*vec2(180.,90.); p.x+=time*1.8; p.y+=sin(time*.15)*2.;
        vec2 cell=floor(p); float dust=step(.986,hash(cell))*exp(-length((fract(p)-.5)*vec2(.6,2.))*6.);
        float alpha=dust*.26*smoothstep(.2,.75,uv.x); gl_FragColor=vec4(tint*alpha,alpha);
      } else if(theme>2.5 && theme<3.5){
        vec2 p=uv*vec2(85.,48.); p+=vec2(-time*2.4,time*1.1);
        float snow=step(.965,hash(floor(p)))*exp(-length((fract(p)-.5)*vec2(.65,1.))*12.);
        vec2 q=uv*vec2(41.,28.)+vec2(-time*.9,time*.7);
        snow+=step(.97,hash(floor(q)))*exp(-length(fract(q)-.5)*16.);
        float alpha=snow*.6*smoothstep(.2,.75,uv.x); gl_FragColor=vec4(tint*alpha,alpha);
      } else if(theme>3.5 && theme<4.5){
        vec2 p=vec2(uv.x+uv.y*.06,uv.y)*vec2(180.,12.); p.y+=time*7.;
        float rain=step(.85,hash(floor(p)))*exp(-abs(fract(p.x)-.5)*55.)*smoothstep(.05,.5,fract(p.y));
        float mist=noise(vec2(uv.x*4.-t,uv.y*8.))*(1.-smoothstep(.1,.55,uv.y))*.055;
        float alpha=(rain*.2+mist)*smoothstep(.25,.8,uv.x); gl_FragColor=vec4(tint*alpha,alpha);
      } else if(theme>4.5){
        vec2 p=uv*vec2(5.,9.); float wave=sin(p.x*3.+sin(p.y+time*.22))+sin(p.y*2.-time*.3);
        float caustic=pow(1.-abs(sin(wave*2.)),14.);
        float alpha=caustic*.085*smoothstep(.25,.85,uv.x)*(1.-smoothstep(.05,.6,uv.y));
        gl_FragColor=vec4(mix(tint,tint2,uv.y)*alpha,alpha);
      } else { gl_FragColor=vec4(0.); }
    }`;
  function shader(type: number, source: string) {
    const s = gl!.createShader(type)!; gl!.shaderSource(s, source); gl!.compileShader(s);
    if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) { gl!.deleteShader(s); return null; }
    return s;
  }
  const vs = shader(gl.VERTEX_SHADER, vertex), fs = shader(gl.FRAGMENT_SHADER, fragment);
  if (!vs || !fs) return;
  const program = gl.createProgram()!;
  gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(program, 'a'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
  const uniforms = Object.fromEntries(['size','time','theme','tint','tint2'].map(k=>[k,gl.getUniformLocation(program,k)]));
  let frame = 0, visible = true, lost = false, elapsed = 0, last = 0, theme = 0;
  function color(name: string) { const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255); }
  function resize() {
    const r=canvas.getBoundingClientRect(), ratio=Math.min(devicePixelRatio,1.5);
    canvas.width=Math.round(r.width*ratio); canvas.height=Math.round(r.height*ratio);
    gl!.viewport(0,0,canvas.width,canvas.height); draw();
  }
  function draw() {
    if (lost) return;
    gl!.uniform2f(uniforms.size,canvas.width,canvas.height); gl!.uniform1f(uniforms.time,elapsed); gl!.drawArrays(gl!.TRIANGLES,0,6);
  }
  function tick(now: number) { elapsed+=last ? Math.min((now-last)/1000,.06) : 0; last=now; draw(); frame=requestAnimationFrame(tick); }
  function sync() {
    cancelAnimationFrame(frame); last=0;
    if (lost) return;
    theme=Math.max(0,themes.findIndex(t=>t.id===document.documentElement.dataset.theme));
    gl!.uniform1f(uniforms.theme,theme); gl!.uniform3fv(uniforms.tint,color('--glow')); gl!.uniform3fv(uniforms.tint2,color('--glow-alt'));
    draw();
    const ambient=document.documentElement.dataset.motion!=='off' && visible && !document.hidden;
    canvas.closest<HTMLElement>('.scene')!.dataset.animate=String(ambient);
    const moving=ambient && theme!==2;
    if(moving) frame=requestAnimationFrame(tick);
    canvas.dataset.running=String(moving);
  }
  const resizeObserver=new ResizeObserver(resize); resizeObserver.observe(canvas);
  const visibilityObserver=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();}); visibilityObserver.observe(canvas);
  const themeObserver=new MutationObserver(sync); themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','data-motion']});
  document.addEventListener('visibilitychange',sync);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault(); lost=true; cancelAnimationFrame(frame);canvas.dataset.running='false';});
  // On GPU loss retain the static artwork; a fresh page load can reinitialize WebGL.
  window.addEventListener('pagehide',event=>{cancelAnimationFrame(frame);if(!event.persisted){resizeObserver.disconnect();visibilityObserver.disconnect();themeObserver.disconnect();document.removeEventListener('visibilitychange',sync);}});
  window.addEventListener('pageshow',event=>{if(event.persisted)sync();});
  resize(); sync();
}
