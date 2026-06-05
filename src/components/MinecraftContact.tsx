"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MinecraftContactProps {
  open: boolean;
  onClose: () => void;
}

// Generate a shuffled grid of [col, row] indices for random dissolve order
function useShuffledGrid(cols: number, rows: number) {
  return useMemo(() => {
    const cells = Array.from({ length: cols * rows }, (_, i) => ({
      col: i % cols,
      row: Math.floor(i / cols),
      delay: Math.random() * 0.6,
    }));
    // Fisher-Yates shuffle for random order
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }
    return cells;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

const COLS = 20;
const ROWS = 13;

export default function MinecraftContact({ open, onClose }: MinecraftContactProps) {
  const [phase, setPhase] = useState<"form" | "loading" | "done">("form");
  const [progress, setProgress] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [revealed, setRevealed] = useState(false);
  const grid = useShuffledGrid(COLS, ROWS);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPhase("loading");
    setProgress(0);

    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(timer); return 100; }
        return p + 4;
      });
    }, 80);

    try {
      const formUrl = process.env.NEXT_PUBLIC_FORMSPREE_URL || "";
      if (formUrl) {
        await fetch(formUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        });
      }
    } catch (_) {}

    setTimeout(() => { setPhase("done"); }, 2600);
  }

  function handleClose() {
    setRevealed(false);
    setPhase("form");
    setProgress(0);
    setName(""); setEmail(""); setMessage("");
    onClose();
  }

  return (
    <AnimatePresence onExitComplete={() => setRevealed(false)}>
      {open && (
        <motion.div
          className="mc-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            WebkitMask: "url(#pixel-mask)",
            mask: "url(#pixel-mask)",
          }}
          onAnimationStart={() => {
            // Trigger grid dissolve shortly after mount
            setTimeout(() => setRevealed(true), 60);
          }}
        >
          {/* ── SVG mask definition for pixel reveal effect ── */}
          <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
            <defs>
              <mask id="pixel-mask" maskContentUnits="objectBoundingBox">
                {grid.map((cell, i) => (
                  <motion.rect
                    key={i}
                    x={cell.col / COLS}
                    y={cell.row / ROWS}
                    width={1 / COLS + 0.005} // overlap slightly to prevent seam lines
                    height={1 / ROWS + 0.005}
                    fill="white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: revealed ? 1 : 0 }}
                    transition={{
                      duration: 0.18,
                      delay: revealed ? cell.delay : 0,
                      ease: "easeIn",
                    }}
                  />
                ))}
              </mask>
            </defs>
          </svg>

          {/* ── Form phase ── */}
          {phase === "form" && (
            <div className="mc-container">
              {/* Header */}
              <div className="mc-header">
                <span className="mc-header-title">Contact</span>
              </div>

              {/* Content */}
              <div className="mc-content">
                <form id="mc-contact-form" className="mc-form" onSubmit={handleSubmit}>
                  <div className="mc-form-row">
                    <label className="mc-label">Player Name: Default</label>
                    <input
                      className="mc-input"
                      type="text"
                      placeholder="Leave blank for a random name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mc-form-row">
                    <label className="mc-label">Message Channel (Email)</label>
                    <input
                      className="mc-input"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mc-form-row">
                    <label className="mc-label">Your Message</label>
                    <textarea
                      className="mc-input mc-textarea"
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                    />
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="mc-footer">
                <div className="mc-btn-row">
                  <button type="submit" form="mc-contact-form" className="mc-btn">
                    Send Message
                  </button>
                  <button type="button" className="mc-btn" onClick={handleClose}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Loading phase — Java Edition world creation style ── */}
          {phase === "loading" && (
            <div className="mc-loading-screen">
              <p className="mc-percent">{Math.round(progress)}%</p>
              <div className="mc-world-icon">
                <div className="mc-world-icon-panel">
                  <div
                    className="mc-world-icon-fill"
                    style={{ height: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Done phase ── */}
          {phase === "done" && (
            <div className="mc-loading-screen">
              <p className="mc-percent">Message Sent.</p>
              <p className="mc-loading-sub">I&apos;ll reply soon.</p>
              <button className="mc-btn mc-done-btn" onClick={handleClose}>
                Back to World
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
