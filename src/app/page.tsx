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
  const [landscapeMode, setLandscapeMode] = useState(false);

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

  // Transition from Welcome screen -> Main portfolio (held for 2.6 seconds)
  useEffect(() => {
    if (phase === "welcome") {
      const timer = setTimeout(() => {
        setPhase("ready");
      }, 2600);
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03, filter: "blur(6px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="welcome-content">
              <motion.div
                className="welcome-badge"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                SYSTEM ACCESS GRANTED
              </motion.div>

              <div className="welcome-spacer" />

              <h1 className="welcome-title">WELCOME</h1>

              <motion.p
                className="welcome-sub"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                MOHMEDH K A &bull; DEVELOPER &amp; SECURITY RESEARCHER
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 3. Main Portfolio Content ───────────────────────────── */}
      <motion.div
        key="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "ready" ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ pointerEvents: phase === "ready" ? "auto" : "none" }}
        aria-hidden={phase !== "ready"}
      >
        <Navbar
          onContactClick={() => setMcContactOpen(true)}
          landscapeMode={landscapeMode}
          onToggleLandscape={() => setLandscapeMode((prev) => !prev)}
        />
        <main id="main" className={landscapeMode ? "landscape-hidden" : ""}>
          <SkillGraph />
          <Hero onContactClick={() => setMcContactOpen(true)} />
          <Domains />
          <Work />
          <About onContactClick={() => setMcContactOpen(true)} />
        </main>
      </motion.div>

      {/* ── Landscape View Mode Floating Hint & Return ────────── */}
      <AnimatePresence>
        {phase === "ready" && landscapeMode && (
          <motion.div
            className="landscape-hint"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <span>Scroll or drag to walk the field</span>
            <button
              type="button"
              onClick={() => setLandscapeMode(false)}
              className="landscape-return-btn"
            >
              Return to portfolio
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Minecraft Contact Overlay ───────────────────────────── */}
      <MinecraftContact
        open={mcContactOpen}
        onClose={() => setMcContactOpen(false)}
      />
    </>
  );
}
