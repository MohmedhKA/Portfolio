"use client";

import { motion } from "framer-motion";

interface SplashCardProps {
  onDismiss: () => void;
}

export default function SplashCard({ onDismiss }: SplashCardProps) {
  return (
    <motion.div
      className="splash-overlay"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="splash-content">
        <p className="splash-role">Cybersecurity</p>
        <h1 className="splash-name">Mohmedh K A</h1>
        <button
          id="splash-enter"
          className="btn btn-primary splash-btn"
          onClick={onDismiss}
        >
          Enter
        </button>
      </div>
    </motion.div>
  );
}
