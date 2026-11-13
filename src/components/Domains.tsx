"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

export default function Domains() {
  const [packetCount, setPacketCount] = useState(14892);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);

  // Live telemetry packet counter
  useEffect(() => {
    const interval = setInterval(() => {
      setPacketCount((prev) => prev + Math.floor(Math.random() * 14) + 1);
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  // Sequential Spotlight Scheduler:
  // Card 0 (3.5s) -> Card 1 (3.5s) -> Card 2 (3.5s) -> Card 3 (3.5s) -> 10s Break (-1) -> Repeat
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (spotlightIndex >= 0 && spotlightIndex <= 3) {
      timer = setTimeout(() => {
        setSpotlightIndex((prev) => prev + 1);
      }, 3500);
    } else if (spotlightIndex === 4) {
      // 10 second break phase (-1)
      setSpotlightIndex(-1);
      timer = setTimeout(() => {
        setSpotlightIndex(0);
      }, 10000);
    }

    return () => clearInterval(timer);
  }, [spotlightIndex]);

  // Determine active card (hover takes priority, otherwise sequential spotlight)
  const isCardActive = (index: number) => {
    if (hoveredCard !== null) return hoveredCard === index;
    return spotlightIndex === index;
  };

  return (
    <section className="section domain-section" id="domains">
      <div className="container">
        
        {/* Section Header */}
        <motion.div className="section-head" {...fadeUp}>
          <div>
            <div className="eyebrow">Technical Domains</div>
            <h2 className="section-title">
              Specialized Engineering &amp; Research Focus
            </h2>
          </div>
          <p>
            Structured across threat modeling, cryptographic protocols, distributed ledger architectures, and high-performance system design.
          </p>
        </motion.div>

        {/* 2x2 Interactive Domain Cards Grid */}
        <div className="domains-grid">
          
          {/* ============================================================
             DOMAIN 01: Cybersecurity & Cryptography (Arrow vs Shield Icon Deflect)
             ============================================================ */}
          <div className="domain-card-wrapper">
            {/* Outer Top Red Arrow + Shield Icon Animation */}
            <div className={`outer-arrow-shield-anim ${isCardActive(0) ? "outer-anim-active" : ""}`} aria-hidden="true">
              <div className="flying-arrow-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
              <div className="deflecting-shield-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(6, 182, 212, 0.2)" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <div className="shield-force-ring" />
              </div>
            </div>

            <motion.div
              className={`domain-card domain-card--crypto ${isCardActive(0) ? "domain-card--spotlight" : ""}`}
              {...fadeUp}
              onMouseEnter={() => setHoveredCard(0)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Ambient Cipher Matrix BG */}
              <div className="crypto-matrix-bg" aria-hidden="true">
                <span>0x7F2A9B4C</span>
                <span>RSA_4096_E2E</span>
                <span>LATTICE_SIG</span>
                <span>0x90A1FF32</span>
                <span>AES_256_GCM</span>
                <span>POST_QUANTUM</span>
              </div>

              <div className="domain-card-header">
                <span className="domain-number">01</span>
                <span className="domain-badge-pill domain-badge-pill--cyan">Cybersecurity &amp; Audit</span>
              </div>

              <h3 className="domain-card-title">Cybersecurity &amp; Cryptography</h3>
              <p className="domain-card-desc">
                Applied vulnerability assessment, post-quantum cryptography research, blind signature schemes, and zero-knowledge threat modeling.
              </p>

              {/* Interactive Telemetry Box */}
              <div className="domain-interactive-box crypto-box">
                <div className="crypto-shield-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span className="crypto-status-text">
                  {isCardActive(0) ? "[ LATTICE_SIG: 0 VULNERABILITIES ]" : "[ ENCRYPTED SHA-256 VAULT ]"}
                </span>
              </div>

              <div className="domain-tags">
                <span className="tag">Post-Quantum</span>
                <span className="tag">Blind Signatures</span>
                <span className="tag">OWASP Top 10</span>
                <span className="tag">CVE Analysis</span>
              </div>
            </motion.div>
          </div>

          {/* ============================================================
             DOMAIN 02: Network Security & Analysis (Inner Matrix Binary Flow)
             ============================================================ */}
          <div className="domain-card-wrapper">
            <motion.div
              className={`domain-card domain-card--network ${isCardActive(1) ? "domain-card--spotlight" : ""}`}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Matrix Digital Wallpaper Binary Flow Inside Card BG */}
              <div className="matrix-binary-wallpaper" aria-hidden="true">
                <div className="m-col col-1">1011010101</div>
                <div className="m-col col-2">0100110010</div>
                <div className="m-col col-3">1110001011</div>
                <div className="m-col col-4">0010110100</div>
              </div>

              {/* Live Sweeping Radar BG */}
              <div className="network-radar-bg" aria-hidden="true">
                <div className="radar-sweep" />
                <div className="radar-ring r1" />
                <div className="radar-ring r2" />
              </div>

              <div className="domain-card-header">
                <span className="domain-number">02</span>
                <span className="domain-badge-pill domain-badge-pill--green">Packet Radar</span>
              </div>

              <h3 className="domain-card-title">Network Security &amp; Analysis</h3>
              <p className="domain-card-desc">
                Packet inspection, intrusion detection systems, Wireshark packet capture analysis, and secure protocol configuration.
              </p>

              {/* Interactive Telemetry Box */}
              <div className="domain-interactive-box network-box">
                <span className="network-ping-dot" />
                <span className="network-telemetry">
                  PACKETS: <strong>{packetCount.toLocaleString()}</strong>/s · LATENCY: <strong>1.2ms</strong>
                </span>
              </div>

              <div className="domain-tags">
                <span className="tag">Wireshark</span>
                <span className="tag">Metasploit</span>
                <span className="tag">TLS 1.3</span>
                <span className="tag">PCAP Analysis</span>
              </div>
            </motion.div>
          </div>

          {/* ============================================================
             DOMAIN 03: Blockchain Architecture (Pop-Up & Pull-Back 3D Block)
             ============================================================ */}
          <div className="domain-card-wrapper">
            {/* Outer 3D Block Pop-Up & Pull-Back Animation */}
            <div className={`popup-block-anim ${isCardActive(2) ? "outer-anim-active" : ""}`} aria-hidden="true">
              <div className="popup-block-cube">
                <span className="block-cube-icon">❖</span>
                <span className="block-cube-text">BLOCK #284,910</span>
              </div>
            </div>

            <motion.div
              className={`domain-card domain-card--blockchain ${isCardActive(2) ? "domain-card--spotlight" : ""}`}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Floating Chain BG */}
              <div className="blockchain-chain-bg" aria-hidden="true">
                <div className="chain-link c1">⛓</div>
                <div className="chain-link c2">⛓</div>
                <div className="chain-link c3">⛓</div>
              </div>

              <div className="domain-card-header">
                <span className="domain-number">03</span>
                <span className="domain-badge-pill domain-badge-pill--amber">Consensus Engine</span>
              </div>

              <h3 className="domain-card-title">Blockchain Architecture</h3>
              <p className="domain-card-desc">
                Hyperledger Fabric, Private Data Collections, Byzantine fault tolerance, and verifiable e-voting protocol design.
              </p>

              {/* Interactive Block Hash Box */}
              <div className="domain-interactive-box blockchain-box">
                <span className="blockchain-icon">❖</span>
                <span className="blockchain-hash">
                  {isCardActive(2) ? "✓ BLOCK #284,910 CONFIRMED" : "HASH: 0x8f4a...e3b9"}
                </span>
              </div>

              <div className="domain-tags">
                <span className="tag">Hyperledger Fabric</span>
                <span className="tag">Go</span>
                <span className="tag">Docker</span>
                <span className="tag">Smart Contracts</span>
              </div>
            </motion.div>
          </div>

          {/* ============================================================
             DOMAIN 04: System Design & Full-Stack (Outer System Exchange Telemetry)
             ============================================================ */}
          <div className="domain-card-wrapper">
            {/* Outer Top System Telemetry & Server Node Animation */}
            <div className={`outer-system-exchange-anim ${isCardActive(3) ? "outer-anim-active" : ""}`} aria-hidden="true">
              <div className="sys-server-node">
                <span className="sys-node-pulse" />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                  <line x1="6" y1="6" x2="6.01" y2="6" />
                  <line x1="6" y1="18" x2="6.01" y2="18" />
                </svg>
                <span>API GATEWAY 200 OK</span>
              </div>
              <div className="sys-beam-badge">&uarr;&darr; 8ms LATENCY</div>
            </div>

            <motion.div
              className={`domain-card domain-card--system ${isCardActive(3) ? "domain-card--spotlight" : ""}`}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.3 }}
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Layer Stack Animation BG */}
              <div className="system-stack-bg" aria-hidden="true">
                <div className="stack-layer l1">UI LAYER</div>
                <div className="stack-layer l2">REST API GATEWAY</div>
                <div className="stack-layer l3">DATABASE CLUSTER</div>
              </div>

              <div className="domain-card-header">
                <span className="domain-number">04</span>
                <span className="domain-badge-pill domain-badge-pill--blue">Microservices</span>
              </div>

              <h3 className="domain-card-title">System Design &amp; Full-Stack</h3>
              <p className="domain-card-desc">
                Full-stack web application development with modern frameworks, REST API design, and containerized microservices.
              </p>

              {/* Interactive Terminal Box */}
              <div className="domain-interactive-box system-box">
                <span className="system-prompt">&gt;</span>
                <span className="system-route">GET /api/v1/health &rarr; 200 OK (8ms)</span>
              </div>

              <div className="domain-tags">
                <span className="tag">React</span>
                <span className="tag">Node.js</span>
                <span className="tag">Python / Flask</span>
                <span className="tag">REST API</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
