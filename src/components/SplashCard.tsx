"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface SplashCardProps {
  onDismiss: () => void;
}

interface LogEntry {
  id: string;
  type: "ok" | "ready" | "help" | "warn" | "error" | "cmd" | "prize";
  label: string;
  text: string;
  isSpoiler?: boolean;
  link?: string;
  icon?: "smiley" | "spider";
}

const INITIAL_LOGS: LogEntry[] = [
  {
    id: "1",
    type: "ok",
    label: "[OK]",
    text: "Loading Cryptography Modules (Post-Quantum & RSA)...",
  },
  {
    id: "2",
    type: "ok",
    label: "[OK]",
    text: "Connecting Hyperledger Fabric Peer Nodes & Ledger State...",
  },
  {
    id: "3",
    type: "ok",
    label: "[OK]",
    text: "Configuring Boids Flocking Algorithm & Particle Dynamics...",
  },
  {
    id: "4",
    type: "ready",
    label: "[READY]",
    text: "Security Audit Complete: 0 Vulnerabilities Detected. E2E Verified.",
  },
];

const LS_ERRORS = [
  "sorry access denied",
  "I TOLD YOU! access denied",
  "IT DOESN'T WORK! STOP IT",
  "IT ANNOYING STOP IT, final chance!!",
  "FINAL CHANCE GO AWAY!",
];

function triggerConfetti() {
  if (typeof window === "undefined") return;
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "10000";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    vRot: number;
  }> = [];

  const colors = ["#e59a38", "#3cd070", "#4a9eff", "#ec4899", "#f59e0b", "#a855f7"];

  for (let i = 0; i < 110; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.7) * 18,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
    });
  }

  const startTime = Date.now();

  function render() {
    if (!ctx) return;
    const elapsed = Date.now() - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4;
      p.rotation += p.vRot;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (elapsed < 2400) {
      requestAnimationFrame(render);
    } else {
      canvas.remove();
    }
  }

  render();
}

const SmileyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="splash-inline-icon">
    <circle cx="12" cy="12" r="10"/>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
    <line x1="9" y1="9" x2="9.01" y2="9"/>
    <line x1="15" y1="9" x2="15.01" y2="9"/>
  </svg>
);

const SpiderIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="splash-inline-icon">
    <path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
    <path d="M12 18a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
    <path d="M6 5l3 3M18 5l-3 3M4 11h4M20 11h-4M5 18l3-3M19 18l-3-3"/>
  </svg>
);

export default function SplashCard({ onDismiss }: SplashCardProps) {
  const [inputValue, setInputValue] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [lsCount, setLsCount] = useState(0);
  const [prizeClicked, setPrizeClicked] = useState(false);
  const [prizeRevealed, setPrizeRevealed] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  function handleUnlockPrize() {
    if (!prizeRevealed) {
      setPrizeRevealed(true);
      setPrizeClicked(true);
      triggerConfetti();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const cmd = inputValue.trim().toLowerCase();
      if (!cmd || cmd === "enter" || cmd === "exit" || cmd === "start") {
        onDismiss();
        return;
      }

      const timestamp = Date.now().toString();
      const newEntries: LogEntry[] = [
        {
          id: `cmd-${timestamp}`,
          type: "cmd",
          label: "mohmedh@terminal:~$",
          text: inputValue.trim(),
        },
      ];

      if (cmd === "help") {
        newEntries.push(
          {
            id: `help-1-${timestamp}`,
            type: "help",
            label: "[HELP]",
            text: "Commands: 'enter' (launch portfolio), 'help' (show commands), 'clear' (reset log).",
          },
          {
            id: `help-2-${timestamp}`,
            type: "warn",
            label: "[WARNING]",
            text: "DO NOT type 'ls'. Access to system directory is strictly prohibited.",
          }
        );
      } else if (cmd === "clear") {
        setLogs(INITIAL_LOGS);
        setInputValue("");
        return;
      } else if (cmd === "ls") {
        const nextCount = lsCount + 1;
        setLsCount(nextCount);

        if (nextCount <= 5) {
          newEntries.push({
            id: `ls-err-${timestamp}`,
            type: "error",
            label: "[ERROR]",
            text: LS_ERRORS[nextCount - 1],
          });
        } else if (nextCount === 6) {
          newEntries.push({
            id: `ls-prize-${timestamp}`,
            type: "prize",
            label: "[PRIZE]",
            text: "OKAY you win here:",
            isSpoiler: true,
            link: "/images/Prize.gif",
          });
        } else {
          // 7th attempt and beyond
          if (prizeClicked) {
            newEntries.push({
              id: `ls-more-${timestamp}`,
              type: "prize",
              label: "[PRIZE]",
              text: "you want more",
              icon: "smiley",
            });
          } else {
            newEntries.push({
              id: `ls-spidey-${timestamp}`,
              type: "warn",
              label: "[WARN]",
              text: "everyone get one chance",
              icon: "spider",
            });
          }
        }
      } else {
        newEntries.push({
          id: `err-${timestamp}`,
          type: "error",
          label: "[ERROR]",
          text: `Command not found: '${cmd}'. Type 'help' or press ENTER to launch.`,
        });
      }

      setLogs((prev) => [...prev, ...newEntries]);
      setInputValue("");
    }
  }

  return (
    <motion.div
      className="splash-overlay"
      initial={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="splash-card">
        {/* Terminal Header */}
        <div className="splash-header">
          <div className="splash-dots">
            <span className="splash-dot splash-dot--red" />
            <span className="splash-dot splash-dot--yellow" />
            <span className="splash-dot splash-dot--green" />
          </div>
          <span className="splash-kernel-title">mohmedh@kernel ~ bootloader v2.6.0</span>
        </div>

        {/* Terminal Body */}
        <div className="splash-body">
          <h1 className="splash-title">&gt; INITIALIZING SECURITY CORE</h1>

          <div className="splash-logs-wrapper">
            <div className="splash-logs">
              {logs.map((log) => (
                <div key={log.id} className={`splash-log-item splash-log-item--${log.type}`}>
                  <span className={`splash-log-badge splash-log-badge--${log.type}`}>
                    {log.label}
                  </span>
                  <span className="splash-log-text">
                    {log.text}{" "}
                    {log.isSpoiler && (
                      prizeRevealed ? (
                        <a
                          href="/images/Prize.gif"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="splash-spoiler-btn splash-spoiler-btn--unlocked"
                        >
                          [ 🎁 Prize.gif (Unlocked) ]
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={handleUnlockPrize}
                          className="splash-spoiler-btn"
                        >
                          [ 🙈 CLICK TO REVEAL PRIZE ]
                        </button>
                      )
                    )}
                    {log.icon === "smiley" && <SmileyIcon />}
                    {log.icon === "spider" && <SpiderIcon />}
                  </span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>

          <div className="splash-input-row">
            <span className="splash-prompt">mohmedh@terminal:~$</span>
            <input
              type="text"
              className="splash-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type 'enter' or press ENTER key..."
              autoFocus
            />
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="splash-footer">
          <div className="splash-footer-info">
            <span className="splash-footer-line">
              <span className="splash-glowing-dot" />
              Type &apos;help&apos; for commands
            </span>
            <span className="splash-footer-warn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Do not type &apos;ls&apos;
            </span>
          </div>
          <button
            id="splash-enter"
            className="splash-enter-btn"
            onClick={onDismiss}
            type="button"
          >
            ENTER SYSTEM <span className="splash-btn-arrow">↓</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}



