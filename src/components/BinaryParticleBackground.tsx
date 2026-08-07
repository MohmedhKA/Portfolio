"use client";
import { useEffect, useRef } from "react";

// ─── Single Design Token ────────────────────────────────────────────────────
// Warm saffron-amber — matches the portfolio's primary accent
const C = { r: 220, g: 152, b: 52 };
const rgba = (a: number) => `rgba(${C.r},${C.g},${C.b},${a})`;

// ─── Boids Constants (Craig Reynolds, 1986) ─────────────────────────────────
const MAX_SPEED    = 1.8;
const MAX_FORCE    = 0.04;
const SEP_RADIUS   = 32;
const ALIGN_RADIUS = 90;
const COH_RADIUS   = 120;
const SEP_W        = 1.6;
const ALI_W        = 1.0;
const COH_W        = 0.7;

// ─── Particle types ─────────────────────────────────────────────────────────

/** A particle assembling/blasting during the Welcome phase */
interface WP {
  x: number; y: number;
  vx: number; vy: number;
  tx: number; ty: number;   // target position on "WELCOME" glyph
  char: "0" | "1";
  size: number;
  opacity: number;
  glow: number;
  blasting: boolean;
  life: number;             // 1 → 0 during blast fade
  pulse: number;
}

/** An ambient flocking Boid particle */
interface BP {
  x: number; y: number;
  vx: number; vy: number;
  char: "0" | "1";
  size: number;
  opacity: number;
  baseOp: number;
  glow: number;
  pulse: number;
  pulseSpd: number;
}

interface Props { phase: "splash" | "welcome" | "ready"; }

export default function BinaryParticleBackground({ phase }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const phaseRef  = useRef(phase);
  const wRef      = useRef<WP[]>([]);
  const bRef      = useRef<BP[]>([]);
  const initedRef = useRef<"" | "welcome" | "ready">("");

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf: number;
    let W = 0, H = 0, dpr = 1;
    let lastSY = window.scrollY, scrollVel = 0, t = 0;
    const mouse = { x: -9999, y: -9999, r: 140 };

    // ── helpers ───────────────────────────────────────────────────────────
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    const lim   = (vx: number, vy: number, max: number): [number, number] => {
      const s = Math.hypot(vx, vy);
      return s > max ? [vx / s * max, vy / s * max] : [vx, vy];
    };

    // ── boid spawner (defined early; resize calls it) ─────────────────────
    const spawnBoids = () => {
      const n = W < 768 ? 60 : 110;
      bRef.current = Array.from({ length: n }, (): BP => {
        const a   = Math.random() * Math.PI * 2;
        const spd = Math.random() * 0.8 + 0.5;
        const bo  = Math.random() * 0.45 + 0.2;
        return {
          x: Math.random() * W,     y: Math.random() * H,
          vx: Math.cos(a) * spd,   vy: Math.sin(a) * spd,
          char: Math.random() > 0.5 ? "1" : "0",
          size: Math.floor(Math.random() * 7) + 11,
          opacity: bo, baseOp: bo,
          glow: Math.random() > 0.55 ? Math.random() * 8 + 4 : 0,
          pulse: Math.random() * Math.PI * 2,
          pulseSpd: Math.random() * 0.025 + 0.008,
        };
      });
    };

    // ── resize ────────────────────────────────────────────────────────────
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W   = window.innerWidth;
      H   = window.innerHeight;
      canvas.width        = W * dpr;
      canvas.height       = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);
      if (phaseRef.current === "ready") spawnBoids();
    };
    resize();
    window.addEventListener("resize", resize);

    // ── pointer ───────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent | TouchEvent) => {
      const src = "touches" in e ? e.touches[0] : (e as MouseEvent);
      if (src) { mouse.x = src.clientX; mouse.y = src.clientY; }
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener("mousemove",  onMove);
    window.addEventListener("touchmove",  onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    // ── sample "WELCOME" glyph pixels on offscreen canvas ─────────────────
    const sampleWelcome = () => {
      const el = document.querySelector(".welcome-title") as HTMLElement | null;

      // Derive position and font from the actual DOM element
      let cx = W / 2, cy = H / 2;
      let fs = Math.min(W * 0.11, 136);
      let cw = Math.min(W * 0.88, 860);
      let ch = fs * 1.6;
      let ls = "-0.02em"; // matches the CSS letter-spacing

      if (el) {
        const r  = el.getBoundingClientRect();
        const cs = window.getComputedStyle(el);
        cx = r.left + r.width  / 2;
        cy = r.top  + r.height / 2;
        const parsed = parseFloat(cs.fontSize);
        if (!isNaN(parsed) && parsed > 0) fs = parsed;
        cw = Math.max(r.width + 60, W * 0.88);
        ch = r.height + 60;
        if (cs.letterSpacing && cs.letterSpacing !== "normal") ls = cs.letterSpacing;
      }

      // Draw "WELCOME" on an offscreen canvas with matching font/spacing
      const off = document.createElement("canvas");
      off.width  = Math.ceil(cw);
      off.height = Math.ceil(ch);
      const oc   = off.getContext("2d")!;

      oc.font          = `700 ${fs}px 'Instrument Serif', Georgia, serif`;
      oc.textAlign     = "center";
      oc.textBaseline  = "middle";
      oc.fillStyle     = "#ffffff";

      // Apply letter-spacing if the browser supports it on canvas
      if ("letterSpacing" in oc) (oc as any).letterSpacing = ls;

      oc.fillText("WELCOME", cw / 2, ch / 2);

      const id   = oc.getImageData(0, 0, Math.ceil(cw), Math.ceil(ch));
      const data = id.data;

      // Dynamic responsive step: fine step on mobile (4) so letter strokes are dense & clear
      const step = W < 480 ? 4 : W < 768 ? 5 : 6;
      const ox   = cx - cw / 2;         // screen origin of offscreen canvas
      const oy   = cy - ch / 2;

      // Collect all opaque pixel positions inside the glyph
      const positions: [number, number][] = [];
      for (let sy = 0; sy < ch; sy += step) {
        for (let sx = 0; sx < cw; sx += step) {
          const idx = (Math.floor(sy) * Math.ceil(cw) + Math.floor(sx)) * 4;
          if (data[idx + 3] > 100) positions.push([ox + sx, oy + sy]);
        }
      }
      if (!positions.length) return;

      // Fisher–Yates shuffle (random target assignment keeps motion organic)
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }

      // Particle size scales dynamically with WELCOME font size
      const baseCharSize = Math.max(8, Math.min(14, Math.round(fs * 0.085)));

      // Spawn each particle near its target so it settles quickly and forms the word
      const spread = Math.min(W, H) * 0.18; // ~180px on desktop
      wRef.current = positions.map(([tx, ty]): WP => ({
        x: tx + (Math.random() - 0.5) * spread * 2,
        y: ty + (Math.random() - 0.5) * spread * 2,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        tx, ty,
        char:     Math.random() > 0.5 ? "1" : "0",
        size:     baseCharSize + (Math.random() > 0.5 ? 1 : 0),
        opacity:  0,
        glow:     0,  // no shadow during assembly — shadowBlur is the #1 canvas perf killer
        blasting: false,
        life:     1,
        pulse:    Math.random() * Math.PI * 2,
      }));
    };

    // ── kick all welcome particles outward ───────────────────────────────
    const blastWelcome = () => {
      wRef.current.forEach(p => {
        p.blasting = true;
        const angle = Math.atan2(p.y - H / 2, p.x - W / 2) + (Math.random() - 0.5) * 0.7;
        const spd   = Math.random() * 17 + 8;
        p.vx = Math.cos(angle) * spd;
        p.vy = Math.sin(angle) * spd;
      });
    };

    // ── main render loop ─────────────────────────────────────────────────
    const render = () => {
      t += 0.015;
      const cp = phaseRef.current;

      // Scroll velocity
      const sy  = window.scrollY;
      scrollVel += (sy - lastSY - scrollVel) * 0.15;
      scrollVel *= 0.92;
      lastSY    = sy;

      // ── Phase initialisation (fires once per phase transition) ────────
      if (cp === "welcome" && initedRef.current !== "welcome") {
        initedRef.current = "welcome";
        wRef.current      = [];
        // Wait for Instrument Serif to fully load, then sample
        document.fonts.ready.then(() => sampleWelcome()).catch(() => setTimeout(sampleWelcome, 300));
        setTimeout(blastWelcome, 2300);  // give ~2s of assembly time before blast
        canvas.style.zIndex = "9995";
      }

      if (cp === "ready" && initedRef.current !== "ready") {
        initedRef.current = "ready";
        blastWelcome();                   // force-blast any still-assembling ones
        setTimeout(() => { wRef.current = []; spawnBoids(); }, 700);
        // zIndex set dynamically below
      }

      if (cp === "splash" && initedRef.current !== "") {
        initedRef.current = "";
        wRef.current = [];
        bRef.current = [];
      }

      // ── Canvas stacking & opacity ─────────────────────────────────────
      const hasWP       = wRef.current.length > 0;
      const inSkillGrph = cp === "ready" && sy < H * 0.75;

      // Keep canvas elevated until all welcome particles are gone
      if (cp === "welcome" || hasWP) {
        canvas.style.zIndex = "9995";
      } else {
        canvas.style.zIndex = "0";
      }

      let targetOp = 0;
      if (cp === "welcome" || hasWP) targetOp = 1.0;
      else if (cp === "ready" && !inSkillGrph) targetOp = 0.85;

      const curOp = parseFloat(canvas.style.opacity || "0");
      canvas.style.opacity = String(clamp(curOp + (targetOp - curOp) * 0.10, 0, 1));

      ctx.clearRect(0, 0, W, H);

      // ── 1 · Welcome particles ─────────────────────────────────────────
      const wp = wRef.current;
      for (let i = wp.length - 1; i >= 0; i--) {
        const p = wp[i];

        if (p.blasting) {
          // Explosive radial drift + fade
          p.x   += p.vx;  p.y   += p.vy;
          p.vx  *= 0.96;  p.vy  *= 0.96;
          p.life -= 0.018;
          p.opacity = Math.max(0, p.life);
          if (p.life <= 0) { wp.splice(i, 1); continue; }
        } else {
          // Pure lerp — exponential decay to target, zero oscillation by design
          p.x += (p.tx - p.x) * 0.22;
          p.y += (p.ty - p.y) * 0.22;
          p.opacity = clamp(p.opacity + 0.05, 0, 0.90);
        }

        p.pulse += 0.04;
        const alpha = clamp(p.opacity + Math.sin(p.pulse) * 0.03, 0, 1);

        // No save/restore or shadow — just set fillStyle directly for performance
        ctx.shadowBlur = 0;
        ctx.font = `600 ${p.size}px 'Courier New', monospace`;
        ctx.fillStyle = rgba(alpha);
        ctx.fillText(p.char, p.x, p.y);
      }

      // ── 2 · Boid particles (Reynolds' three rules) ───────────────────
      const bp = bRef.current;
      if (bp.length > 0) {

        for (let i = 0; i < bp.length; i++) {
          const p = bp[i];
          let sepX=0, sepY=0, sN=0;
          let aliX=0, aliY=0, aN=0;
          let cohX=0, cohY=0, cN=0;

          for (let j = 0; j < bp.length; j++) {
            if (i === j) continue;
            const q  = bp[j];
            const dx = q.x - p.x, dy = q.y - p.y;
            const d  = Math.hypot(dx, dy);
            if (d > 0 && d < SEP_RADIUS) { sepX -= dx / d; sepY -= dy / d; sN++; }
            if (d < ALIGN_RADIUS)         { aliX += q.vx;  aliY += q.vy;  aN++; }
            if (d < COH_RADIUS)           { cohX += q.x;   cohY += q.y;   cN++; }
          }

          let stX = 0, stY = 0;
          if (sN > 0) {
            let [dx, dy] = lim(sepX / sN, sepY / sN, MAX_SPEED);
            let [fx, fy] = lim(dx - p.vx, dy - p.vy, MAX_FORCE);
            stX += fx * SEP_W; stY += fy * SEP_W;
          }
          if (aN > 0) {
            let [dx, dy] = lim(aliX / aN, aliY / aN, MAX_SPEED);
            let [fx, fy] = lim(dx - p.vx, dy - p.vy, MAX_FORCE);
            stX += fx * ALI_W; stY += fy * ALI_W;
          }
          if (cN > 0) {
            let [dx, dy] = lim(cohX / cN - p.x, cohY / cN - p.y, MAX_SPEED);
            let [fx, fy] = lim(dx - p.vx, dy - p.vy, MAX_FORCE);
            stX += fx * COH_W; stY += fy * COH_W;
          }

          // Mouse repulsion
          const mDx = p.x - mouse.x, mDy = p.y - mouse.y;
          const mD  = Math.hypot(mDx, mDy);
          if (mD < mouse.r && mD > 0) {
            const str = (1 - mD / mouse.r) * 0.18;
            stX += (mDx / mD) * str;
            stY += (mDy / mD) * str;
            p.opacity = clamp(p.baseOp + (1 - mD / mouse.r) * 0.4, 0, 1);
          } else {
            p.opacity += (p.baseOp - p.opacity) * 0.04;
          }

          // Scroll vortex
          if (Math.abs(scrollVel) > 0.5) {
            stX += Math.sin(t * 1.5 + p.y * 0.008) * scrollVel * 0.006;
            stY += scrollVel * 0.003;
          }

          p.vx += stX; p.vy += stY;
          [p.vx, p.vy] = lim(p.vx, p.vy, MAX_SPEED);
          p.x += p.vx; p.y += p.vy;

          // Toroidal wrap-around
          if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
          if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;

          p.pulse += p.pulseSpd;
        }

        for (const p of bp) {
          const alpha = clamp(p.opacity + Math.sin(p.pulse) * 0.06, 0.08, 0.95);
          ctx.save();
          ctx.font = `600 ${p.size}px 'Courier New', monospace`;
          if (p.glow > 0) { ctx.shadowColor = rgba(0.8); ctx.shadowBlur = p.glow; }
          ctx.fillStyle = rgba(alpha);
          ctx.fillText(p.char, p.x, p.y);
          ctx.restore();
        }
      }

      raf = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize",     resize);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("touchmove",  onMove);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="binary-particle-canvas"
      aria-hidden="true"
    />
  );
}
