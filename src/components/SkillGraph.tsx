"use client";

import { useRef, useMemo, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { skills, type Skill } from "@/src/data/skills";

// ─── helpers ──────────────────────────────────────────────────────────────────

interface ComputedSkill extends Skill {
  pos: { x: number; y: number };
}

function computePositions(): ComputedSkill[] {
  return skills.map((skill) => {
    const rad = (skill.angle * Math.PI) / 180;
    return {
      ...skill,
      pos: {
        x: 50 + Math.cos(rad) * skill.distance * 50,
        y: 50 + Math.sin(rad) * skill.distance * 50,
      },
    };
  });
}

// ─── per-label sub-component (hooks cannot be called inside .map) ─────────────

interface SkillLabelProps {
  skill: ComputedSkill;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}

function SkillLabel({ skill, springX, springY }: SkillLabelProps) {
  const x = useTransform(springX, (v) => v * skill.depth * 0.018);
  const y = useTransform(springY, (v) => v * skill.depth * 0.018);

  return (
    // Outer span: absolute positioning + centering via CSS translate(-50%,-50%)
    // Inner motion.span: parallax offset only — no conflict with centering
    <span
      className="skill-label-anchor"
      style={{ left: `${skill.pos.x}%`, top: `${skill.pos.y}%` }}
    >
      <motion.span
        className="skill-label"
        style={{ x, y, willChange: "transform" }}
      >
        {skill.label}
      </motion.span>
    </span>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function SkillGraph() {
  const containerRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springX = useSpring(rawX, { stiffness: 60, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 60, damping: 20 });

  // SVG shifts at 1/3 the label speed — subtle depth layer
  const svgX = useTransform(springX, (v) => v * 0.008);
  const svgY = useTransform(springY, (v) => v * 0.008);

  // Positions computed once — never recalculated on re-render
  const computed = useMemo(() => computePositions(), []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      rawX.set(e.clientX - rect.left - rect.width / 2);
      rawY.set(e.clientY - rect.top - rect.height / 2);
    },
    [rawX, rawY]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <section
      ref={containerRef}
      className="skill-graph"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Skill map"
    >
      {/* SVG lines — sits behind labels via z-index */}
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

      {/* Center name */}
      <div className="skill-graph-center">
        <span className="skill-graph-name">Mohmedh K A</span>
      </div>

      {/* Labels */}
      {computed.map((skill) => (
        <SkillLabel
          key={skill.label}
          skill={skill}
          springX={springX}
          springY={springY}
        />
      ))}
    </section>
  );
}
