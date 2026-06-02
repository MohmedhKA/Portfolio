"use client";

import { useRef, useMemo, useCallback, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { skills, type Skill } from "@/src/data/skills";

// ─── Data layer ───────────────────────────────────────────────────────────────

interface ComputedSkill extends Skill {
  pos: { x: number; y: number };
  floatX: number[];
  floatY: number[];
  floatDur: number;
  floatDelay: number;
}

function computePositions(): ComputedSkill[] {
  return skills.map((skill) => {
    const rad = (skill.angle * Math.PI) / 180;
    const fx = (skill.depth * 6 + Math.sin(rad) * 4) * 4;
    const fy = (skill.depth * 5 + Math.cos(rad) * 3) * 4;
    return {
      ...skill,
      pos: {
        x: 50 + Math.cos(rad) * skill.distance * 50,
        y: 50 + Math.sin(rad) * skill.distance * 50,
      },
      floatX: [0, fx, -fx * 0.6, fx * 0.4, 0],
      floatY: [0, fy * 0.5, fy, -fy * 0.3, 0],
      floatDur: skill.depth * 5 + 8,
      floatDelay: Math.abs(skill.angle % 7),
    };
  });
}

// ─── SkillLabel ───────────────────────────────────────────────────────────────

interface SkillLabelProps {
  skill: ComputedSkill;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  hoverSignal: MotionValue<number>;
}

function SkillLabel({ skill, springX, springY, hoverSignal }: SkillLabelProps) {
  // Parallax — cursor spring, single source
  const px = useTransform(springX, (v) => v * skill.depth * 0.018);
  const py = useTransform(springY, (v) => v * skill.depth * 0.018);

  // Scale up slightly when name is hovered — reads MotionValue, zero re-renders
  const labelScale = useTransform(hoverSignal, [0, 1], [1, 1.22]);

  return (
    <span
      className="skill-label-anchor"
      style={{ left: `${skill.pos.x}%`, top: `${skill.pos.y}%` }}
    >
      {/* Layer 1: float — keyframes baked at compute time, never recreated */}
      <motion.span
        animate={{ x: skill.floatX, y: skill.floatY }}
        transition={{
          duration: skill.floatDur,
          repeat: Infinity,
          repeatType: "reverse",
          times: [0, 0.3, 0.6, 0.85, 1],
          delay: skill.floatDelay,
        }}
      >
        {/* Layer 2: parallax + scale via MotionValues only, no state */}
        <motion.span
          className="skill-label"
          style={{
            x: px,
            y: py,
            scale: labelScale,
            willChange: "transform",
            transformOrigin: "center center",
          }}
        >
          {skill.label}
        </motion.span>
      </motion.span>
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SkillGraph() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync container size to a ref — no state, no re-renders
  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      // Nothing to store here — containerW/H no longer needed after removing pull
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Hover signal — MotionValue only, never setState
  const hoverSignalRaw = useMotionValue(0);
  const hoverSignal = useSpring(hoverSignalRaw, { stiffness: 200, damping: 22 });

  // Cursor parallax
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 60, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 60, damping: 20 });
  const svgX = useTransform(springX, (v) => v * 0.008);
  const svgY = useTransform(springY, (v) => v * 0.008);

  const computed = useMemo(() => computePositions(), []);

  // Handlers — MotionValues + body attribute, never setState
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawX.set(e.clientX - rect.left - rect.width / 2);
      rawY.set(e.clientY - rect.top - rect.height / 2);
    },
    [rawX, rawY]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  const handleNameEnter = useCallback(() => {
    hoverSignalRaw.set(1);
    document.body.setAttribute("data-name-hover", "true");
  }, [hoverSignalRaw]);

  const handleNameLeave = useCallback(() => {
    hoverSignalRaw.set(0);
    document.body.removeAttribute("data-name-hover");
  }, [hoverSignalRaw]);

  return (
    <section className="skill-graph-wrapper">
      <div
        ref={containerRef}
        className="skill-graph"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-label="Skill map"
      >
        {/* SVG spoke lines */}
        <motion.svg
          className="skill-graph-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ x: svgX, y: svgY }}
        >
          {computed.map((skill) => (
            <line
              key={skill.label}
              x1="50"
              y1="50"
              x2={skill.pos.x}
              y2={skill.pos.y}
              stroke="var(--color-border)"
              strokeWidth="0.8"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </motion.svg>

        {/* Center: pulse ring sits BEFORE the name, anchored inside the center div */}
        <div className="skill-graph-center">
          <div className="skill-graph-pulse" aria-hidden="true" />
          <span
            className="skill-graph-name"
            data-text="Mohmedh K A"
            onMouseEnter={handleNameEnter}
            onMouseLeave={handleNameLeave}
          >
            Mohmedh K A
          </span>
        </div>

        {/* Skill labels — stable keys, never unmount on hover */}
        {computed.map((skill) => (
          <SkillLabel
            key={skill.label}
            skill={skill}
            springX={springX}
            springY={springY}
            hoverSignal={hoverSignal}
          />
        ))}
      </div>
    </section>
  );
}
