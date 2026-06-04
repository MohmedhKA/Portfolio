"use client";

import { motion } from "framer-motion";

interface AboutProps {
  onContactClick: () => void;
}

const fadeUp = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

export default function About({ onContactClick }: AboutProps) {
  return (
    <>
      <section className="section" id="about">
        <div className="container about-layout">

          {/* About copy */}
          <motion.div className="about-copy" {...fadeUp}>
            <div className="eyebrow">About</div>
            <h2>I stopped chasing the complex and started chasing what holds.</h2>
            <p>
              My focus is applied security — understanding how systems fail,
              what attackers exploit, and how to build things that are honest
              about their threat model. I work across blockchain protocols,
              network analysis, and offensive security research.
            </p>
            <p>
              Based in Coimbatore, India. Currently finishing my undergraduate
              degree while publishing research and competing in CTFs. If the
              problem is hard and the stakes are real, I&rsquo;m interested.
            </p>
          </motion.div>

          {/* Principles / Approach */}
          <motion.aside
            className="principles"
            id="approach"
            {...fadeUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <div className="eyebrow">Approach</div>
            <h2>How I work</h2>
            <ul>
              <li>
                <span>01</span>
                Understand the threat model before writing a line of code.
              </li>
              <li>
                <span>02</span>
                Build for correctness first, performance second.
              </li>
              <li>
                <span>03</span>
                Document assumptions — every cryptographic choice is a risk.
              </li>
              <li>
                <span>04</span>
                Break it yourself before someone else does.
              </li>
            </ul>
          </motion.aside>

        </div>
      </section>

      {/* ── Contact Terminal ── creative full-width section */}
      <section className="section contact-terminal-section" id="contact">
        <div className="container">
          <motion.div
            className="contact-terminal"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Terminal header bar */}
            <div className="ct-topbar">
              <div className="ct-dots">
                <span className="ct-dot ct-dot--red" />
                <span className="ct-dot ct-dot--yellow" />
                <span className="ct-dot ct-dot--green" />
              </div>
              <span className="ct-title-bar">mohmedh@secure ~ connect</span>
            </div>

            {/* Terminal body */}
            <div className="ct-body">
              <div className="ct-lines">
                <p className="ct-line ct-line--delay-0">
                  <span className="ct-prompt">~</span>
                  <span className="ct-cmd"> ssh contact@mohmedh.dev</span>
                </p>
                <p className="ct-line ct-line--delay-1">
                  <span className="ct-ok">✓</span>
                  <span className="ct-muted"> handshake complete · TLS 1.3</span>
                </p>
                <p className="ct-line ct-line--delay-2">
                  <span className="ct-ok">✓</span>
                  <span className="ct-muted"> identity verified · ed25519</span>
                </p>
                <p className="ct-line ct-line--delay-3">
                  <span className="ct-ok">✓</span>
                  <span className="ct-muted"> channel encrypted · AES-256-GCM</span>
                </p>
                <p className="ct-line ct-line--delay-4">
                  <span className="ct-prompt">~</span>
                  <span className="ct-cmd"> ready to receive message</span>
                  <span className="ct-cursor">▋</span>
                </p>
              </div>

              <div className="ct-cta">
                <p className="ct-cta-label">Connection established.</p>
                <button
                  className="ct-connect-btn"
                  onClick={onContactClick}
                  id="contact-trigger"
                  aria-label="Open contact form"
                >
                  <span className="ct-connect-icon">▶</span>
                  Open Channel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
