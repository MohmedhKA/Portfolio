"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SplashCard from "@/src/components/SplashCard";
import Navbar from "@/src/components/Navbar";
import SkillGraph from "@/src/components/SkillGraph";
import Hero from "@/src/components/Hero";
import Work from "@/src/components/Work";
import Domains from "@/src/components/Domains";
import About from "@/src/components/About";
import MinecraftContact from "@/src/components/MinecraftContact";
import BinaryParticleBackground from "@/src/components/BinaryParticleBackground";

export default function PortfolioRoot() {
  const [phase, setPhase] = useState<"splash" | "welcome" | "ready">("splash");
  const [mcContactOpen, setMcContactOpen] = useState(false);

  // Prevent body scrolling while splash or welcome screen is active
  useEffect(() => {
    if (phase !== "ready") {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [phase]);

  // Transition from Welcome screen -> Main portfolio (held for 2.8 seconds)
  useEffect(() => {
    if (phase === "welcome") {
      const timer = setTimeout(() => {
        setPhase("ready");
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  return (
    <>
      {/* ── Floating Binary Particle Background ─────────────────────── */}
      <BinaryParticleBackground phase={phase} />

      <AnimatePresence mode="wait">
        {/* ── 1. Splash Overlay ────────────────────────────────────── */}
        {phase === "splash" && (
          <SplashCard
            key="splash"
            onDismiss={() => setPhase("welcome")}
          />
        )}

        {/* ── 2. Welcome Screen Overlay ────────────────────────────── */}
        {phase === "welcome" && (
          <motion.div
            key="welcome"
            className="welcome-overlay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="welcome-content">
              <div className="welcome-badge">SYSTEM ACCESS GRANTED</div>
              <h1 className="welcome-title">WELCOME</h1>
              <p className="welcome-sub">MOHMEDH K A &bull; DEVELOPER &amp; SECURITY RESEARCHER</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 3. Main Portfolio Content ───────────────────────────── */}
      <motion.div
        key="content"
        initial={{ filter: "blur(10px)", opacity: 0 }}
        animate={
          phase === "ready"
            ? { filter: "blur(0px)", opacity: 1 }
            : { filter: "blur(10px)", opacity: 0 }
        }
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        inert={phase !== "ready" ? true : undefined}
        aria-hidden={phase !== "ready"}
      >
        <Navbar onContactClick={() => setMcContactOpen(true)} />
        <main id="main">
          <SkillGraph />
          <Hero onContactClick={() => setMcContactOpen(true)} />
          <Domains />
          <Work />
          <About onContactClick={() => setMcContactOpen(true)} />
        </main>
      </motion.div>

      {/* ── Minecraft Contact Overlay ───────────────────────────── */}
      <MinecraftContact
        open={mcContactOpen}
        onClose={() => setMcContactOpen(false)}
      />
    </>
  );
}
