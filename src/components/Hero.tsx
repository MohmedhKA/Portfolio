"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Improvement 4: fade in as the section scrolls up into view
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start center"],
  });
  const sectionOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.section
      ref={sectionRef}
      className="hero"
      id="top"
      style={{ opacity: sectionOpacity, willChange: "opacity" }}
    >
      <div className="container hero-grid">

        {/* Left column — text content */}
        <motion.div {...fadeUp}>
          <div className="eyebrow">Cybersecurity &amp; Research</div>
          <h1>Building security that holds up under pressure.</h1>
          <p>
            I research, break, and rebuild systems — from blockchain voting
            protocols to network intrusion detection. Based in Coimbatore,
            India, focused on applied security and clean engineering.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#work">See selected work</a>
            <a className="btn btn-secondary" href="#contact">Get in touch</a>
          </div>
          <div className="hero-meta" aria-label="Quick introduction details">
            <div className="meta-item">
              <span>Role</span>
              <strong>Security Researcher</strong>
            </div>
            <div className="meta-item">
              <span>Focus</span>
              <strong>Blockchain, CTF, IDS</strong>
            </div>
            <div className="meta-item">
              <span>Location</span>
              <strong>Coimbatore, India</strong>
            </div>
          </div>
        </motion.div>

        {/* Right column — hero card */}
        <motion.aside
          className="hero-card"
          aria-label="Portfolio preview panel"
          {...fadeUp}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <div className="hero-card-top">
            <div>
              <div className="mini-label">Current status</div>
              <h2>Open to opportunities.</h2>
            </div>
            <div className="status-pill">Available</div>
          </div>

          <div className="project-preview">
            <div className="preview-panel">
              <div className="preview-topbar" aria-hidden="true">
                <span /><span /><span />
              </div>
              <div className="preview-layout">
                <div className="preview-main">
                  <div className="preview-kicker">Latest project</div>
                  <div className="preview-headline">
                    Blockchain voting at scale.
                  </div>
                  <div className="preview-copy">
                    Hyperledger Fabric with Private Data Collections,
                    cryptographic audit trails, and sub-second finality.
                  </div>
                  <div className="preview-chip-row">
                    <span className="chip">Hyperledger</span>
                    <span className="chip">Node.js</span>
                    <span className="chip">Research</span>
                  </div>
                </div>
                <div className="preview-side">
                  <div className="preview-block">
                    <strong>Security first</strong>
                    Cryptographic integrity checked at every layer.
                  </div>
                  <div className="preview-block">
                    <strong>Performance</strong>
                    Batch processing with worker-based concurrency.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>

      </div>
    </motion.section>
  );
}
