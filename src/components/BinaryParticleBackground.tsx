"use client";

import { useEffect, useRef } from "react";

interface Props {
  phase: "splash" | "welcome" | "ready";
}

export default function BinaryParticleBackground({ phase }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const glCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ovCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const phaseRef = useRef(phase);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const gc = glCanvasRef.current;
    const oc = ovCanvasRef.current;
    if (!gc || !oc) return;

    const glNullable = gc.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!glNullable) {
      console.warn("WebGL2 is not supported in this browser.");
      return;
    }
    const gl: WebGL2RenderingContext = glNullable;

    const o2 = oc.getContext("2d");
    if (!o2) return;

    let animId: number;
    let isCleanedUp = false;

    const M = Math;
    const R = M.random;
    const TAU = 6.283185307179586;
    const D = M.min(window.devicePixelRatio || 1, 1.5);
    const HOLD = 2.6; // Tailored 2.6s welcome bit-assembly before burst into grassland

    // Shared terrain height function (identical in GLSL & JS)
    const HG =
      "float H(vec2 p){return 2.6*sin(.05*p.x+1.7*sin(.021*p.y))+2.*sin(.037*p.y+.6*sin(.04*p.x))+.7*sin(.13*p.x+.11*p.y);}";
    const HJ = (x: number, z: number) =>
      2.6 * M.sin(0.05 * x + 1.7 * M.sin(0.021 * z)) +
      2 * M.sin(0.037 * z + 0.6 * M.sin(0.04 * x)) +
      0.7 * M.sin(0.13 * x + 0.11 * z);

    // ── Shaders ───────────────────────────────────────────────────────────
    const BV = `#version 300 es
precision highp float;
layout(location=0) in vec4 aR;
uniform vec4 uBand;uniform vec3 uCam,uP;uniform vec2 uRes;
uniform float uT,uF,uHz,uEm,uSp,uAsp,uDpr,uSx;
out vec3 vUV;out vec3 vA;out vec3 vB;
${HG}
vec2 pj(vec3 w,out float z){vec3 r=w-uCam;z=r.z;return vec2(uF*r.x/(r.z*uAsp)+uSx,uF*r.y/r.z+uHz);}
void main(){
 gl_Position=vec4(2.,2.,2.,1.);
 int row=gl_VertexID>>1;float side=float(gl_VertexID&1),s=float(row)/3.;
 float sp=uBand.y-uBand.x,sc=fract(aR.y-uCam.z/sp),zr=uBand.x+sc*sp;
 float sx=uBand.y*uAsp/uF*2.4;
 float xw=uCam.x+(fract(aR.x-uCam.x/sx)-.5)*sx,zw=uCam.z+zr;
 if(aR.w>pow(uBand.x/zr,uBand.w))return;
 float del=(1.-clamp(zr/200.,0.,1.))*1.6,gr=clamp((uEm-del)/.9,0.,1.);gr=gr*gr*(3.-2.*gr);
 if(gr<=0.)return;
 vec3 B=vec3(xw,H(vec2(xw,zw)),zw);
 float pat=.5+.5*sin(xw*.11+sin(zw*.07)*2.)*sin(zw*.09+xw*.03);
 vec3 n=normalize(vec3(H(B.xz-vec2(1,0))-H(B.xz+vec2(1,0)),2.,H(B.xz-vec2(0,1))-H(B.xz+vec2(0,1))));
 float lit=clamp(dot(n,normalize(vec3(.7,.5,-.5))),0.,1.);
 float h=uBand.z*(.7+.6*aR.z)*(.5+.5*pat)*gr,ph=aR.z*6.283185;
 float wv=sin(xw*.33+zw*.21-uT*2.3+ph*.2)*.5+sin(xw*.8-zw*.5-uT*3.4+ph)*.22+sin(xw*.035+zw*.03-uT*.8)*.9+.5;
 float z0,z1,zz;vec2 pb=pj(B,z0);
 vec2 dp=(pb-uP.xy)*vec2(uAsp,1.);
 float pf=uP.z*exp(-dot(dp,dp)/.05)*clamp((pb.x-uP.x)*5.,-1.,1.);
 vec3 off=vec3((wv*.5+pf*.4)*h,-abs(wv)*h*.12,-uSp*h*.02);
 vec2 pt=pj(B+vec3(off.x,h+off.y,off.z),z1);
 float zm=min(z0,z1);if(zm<.6||min(abs(pb.x),abs(pt.x))>1.5)return;
 vec2 dv=(pt-pb)*uRes*.5;float lp=min(length(dv)+.001,340.*uDpr);
 float nb=clamp(floor(lp/(24.*uDpr)+.5),1.,8.);
 float coc=smoothstep(10.,90.,zr);
 float wpx=lp/nb*.78*(1.+coc*.9);
 vec2 pp=normalize(vec2(-dv.y,dv.x));
 vec2 q=pj(B+vec3(off.x*s*s,h*s+off.y*s*s,off.z*s*s),zz);
 q+=pp*(side-.5)*wpx*2./uRes;
 gl_Position=vec4(q*zz,(zz*320.5-320.)/319.5,zz);
 float ef=smoothstep(0.,.12,sc)*(1.-smoothstep(.82,1.,sc));
 float gs=sin(xw*.035+zw*.03-uT*.8),dk=smoothstep(-.35,-.9,gs),bt=smoothstep(.6,.98,gs);
 vA=vec3(mix(1.,.65,smoothstep(4.,140.,zr))*ef*gr*(.75+.25*lit)*(.8+.2*pat)*(.85+.3*fract(aR.z*17.)),bt*.6,lit);
 vB=vec3(s,smoothstep(.5,.95,fract(aR.z*29.))*(1.-pat),1.-.22*dk+.18*bt);
 vUV=vec3((floor(aR.z*8.)+.125+side*.75)/8.,1.-s*nb/8.,coc);
}`;

    const BF = `#version 300 es
precision mediump float;
in vec3 vUV;in vec3 vA;in vec3 vB;uniform sampler2D uTex;uniform float uL,uLight;out vec4 o;
void main(){
 vec4 tx=texture(uTex,vUV.xy,vUV.z*3.2);float a=min(tx.a*vA.x,1.);float s=vB.x;

 // Dark Mode: Rich warm amber / saffron palette
 vec3 cDark=mix(vec3(.74,.45,.13),vec3(.98,.68,.22),smoothstep(0.,.35,s));
 cDark=mix(cDark,vec3(1.,.86,.46),smoothstep(.6,1.,s));
 cDark=mix(cDark,vec3(.62,.6,.12)*(.8+.5*s),vB.y*.25);
 cDark=mix(cDark,vec3(1.,.9,.55),vA.y);
 cDark*=(.82+.2*vA.z)*vB.z;

 // Light Mode: Calm, refined natural meadow palette (low-glare, high text contrast)
 vec3 cLight=mix(vec3(.12,.40,.16),vec3(.18,.50,.20),smoothstep(0.,.35,s));
 cLight=mix(cLight,vec3(.28,.60,.24),smoothstep(.6,1.,s));
 cLight=mix(cLight,vec3(.14,.46,.16)*(.8+.5*s),vB.y*.25);
 cLight=mix(cLight,vec3(.42,.68,.30),vA.y);
 cLight*=(.82+.2*vA.z)*vB.z;

 vec3 c=mix(cDark,cLight,uLight)*uL;
 o=vec4(c*a,a);
}`;

    const TV = `#version 300 es
precision highp float;
layout(location=0) in vec2 a;
uniform vec3 uCam;uniform float uF,uHz,uAsp,uSx;
out vec4 v;
${HG}
void main(){
 float zr=.8*pow(400.,a.y),xr=(a.x-.5)*2.*zr*uAsp/uF*1.4,xw=uCam.x+xr,zw=uCam.z+zr;
 float h=H(vec2(xw,zw))-.05-.0015*zr;vec3 r=vec3(xr,h-uCam.y,zr);
 vec3 n=normalize(vec3(H(vec2(xw-1.,zw))-H(vec2(xw+1.,zw)),2.,H(vec2(xw,zw-1.))-H(vec2(xw,zw+1.))));
 v=vec4(clamp(dot(n,normalize(vec3(.7,.5,-.5))),0.,1.),zr,xw,zw);
 gl_Position=vec4(vec2(uF*r.x/(r.z*uAsp)+uSx,uF*r.y/r.z+uHz)*zr,(zr*320.5-320.)/319.5,zr);
}`;

    const TF = `#version 300 es
precision highp float;
in vec4 v;uniform float uK,uLight,uL;out vec4 o;
float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+vec2(1,0)),f.x),mix(hs(i+vec2(0,1)),hs(i+vec2(1,1)),f.x),f.y);}
float hs2(vec2 p){return fract(sin(dot(mod(p,257.),vec2(12.9898,78.233)))*43758.5453);}
const vec3 PL_DARK[5]=vec3[5](vec3(.43,.27,.085),vec3(.5,.32,.1),vec3(.58,.38,.12),vec3(.66,.44,.14),vec3(.74,.5,.17));
const vec3 PL_LIGHT[5]=vec3[5](vec3(.14,.36,.14),vec3(.18,.44,.17),vec3(.24,.50,.20),vec3(.28,.56,.22),vec3(.32,.60,.25));
void main(){
 float zr=v.y,cs=.125*exp2(floor(log2(max(1.,zr/6.))));
 vec2 c0=floor(v.zw/cs),c1=floor(v.zw/(cs*8.));
 float r=hs2(c0+cs*13.),tn=r*.55+hs2(c1+3.)*.45;
 int k=int(clamp(floor(tn*5.),0.,4.));
 k=int(clamp(float(k)+(r>.95?-1.:(r<.03?1.:0.)),0.,4.));
 vec3 cDark=PL_DARK[k]*(floor((.7+.4*v.x)*6.+.5)/6.);
 vec3 cLight=PL_LIGHT[k]*(floor((.7+.4*v.x)*6.+.5)/6.);
 float sm=vn(v.zw*.05)*.6+vn(v.zw*.21+9.)*.4;
 cDark=mix(cDark,mix(PL_DARK[1],PL_DARK[3],sm)*(.7+.4*v.x),smoothstep(22.,80.,zr));
 cDark=mix(cDark,vec3(.42,.28,.11),smoothstep(60.,240.,zr));
 cLight=mix(cLight,mix(PL_LIGHT[1],PL_LIGHT[3],sm)*(.7+.4*v.x),smoothstep(22.,80.,zr));
 cLight=mix(cLight,vec3(.18,.44,.16),smoothstep(60.,240.,zr));
 vec3 c=mix(cDark,cLight,uLight)*uL;
 o=vec4(c*uK,uK);
}`;

    // Props: Clouds (uMode == 0) & Birds (uMode == 2) — no barn
    const PV = `#version 300 es
precision highp float;
layout(location=0) in vec4 aP;layout(location=1) in vec4 aC;
uniform vec3 uCam,uOff;uniform vec2 uRes;uniform float uT,uF,uHz,uAsp,uDpr,uSx,uEm,uMode;
out vec4 vT;out vec3 vC;
void main(){
 gl_Position=vec4(2.,2.,2.,1.);gl_PointSize=1.;
 vec3 r=uMode<.5?vec3(mod(aP.x+uT*aC.w+900.,1800.)-900.,aP.y,aP.z):aP.xyz+uOff-uCam;
 if(r.z<2.)return;
 float fov=uMode<.5?1.5:uF;
 // Stable clouds in sky: do not wobble or snap with mouse/speed
 vec2 q=uMode<.5?vec2(1.5*r.x/(r.z*uAsp),1.5*r.y/r.z+uHz):vec2(uF*r.x/(r.z*uAsp)+uSx,uF*r.y/r.z+uHz);
 if(abs(q.x)>1.15)return;
 float tn=floor(aC.x/64.),g=aC.x-tn*64.;
 vec3 tc[5]=vec3[5](vec3(.78,.18,.1),vec3(.98,.9,.7),vec3(.45,.18,.1),vec3(1.,.82,.35),vec3(1.,.9,.62));
 float a=aC.z*smoothstep(.5,2.5,uEm);
 if(tn==3.)a*=.65+.35*sin(uT*7.+aC.w*40.);
 gl_PointSize=min(max(2.,aP.w*fov/r.z*uRes.y*.5),90.*uDpr);
 gl_Position=vec4(q*r.z,uMode<.5?r.z*.999:(r.z*320.5-320.)/319.5,r.z);
 vT=vec4(g,0.,a,uMode<.5?1.6:smoothstep(50.,220.,r.z)*2.);
 vC=tc[int(tn)]*aC.y;
}`;

    const PF = `#version 300 es
precision mediump float;
in vec4 vT;in vec3 vC;uniform sampler2D uTex;uniform float uLight;out vec4 o;
void main(){
 float col=floor(vT.x/8.),row=vT.x-col*8.;vec2 p=gl_PointCoord;
 float a=texture(uTex,vec2((col+p.x)/8.,(row+p.y)/8.),vT.w).a*vT.z;
 if(a<.04)discard;
 vec3 cDark = vC;
 // In light mode: defined fluffy white-silver clouds (vT.w > 1.2) or dark swift birds
 vec3 cLight = vT.w > 1.2 ? vec3(0.88, 0.93, 0.98) : vec3(0.18, 0.20, 0.24);
 vec3 c = mix(cDark, cLight, uLight);
 o=vec4(c*a,a);
}`;

    const sh = (t: number, s: string) => {
      const o = gl.createShader(t);
      if (!o) throw new Error("Shader creation failed");
      gl.shaderSource(o, s);
      gl.compileShader(o);
      if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(o));
      }
      return o;
    };

    const pr = (v: string, f: string) => {
      const p = gl.createProgram();
      if (!p) throw new Error("Program creation failed");
      gl.attachShader(p, sh(gl.VERTEX_SHADER, v));
      gl.attachShader(p, sh(gl.FRAGMENT_SHADER, f));
      gl.linkProgram(p);
      return p;
    };

    const PB = pr(BV, BF);
    const PT = pr(TV, TF);
    const PP = pr(PV, PF);

    const UB: Record<string, WebGLUniformLocation | null> = {};
    const UT: Record<string, WebGLUniformLocation | null> = {};
    const UP: Record<string, WebGLUniformLocation | null> = {};

    [
      "uBand",
      "uCam",
      "uP",
      "uRes",
      "uT",
      "uF",
      "uHz",
      "uEm",
      "uSp",
      "uAsp",
      "uDpr",
      "uSx",
      "uTex",
      "uL",
      "uLight",
    ].forEach((n) => (UB[n] = gl.getUniformLocation(PB, n)));

    ["uCam", "uF", "uHz", "uAsp", "uSx", "uK", "uLight", "uL"].forEach(
      (n) => (UT[n] = gl.getUniformLocation(PT, n))
    );

    [
      "uCam",
      "uOff",
      "uRes",
      "uT",
      "uF",
      "uHz",
      "uAsp",
      "uDpr",
      "uSx",
      "uEm",
      "uMode",
      "uTex",
      "uLight",
    ].forEach((n) => (UP[n] = gl.getUniformLocation(PP, n)));

    // ── Glyph Atlas: 8x8 stacked binary bits (0s and 1s) ──────────────────
    const ZC: number[] = [];
    const OC: number[] = [];
    const at = document.createElement("canvas");
    at.width = 256;
    at.height = 320;
    {
      const x = at.getContext("2d");
      if (x) {
        x.font =
          '700 30px ui-monospace,Menlo,Consolas,"DejaVu Sans Mono",monospace';
        x.textAlign = "center";
        x.textBaseline = "middle";
        x.fillStyle = x.strokeStyle = "#fff";
        x.lineWidth = 2.5;
        for (let c = 0; c < 8; c++) {
          for (let r = 0; r < 8; r++) {
            const g = R() < 0.5 ? "0" : "1";
            (g === "0" ? ZC : OC).push(c * 8 + r);
            x.strokeText(g, c * 32 + 16, r * 40 + 21);
            x.fillText(g, c * 32 + 16, r * 40 + 21);
          }
        }
      }
    }

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, at);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // ── Buffers & VAOs ─────────────────────────────────────────────────────
    const BD = [
      [1.0, 4, 1.45, 1.2, 3200],
      [3.2, 10, 1.75, 1, 4800],
      [8, 26, 2.1, 1, 8000],
      [21, 70, 2.5, 0.7, 14000],
      [56, 200, 3.0, 0.5, 22000],
    ];

    const NMAX = 22000;
    const rb = new Float32Array(NMAX * 4);
    for (let i = 0; i < rb.length; i++) rb[i] = R();

    const vaoB = gl.createVertexArray();
    gl.bindVertexArray(vaoB);
    const bb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bb);
    gl.bufferData(gl.ARRAY_BUFFER, rb, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(0, 1);

    const GN = 96;
    const tv = new Float32Array((GN + 1) * (GN + 1) * 2);
    const ti = new Uint16Array(GN * GN * 6);
    for (let j = 0, k = 0; j <= GN; j++) {
      for (let i = 0; i <= GN; i++) {
        tv[k++] = i / GN;
        tv[k++] = j / GN;
      }
    }
    for (let j = 0, k = 0; j < GN; j++) {
      for (let i = 0; i < GN; i++) {
        const a = j * (GN + 1) + i;
        const b = a + 1;
        const c = a + GN + 1;
        const d = c + 1;
        ti.set([a, b, c, b, d, c], k);
        k += 6;
      }
    }

    const vaoT = gl.createVertexArray();
    gl.bindVertexArray(vaoT);
    const tb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tb);
    gl.bufferData(gl.ARRAY_BUFFER, tv, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const teb = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teb);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ti, gl.STATIC_DRAW);

    const mkV = (a: Float32Array, dyn?: boolean) => {
      const v = gl.createVertexArray();
      gl.bindVertexArray(v);
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, a, dyn ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 32, 0);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 32, 16);
      return { v, b, a, n: a.length / 8 };
    };

    const gcd = () => (R() * 64) | 0;

    // Clouds
    const clA: number[] = [];
    for (let c = 0; c < 12; c++) {
      const cx = R() * 1800 - 900;
      const cy = 45 + R() * 100;
      const cz = 300 + R() * 280;
      const sp = 1.5 + R() * 3;
      const wd = 70 + R() * 90;
      const n = (80 + R() * 60) | 0;
      for (let i = 0; i < n; i++) {
        const a = R() * TAU;
        const r = M.sqrt(R());
        let y = M.sin(a) * r * wd * 0.22;
        if (y < 0) y *= 0.35;
        clA.push(
          cx + M.cos(a) * r * wd,
          cy + y,
          cz + R() * 8,
          9 + R() * 5,
          gcd() + 256,
          0.9,
          0.5 * (1 - r * 0.5),
          sp
        );
      }
    }
    const clV = mkV(new Float32Array(clA));

    // Boids (birds flocking in 3D)
    const NB = 110;
    const BO: {
      p: [number, number, number];
      v: [number, number, number];
      ph: number;
    }[] = [];
    const brV = mkV(new Float32Array(NB * 24), true);
    let bInit = 0;
    let gF = 1.5;
    let gA = 1.7;

    for (let i = 0; i < NB; i++) {
      BO.push({ p: [0, 0, 0], v: [0, 0, 8], ph: R() * TAU });
    }

    function boids(
      dt: number,
      t: number,
      cx: number,
      cy: number,
      cz: number,
      nA: number
    ) {
      const gx = cx + M.sin(t * 0.13) * 45;
      const gz = cz + 75 + M.sin(t * 0.09) * 25;
      // High in the open sky — well clear of hills and grass
      const gy = HJ(gx, gz) + 26 + M.sin(t * 0.21) * 6;
      const A = brV.a;
      const w = (
        o: number,
        x: number,
        y: number,
        z: number,
        s: number,
        c: number,
        b: number,
        a: number
      ) => {
        A[o] = x;
        A[o + 1] = y;
        A[o + 2] = z;
        A[o + 3] = s;
        A[o + 4] = c;
        A[o + 5] = b;
        A[o + 6] = a;
        A[o + 7] = 0;
      };

      if (!bInit) {
        bInit = 1;
        for (const b of BO) {
          b.p = [
            gx + (R() - 0.5) * 60,
            gy + (R() - 0.5) * 8,
            gz + (R() - 0.5) * 60,
          ];
          b.v = [(R() - 0.5) * 4, 0, 8 + R() * 4];
        }
      }

      for (let i = 0; i < nA; i++) {
        const b = BO[i];
        const p = b.p;
        const v = b.v;
        let sx = 0,
          sy = 0,
          sz = 0;
        let ax = 0,
          ay = 0,
          az = 0;
        let qx = 0,
          qy = 0,
          qz = 0;
        let n = 0;

        for (let j = 0; j < nA; j++) {
          if (j === i) continue;
          const o = BO[j];
          const dx = o.p[0] - p[0];
          const dy = o.p[1] - p[1];
          const dz = o.p[2] - p[2];
          const d = dx * dx + dy * dy + dz * dz;
          if (d < 400) {
            n++;
            ax += o.v[0];
            ay += o.v[1];
            az += o.v[2];
            qx += dx;
            qy += dy;
            qz += dz;
            if (d < 16) {
              const k = 1 / (d + 0.5);
              sx -= dx * k;
              sy -= dy * k;
              sz -= dz * k;
            }
          }
        }

        if (n) {
          v[0] += (sx * 14 + (ax / n - v[0]) * 0.9 + (qx / n) * 0.35) * dt;
          v[1] += (sy * 14 + (ay / n - v[1]) * 0.9 + (qy / n) * 0.35) * dt;
          v[2] += (sz * 14 + (az / n - v[2]) * 0.9 + (qz / n) * 0.35) * dt;
        }

        const gd = M.hypot(gx - p[0], gy - p[1], gz - p[2]) + 1;
        v[0] += ((gx - p[0]) / gd) * 5 * dt;
        v[1] += ((gy - p[1]) / gd) * 5 * dt;
        v[2] += ((gz - p[2]) / gd) * 5 * dt;

        // Ground clearance ceiling: keep flock at least 16m above terrain, never below
        const mh = HJ(p[0], p[2]) + 16;
        if (p[1] < mh) {
          p[1] = mh;
          v[1] = M.max(v[1], 4);
        } else if (p[1] > mh + 36) {
          v[1] -= 8 * dt;
        }

        if (pe > 0.15) {
          const rz = p[2] - cz;
          if (rz > 3) {
            const nx = (gF * (p[0] - cx)) / (rz * gA) - ((pxv / W) * 2 - 1);
            const ny = (gF * (p[1] - cy)) / rz + HZ - (1 - (pyv / H) * 2);
            const d = nx * nx + ny * ny;
            if (d < 0.03) {
              const k = (((1 - d / 0.03) * 40 * dt) / (M.sqrt(d) + 0.01));
              v[0] += nx * k;
              v[1] += ny * k;
            }
          }
        }

        const sp = M.hypot(v[0], v[1], v[2]) || 1;
        const sc = M.min(15, M.max(7, sp)) / sp;
        v[0] *= sc;
        v[1] *= sc;
        v[2] *= sc;
        p[0] += v[0] * dt;
        p[1] += v[1] * dt;
        p[2] += v[2] * dt;

        if (p[2] < cz + 6 || p[2] > cz + 230) {
          p[0] = gx + (R() - 0.5) * 60;
          p[1] = gy + (R() - 0.5) * 8;
          p[2] = gz + (R() - 0.5) * 50;
          v[0] = 0;
          v[1] = 0;
          v[2] = 9;
        }

        const l = M.hypot(v[0], v[2]) || 1;
        const wx = (v[2] / l) * 0.95;
        const wz = (-v[0] / l) * 0.95;
        const f = M.sin(t * 13 + b.ph) * 0.6;
        const o = i * 24;
        w(o, p[0], p[1], p[2], 0.85, OC[i % OC.length] + 256, 1, 0.95);
        w(
          o + 8,
          p[0] + wx,
          p[1] + f,
          p[2] + wz,
          0.7,
          ZC[i % ZC.length] + 256,
          0.9,
          0.9
        );
        w(
          o + 16,
          p[0] - wx,
          p[1] + f,
          p[2] - wz,
          0.7,
          ZC[(i + 7) % ZC.length] + 256,
          0.9,
          0.9
        );
      }
    }

    // ── 2D Intro Sprites (Dual Palette: Amber for Dark mode, Green for Light mode) ──
    const makeSprites = (colors: string[]) =>
      colors.map((col, h) =>
        [0, 1].map((b) => {
          const c = document.createElement("canvas");
          c.width = c.height = 40 * D;
          const x = c.getContext("2d");
          if (x) {
            x.font = `${24 * D}px ui-monospace,Menlo,Consolas,"DejaVu Sans Mono",monospace`;
            x.textAlign = "center";
            x.textBaseline = "middle";
            x.fillStyle = col;
            if (h) {
              x.shadowColor = col;
              x.shadowBlur = h * 6 * D;
            }
            x.fillText(String(b), 20 * D, 21 * D);
          }
          return c;
        })
      );

    const SP_DARK = makeSprites(["#d8963a", "#f2b963", "#ffe4b4"]);
    const SP_LIGHT = makeSprites(["#15803d", "#22c55e", "#86efac"]);

    const BS = [..."WELCOME"]
      .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
      .join("");

    interface BitPart {
      bit: number;
      tx: number;
      ty: number;
      ts: number;
      sx: number;
      sy: number;
      qx: number;
      qy: number;
      a0: number;
      ad: number;
      pd: number;
      fd: number;
      cx: number;
      cy: number;
      hx: number;
      hy: number;
      ph: number;
    }

    let W = 0;
    let H = 0;
    let parts: BitPart[] = [];
    let TXL = 0;
    let TXW = 0;
    let TCY = 0;
    let capH = 0;
    const HZ = 0.12;

    function sample() {
      const w = "WELCOME";
      const o = document.createElement("canvas");
      const fs = 200;
      const sx = 0.56;
      const fnt = `bold ${fs}px "Times New Roman",Times,Georgia,serif`;
      let x = o.getContext("2d");
      if (!x) return [];
      x.font = fnt;

      const ws = [...w].map((c) => x!.measureText(c).width * sx);
      const cap = fs * 0.66;
      const rows = M.max(10, M.min(18, M.round((H * 0.22) / 14)));
      const ar = ws.reduce((a, b) => a + b, 0) / cap + (6 * 0.6 * 1.6) / rows;
      capH = M.min(H * 0.22, (W * 0.86) / ar);
      const capW = capH * ar;
      const rh = capH / rows;
      const cw = rh * 0.6;
      const sc = capH / cap;
      const gap = cw * 1.6;

      o.width = M.ceil(capW) + 4;
      o.height = M.ceil(capH * 1.1) + 4;
      x = o.getContext("2d", { willReadFrequently: true });
      if (!x) return [];

      x.fillStyle = "#fff";
      x.textBaseline = "alphabetic";
      x.font = fnt;
      x.strokeStyle = "#fff";
      x.lineWidth = fs * 0.04;

      let px = 2;
      [...w].forEach((c, i) => {
        x!.setTransform(sx * sc, 0, 0, sc, px, 2 + capH * 0.04);
        x!.fillText(c, 0, cap);
        x!.strokeText(c, 0, cap);
        px += ws[i] * sc + gap;
      });

      const d = x.getImageData(0, 0, o.width, o.height).data;
      TXL = W / 2 - capW / 2;
      TXW = capW;
      // Pulled slightly down to exact vertical center so badge and subtitle frame it without overlap
      TCY = H * 0.52;

      const A = (X: number, Y: number) => {
        X |= 0;
        Y |= 0;
        return X < 0 || Y < 0 || X >= o.width || Y >= o.height
          ? 0
          : d[(Y * o.width + X) * 4 + 3];
      };

      const out: { x: number; y: number; ts: number }[] = [];
      const T0 = TCY - capH / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0, n = M.floor(capW / cw); c < n; c++) {
          const X = 2 + (c + 0.5) * cw;
          const Y = 2 + capH * 0.04 + (r + 0.5) * rh;
          if (
            A(X, Y) +
              A(X - cw * 0.3, Y) +
              A(X + cw * 0.3, Y) +
              A(X, Y - rh * 0.3) +
              A(X, Y + rh * 0.3) >
            330
          ) {
            out.push({
              x: TXL + (c + 0.5) * cw,
              y: T0 + (r + 0.5) * rh,
              ts: rh * 0.83,
            });
          }
        }
      }
      return out;
    }

    function build() {
      W = window.innerWidth;
      H = window.innerHeight;
      gc!.width = oc!.width = (W * D) | 0;
      gc!.height = oc!.height = (H * D) | 0;

      const pts = sample();
      const hy = ((1 - HZ) / 2) * H;
      parts = pts.map((s, i) => {
        const a = R() * TAU;
        const sx = W / 2 + M.cos(a) * W * (0.55 + R() * 0.35);
        const sy = H / 2 + M.sin(a) * H * (0.55 + R() * 0.35);
        const an = M.atan2(s.y - TCY, s.x - W / 2);
        const m = 80 + R() * 200;
        return {
          bit: +BS[i % 56],
          tx: s.x,
          ty: s.y,
          ts: s.ts,
          sx,
          sy,
          qx: (sx + s.x) / 2 + (R() - 0.5) * W * 0.35,
          qy: (sy + s.y) / 2 + (R() - 0.5) * H * 0.35,
          a0: 0.12 + ((s.x - TXL) / TXW) * 0.65 + R() * 0.2,
          ad: 0.55 + R() * 0.3,
          pd:
            M.hypot(
              (s.x - W / 2) / (TXW / 2),
              ((s.y - TCY) / (capH / 2)) * 0.4
            ) *
              0.5 +
            R() * 0.2,
          fd: 1.0 + R() * 0.7,
          cx: s.x + M.cos(an) * m,
          cy: s.y + M.sin(an) * m * 0.6 - (60 + R() * 200),
          hx: W * (0.06 + 0.88 * R()),
          hy: hy + (R() - 0.5) * 10,
          ph: R(),
        };
      });
    }

    // ── State variables ────────────────────────────────────────────────────
    let t0 = performance.now() / 1000;
    let TP = HOLD;
    let lt = 0;
    let mx = 0.5;
    let my = 0.5;
    let smx = 0.5;
    let smy = 0.5;
    let pa = 0;
    let pe = 0;
    let pxv = 0;
    let pyv = 0;
    let tgt = 0;
    let cz = 0;
    let pz = 0;
    let spd = 0;
    let cy: number | null = null;
    let q = window.innerWidth < 700 ? 0.55 : 1;
    let acc = 0;
    let fn = 0;
    let lastPhase = phaseRef.current;

    // Theme observation for smooth day/night color transitions in WebGL2 shaders
    let targetLight =
      typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-theme") === "light"
        ? 1.0
        : 0.0;
    let currentLight = targetLight;

    const themeObserver = new MutationObserver(() => {
      const isLight =
        document.documentElement.getAttribute("data-theme") === "light";
      targetLight = isLight ? 1.0 : 0.0;
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // If starting directly in "ready" mode (e.g. refreshing/re-entering)
    if (lastPhase === "ready") {
      TP = 0;
      t0 = performance.now() / 1000 - 10;
    }

    function frame(ms: number) {
      if (isCleanedUp) return;
      animId = requestAnimationFrame(frame);

      const currentPhase = phaseRef.current;
      if (currentPhase !== lastPhase) {
        if (currentPhase === "welcome") {
          t0 = performance.now() / 1000;
          TP = HOLD;
          cz = tgt = pz = spd = 0;
          build();
        } else if (currentPhase === "ready") {
          // Accelerate into living field
          if (TP > 0) TP = M.min(TP, (ms / 1000) - t0);
        }
        lastPhase = currentPhase;
      }

      const t = ms / 1000 - t0;
      const dt = M.min(0.05, M.max(0.001, t - lt));
      lt = t;

      // Adaptive quality (instance count)
      acc += dt;
      fn++;
      if (fn >= 45) {
        const a = acc / fn;
        if (a > 0.024) q = M.max(0.3, q * 0.8);
        else if (a < 0.0145) q = M.min(1, q * 1.08);
        acc = fn = 0;
      }

      // ── 2D Bit Text Intro (Active during welcome transition) ─────────────
      o2!.setTransform(D, 0, 0, D, 0, 0);
      o2!.clearRect(0, 0, W, H);

      if (currentPhase === "welcome" && t < TP + 3.0) {
        const g = (t - 1.4) / 0.8;
        for (const p of parts) {
          if (t < p.a0) continue;
          const ft = t - TP - p.pd;
          let x = 0,
            y = 0,
            sz = 0,
            al = 0,
            hv = 0,
            bit = p.bit;

          if (ft < 0) {
            const u = (t - p.a0) / p.ad;
            if (u < 1) {
              const e = 1 - M.pow(1 - u, 3);
              const k = 1 - e;
              x = k * k * p.sx + 2 * k * e * p.qx + e * e * p.tx;
              y = k * k * p.sy + 2 * k * e * p.qy + e * e * p.ty;
              sz = p.ts * (0.6 + 0.4 * e);
              al = M.min(1, u * 4) * 0.9;
              bit = ((t * 16 + p.ph * 50) | 0) & 1;
            } else {
              x = p.tx;
              y = p.ty;
              sz = p.ts;
              al = 0.9 + 0.1 * M.sin(t * 3 + p.ph * 9);
              hv = M.max(0, 1 - ((u - 1) * p.ad) / 0.5);
              if (g > 0 && g < 1) {
                hv = M.max(
                  hv,
                  M.exp(-M.pow((p.tx - (TXL + g * TXW)) / 55, 2) * 0.5) * 0.95
                );
              }
            }
          } else if (ft < 0.22) {
            x = p.tx;
            y = p.ty;
            sz = p.ts * (1 + M.sin((ft / 0.22) * 1.57));
            al = 1;
            hv = 1;
          } else {
            const u = (ft - 0.22) / p.fd;
            if (u >= 1) continue;
            const e = 1 - M.pow(1 - u, 2.3);
            const k = 1 - e;
            x = k * k * p.tx + 2 * k * e * p.cx + e * e * p.hx;
            y = k * k * p.ty + 2 * k * e * p.cy + e * e * p.hy;
            sz = p.ts * 2 * k + 2.5 * e;
            al = M.pow(k, 1.2);
            hv = M.max(0, 1 - ft / 0.9);
            bit = ((t * 16 + p.ph * 50) | 0) & 1;
          }

          const w = (40 * sz) / 24;
          const activeSP = currentLight > 0.5 ? SP_LIGHT : SP_DARK;
          o2!.globalAlpha = al > 1 ? 1 : al;
          o2!.drawImage(
            activeSP[hv > 0.65 ? 2 : hv > 0.25 ? 1 : 0][bit],
            x - w / 2,
            y - w / 2,
            w,
            w
          );
        }

        const ra = t - TP;
        if (ra > 0 && ra < 1.4) {
          o2!.globalAlpha = 1;
          o2!.strokeStyle =
            currentLight > 0.5
              ? `rgba(34,197,94,${(1 - ra / 1.4) * 0.55})`
              : `rgba(255,214,150,${(1 - ra / 1.4) * 0.55})`;
          o2!.lineWidth = 2;
          o2!.beginPath();
          o2!.arc(W / 2, TCY, ra * 1400, 0, TAU);
          o2!.stroke();
        }
      }

      // ── WebGL2 3D Grassland Field + Clouds + Boid Birds ──────────────────
      // Smoothly interpolate theme light level: 0.0 = dark amber, 1.0 = bright green meadow
      currentLight += (targetLight - currentLight) * (1 - M.exp(-dt * 8));

      // Grass field emerges only in ready phase — keeps splash and welcome completely clean
      const em = currentPhase === "ready" ? 2.0 : -2.0;

      // Contrast calibrated ambient level:
      // Dark mode: 0.58 (gently lifted brightness from 0.52 so blades are rich and visible)
      // Light mode: 0.42 (soft, low-glare meadow keeping text perfectly readable)
      // Burst phase: 1.0 (intense welcome explosion)
      // NOTE: You can tweak these two values directly to test different brightness variants!
      const DARK_BRIGHTNESS = 0.68;  // <- increase or decrease dark theme grass brightness
      const LIGHT_BRIGHTNESS = 0.82; // <- increase or decrease light theme grass brightness

      const targetL =
        currentPhase === "ready"
          ? (currentLight > 0.5 ? LIGHT_BRIGHTNESS : DARK_BRIGHTNESS)
          : 1.0;

      if (em > 0) {
        if (t > TP + 0.3 || currentPhase === "ready") tgt += 0.75 * dt;
        cz += (tgt - cz) * (1 - M.exp(-dt * 3.5));
        spd += ((cz - pz) / dt - spd) * 0.05;
        spd = M.max(-3, M.min(3, spd));
        pz = cz;

        smx += (mx - smx) * 0.05;
        smy += (my - smy) * 0.05;
        pe += (pa - pe) * 0.05;

        const cxw = M.sin(t * 0.11) * 2 + (smx - 0.5) * 3;
        const ty = HJ(cxw, cz) + 1.25;
        if (cy === null) cy = ty;
        cy += (ty - cy) * (1 - M.exp(-dt * 6));

        const F = 1.5 - M.min(M.abs(spd), 5) * 0.002;
        const asp = gc!.width / gc!.height;
        const sxs = (smx - 0.5) * 0.04;
        gF = F;
        gA = asp;
        const nA = M.max(30, M.floor(NB * q));
        boids(dt, t, cxw, cy, cz, nA);

        gl.viewport(0, 0, gc!.width, gc!.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // 1. Clouds first (behind terrain)
        gl.useProgram(PP);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(UP.uTex, 0);
        gl.uniform3f(UP.uCam, cxw, cy, cz);
        gl.uniform2f(UP.uRes, gc!.width, gc!.height);
        gl.uniform1f(UP.uT, t);
        gl.uniform1f(UP.uF, F);
        gl.uniform1f(UP.uHz, HZ);
        gl.uniform1f(UP.uAsp, asp);
        gl.uniform1f(UP.uDpr, D);
        gl.uniform1f(UP.uSx, sxs);
        gl.uniform1f(UP.uEm, em);
        gl.uniform1f(UP.uLight, currentLight);
        gl.uniform3f(UP.uOff, 0, 0, 0);
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.uniform1f(UP.uMode, 0);
        gl.bindVertexArray(clV.v);
        gl.drawArrays(gl.POINTS, 0, clV.n);

        // 2. Terrain mesh
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.depthMask(true);
        gl.disable(gl.BLEND);
        gl.useProgram(PT);
        gl.uniform3f(UT.uCam, cxw, cy, cz);
        gl.uniform1f(UT.uF, F);
        gl.uniform1f(UT.uHz, HZ);
        gl.uniform1f(UT.uAsp, asp);
        gl.uniform1f(UT.uSx, sxs);
        gl.uniform1f(UT.uLight, currentLight);
        gl.uniform1f(UT.uL, currentLight > 0.5 ? targetL * 0.95 : 1.0);
        gl.uniform1f(UT.uK, M.min(1, M.max(0, em * 1.2)));
        gl.bindVertexArray(vaoT);
        gl.drawElements(gl.TRIANGLES, ti.length, gl.UNSIGNED_SHORT, 0);

        // 3. Instanced Grass Blades (binary bits from atlas)
        gl.depthMask(false);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(PB);
        gl.bindVertexArray(vaoB);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(UB.uTex, 0);
        gl.uniform3f(UB.uCam, cxw, cy, cz);
        gl.uniform3f(UB.uP, (pxv / W) * 2 - 1, 1 - (pyv / H) * 2, pe);
        gl.uniform2f(UB.uRes, gc!.width, gc!.height);
        gl.uniform1f(UB.uT, t);
        gl.uniform1f(UB.uF, F);
        gl.uniform1f(UB.uHz, HZ);
        gl.uniform1f(UB.uEm, em);
        gl.uniform1f(UB.uSp, spd);
        gl.uniform1f(UB.uAsp, asp);
        gl.uniform1f(UB.uDpr, D);
        gl.uniform1f(UB.uSx, sxs);
        gl.uniform1f(UB.uL, targetL);
        gl.uniform1f(UB.uLight, currentLight);

        for (let i = BD.length - 1; i >= 0; i--) {
          const b = BD[i];
          gl.uniform4f(UB.uBand, b[0], b[1], b[2], b[3]);
          gl.drawArraysInstanced(
            gl.TRIANGLE_STRIP,
            0,
            8,
            M.floor(b[4] * q)
          );
        }

        // 4. Boid Birds flapping in 3D (Sky boids with terrain depth testing)
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.depthMask(false);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(PP);
        gl.uniform3f(UP.uOff, 0, 0, 0);
        gl.uniform1f(UP.uMode, 2);
        gl.uniform1f(UP.uLight, currentLight);
        gl.bindVertexArray(brV.v);
        gl.bindBuffer(gl.ARRAY_BUFFER, brV.b);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, brV.a, 0, nA * 24);
        gl.drawArrays(gl.POINTS, 0, nA * 3);
      }
    }

    // ── Interaction Listeners ──────────────────────────────────────────────
    let ly = 0;
    const onTouchStart = (e: TouchEvent) => {
      ly = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      tgt += (ly - y) * 0.007;
      ly = y;
      pxv = e.touches[0].clientX;
      pyv = y;
      pa = 1;
    };
    let touchEndTimeout: NodeJS.Timeout;
    const onTouchEnd = () => {
      touchEndTimeout = setTimeout(() => {
        pa = 0;
      }, 500);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pxv = e.clientX;
      pyv = e.clientY;
      pa = 1;
      mx = pxv / W;
      my = pyv / H;
    };

    const onPointerDown = () => {
      const cur = performance.now() / 1000 - t0;
      if (cur > 1.0 && cur < TP) TP = cur;
    };

    const onMouseLeave = () => {
      pa = 0;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === "ArrowDown" || k === "PageDown" || k === " ") tgt += 2.0;
      else if (k === "ArrowUp" || k === "PageUp") tgt -= 2.0;
    };

    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const sy = window.scrollY;
      const dy = sy - lastScrollY;
      lastScrollY = sy;
      tgt += M.max(-1.0, M.min(1.0, dy * 0.0035));
    };

    const onWheel = (e: WheelEvent) => {
      // In landscape mode, wheel events directly advance field camera infinitely
      const isLandscape =
        document.body.classList.contains("landscape-active") ||
        document.getElementById("main")?.classList.contains("landscape-hidden");
      if (isLandscape) {
        tgt += e.deltaY * 0.0035;
      }
    };

    let rz: NodeJS.Timeout;
    const onResize = () => {
      clearTimeout(rz);
      rz = setTimeout(build, 150);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("keydown", onKeyDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    build();
    animId = requestAnimationFrame(frame);

    return () => {
      isCleanedUp = true;
      cancelAnimationFrame(animId);
      clearTimeout(rz);
      clearTimeout(touchEndTimeout);
      themeObserver.disconnect();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      // Clean up WebGL resources
      try {
        gl.deleteProgram(PB);
        gl.deleteProgram(PT);
        gl.deleteProgram(PP);
        gl.deleteTexture(tex);
        gl.deleteBuffer(bb);
        gl.deleteBuffer(tb);
        gl.deleteBuffer(teb);
        gl.deleteBuffer(clV.b);
        gl.deleteBuffer(brV.b);
        gl.deleteVertexArray(vaoB);
        gl.deleteVertexArray(vaoT);
        gl.deleteVertexArray(clV.v);
        gl.deleteVertexArray(brV.v);
      } catch {
        // ignore on unmount
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="st"
      aria-hidden="true"
    >
      <canvas ref={glCanvasRef} id="gl" />
      <canvas ref={ovCanvasRef} id="ov" />
      <div id="v" />
    </div>
  );
}
