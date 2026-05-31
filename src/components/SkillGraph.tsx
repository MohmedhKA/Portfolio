"use client";

import { useRef, useMemo, useCallback, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  animate,
  type MotionValue,
} from "framer-motion";
import { skills, type Skill } from "@/src/data/skills";

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

// ─── Improvement 1 + 2: SkillLabel with float + pull ─────────────────────────

interface SkillLabelProps {
  skill: ComputedSkill;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  pullProgress: MotionValue<number>;
  containerRef: React.RefObject<HTMLElement | null>;
  isPulling: boolean;
}

function SkillLabel({ skill, springX, springY, pullProgress, containerRef, isPulling }: SkillLabelProps) {
  // Organic float keyframe offsets — unique per skill, computed once
  const floatX = useMemo(() => {
    const v = (skill.depth * 6) + Math.sin(skill.angle) * 4;
    return [0, v, -v * 0.6, v * 0.4, 0];
  }, [skill.depth, skill.angle]);

  const floatY = useMemo(() => {
    const v = (skill.depth * 5) + Math.cos(skill.angle) * 3;
    return [0, v * 0.5, v, -v * 0.3, 0];
  }, [skill.depth, skill.angle]);

  const floatDuration = useMemo(() => skill.depth * 4 + 6, [skill.depth]);

  // Parallax: derived from cursor spring values + pullProgress
  const x = useTransform([springX, pullProgress], ([sx, p]) => {
    const W = (containerRef.current as HTMLElement | null)?.offsetWidth
      ?? (typeof window !== "undefined" ? window.innerWidth : 1440);
    const pull = ((50 - skill.pos.x) / 100) * W * 0.75;
    return (sx as number) * skill.depth * 0.018 + (p as number) * pull;
  });

  const y = useTransform([springY, pullProgress], ([sy, p]) => {
    const H = (containerRef.current as HTMLElement | null)?.offsetHeight
      ?? (typeof window !== "undefined" ? window.innerHeight : 900);
    const pull = ((50 - skill.pos.y) / 100) * H * 0.75;
    return (sy as number) * skill.depth * 0.018 + (p as number) * pull;
  });

  // Improvement 2: gravitational pull toward center via animate prop
  // 0.08 factor = gentle magnetic nudge, not a full collapse
  const pullX = isPulling ? -skill.pos.x * 0.08 : 0;
  const pullY = isPulling ? -skill.pos.y * 0.08 : 0;

  return (
    <span
      className="skill-label-anchor"
      style={{ left: `${skill.pos.x}%`, top: `${skill.pos.y}%` }}
    >
      {/* Outer: Improvement 2 — gravitational pull animate */}
      <motion.span
        animate={{ x: pullX, y: pullY }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        {/* Middle: Improvement 1 — organic float keyframes */}
        <motion.span
          animate={{ x: floatX, y: floatY }}
          transition={{
            duration: floatDuration,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "mirror",
          }}
        >
          {/* Inner: parallax from cursor */}
          <motion.span
            className="skill-label"
            style={{ x, y, willChange: "opacity" }}
          >
            {skill.label}
          </motion.span>
        </motion.span>
      </motion.span>
    </span>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function SkillGraph() {
  const containerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isPulling, setIsPulling] = useState(false);

  // Cursor parallax
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 60, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 60, damping: 20 });
  const svgX = useTransform(springX, (v) => v * 0.008);
  const svgY = useTransform(springY, (v) => v * 0.008);

  // Pull-toward-center via motion value (for SVG / parallax offset)
  const pullProgress = useMotionValue(0);

  // Improvement 4: Scroll-driven fade + blur on the inner content div
  const { scrollYProgress } = useScroll({
    target: containerRef as React.RefObject<HTMLElement>,
    offset: ["end end", "end start"],
  });
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const sectionBlur = useTransform(scrollYProgress, [0, 0.4], ["blur(0px)", "blur(6px)"]);

  const computed = useMemo(() => computePositions(), []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
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

  // Improvement 2: hover the name → smooth pull in
  const handleNameEnter = useCallback(() => {
    setIsPulling(true);
    animate(pullProgress, 1, { type: "spring", stiffness: 45, damping: 20 });
  }, [pullProgress]);

  // Snap back out with overshoot spring
  const handleNameLeave = useCallback(() => {
    setIsPulling(false);
    animate(pullProgress, 0, { type: "spring", stiffness: 500, damping: 12, mass: 0.8 });
  }, [pullProgress]);

  return (
    <section
      ref={containerRef as React.RefObject<HTMLElement>}
      className="skill-graph-wrapper"
    >
      <div
        className="skill-graph"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-label="Skill map"
      >
        {/* Improvement 4: inner content fades + blurs on scroll */}
        <motion.div
          ref={innerRef}
          style={{
            opacity: sectionOpacity,
            filter: sectionBlur,
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            willChange: "opacity",
          }}
        >
          {/* SVG lines */}
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

          {/* Improvement 3: center name with data-text for CSS glitch */}
          <div className="skill-graph-center">
            <span
              className="skill-graph-name"
              data-text="Mohmedh K A"
              onMouseEnter={handleNameEnter}
              onMouseLeave={handleNameLeave}
            >
              Mohmedh K A
            </span>
          </div>

          {/* Labels */}
          {computed.map((skill) => (
            <SkillLabel
              key={skill.label}
              skill={skill}
              springX={springX}
              springY={springY}
              pullProgress={pullProgress}
              containerRef={containerRef}
              isPulling={isPulling}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
