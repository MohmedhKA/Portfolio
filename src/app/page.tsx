"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SplashCard from "@/src/components/SplashCard";
import Navbar from "@/src/components/Navbar";
import SkillGraph from "@/src/components/SkillGraph";
import Hero from "@/src/components/Hero";
import Work from "@/src/components/Work";
import About from "@/src/components/About";

export default function PortfolioRoot() {
  const [splashVisible, setSplashVisible] = useState(true);

  return (
    <AnimatePresence
      // Called after SplashCard's exit animation fully completes and it unmounts.
      // At this point splashVisible is already false, but this is the canonical
      // "exit complete" hook — useful for any future cleanup.
      onExitComplete={() => setSplashVisible(false)}
    >
      {/* ── Splash overlay ────────────────────────────────────── */}
      {splashVisible && (
        <SplashCard
          key="splash"
          onDismiss={() => setSplashVisible(false)}
        />
      )}

      {/* ── Main content — blurred while splash is present ────── */}
      <motion.div
        key="content"
        initial={{ filter: "blur(8px)", opacity: 0.4 }}
        animate={
          splashVisible
            ? { filter: "blur(8px)", opacity: 0.4 }
            : { filter: "blur(0px)", opacity: 1 }
        }
        transition={{ duration: 0.9, ease: "easeOut" }}
        inert={splashVisible ? true : undefined}
        aria-hidden={splashVisible}
      >
        <Navbar />
        <main id="main">
          <SkillGraph />
          <Hero />
          <Work />
          <About />
        </main>
      </motion.div>
    </AnimatePresence>
  );
}
