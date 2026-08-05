"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SplashCard from "@/src/components/SplashCard";
import Navbar from "@/src/components/Navbar";
import SkillGraph from "@/src/components/SkillGraph";
import Hero from "@/src/components/Hero";
import Work from "@/src/components/Work";
import Domains from "@/src/components/Domains";
import About from "@/src/components/About";
import MinecraftContact from "@/src/components/MinecraftContact";

export default function PortfolioRoot() {
  const [splashVisible, setSplashVisible] = useState(true);
  const [mcContactOpen, setMcContactOpen] = useState(false);

  return (
    <>
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
          <Navbar onContactClick={() => setMcContactOpen(true)} />
          <main id="main">
            <SkillGraph />
            <Hero onContactClick={() => setMcContactOpen(true)} />
            <Domains />
            <Work />
            <About onContactClick={() => setMcContactOpen(true)} />
          </main>
        </motion.div>
      </AnimatePresence>

      {/* ── Minecraft Contact overlay — rendered outside main AnimatePresence
           so it can freely mount/unmount above all other content ── */}
      <MinecraftContact
        open={mcContactOpen}
        onClose={() => setMcContactOpen(false)}
      />
    </>
  );
}
