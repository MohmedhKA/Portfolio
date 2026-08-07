"use client";

import { motion } from "framer-motion";

const RedditIcon = () => (
  <svg role="img" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-label="Reddit">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);

const GithubIcon = () => (
  <svg role="img" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-label="GitHub">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg role="img" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-label="LinkedIn">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg role="img" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-label="Twitter / X">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 5.676 5.45-5.676zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

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
              My focus is applied security — understanding how systems runs a software
              to the point of mnemonics code, see how it works, how it fails,
              what attackers exploit and how to build things that are honest
              about their threat model. I work across blockchain protocols,
              network analysis, and offensive security research.
            </p>
            <p>
              Based in Erode, India. Currently finishing my undergraduate
              degree while publishing research. If the
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
                Document assumptions and every cryptographic choice is a risk.
              </li>
              <li>
                <span>04</span>
                Break it by myself before someone else does.
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
                  <span className="ct-muted"> channel encrypted · AES-256-GCM</span>
                </p>
                <p className="ct-line ct-line--delay-3">
                  <span className="ct-ok">✓</span>
                  <span className="ct-muted"> boid flocking engine · active</span>
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
                <div className="ct-social-links">
                  <a href="https://github.com/MohmedhKA" target="_blank" rel="noopener noreferrer" className="ct-social-link" aria-label="GitHub">
                    <GithubIcon />
                  </a>
                  <a href="https://www.linkedin.com/in/mohmedh-k-a-9873242a6/" target="_blank" rel="noopener noreferrer" className="ct-social-link" aria-label="LinkedIn">
                    <LinkedinIcon />
                  </a>
                  <a href="https://twitter.com/MohmedhKA" target="_blank" rel="noopener noreferrer" className="ct-social-link" aria-label="Twitter / X">
                    <TwitterIcon />
                  </a>
                  <a href="https://reddit.com/user/Mohmedh_K_A" target="_blank" rel="noopener noreferrer" className="ct-social-link" aria-label="Reddit">
                    <RedditIcon />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
