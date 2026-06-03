"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/src/data/projects";

const fadeUp = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
};

export default function Work() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const card = e.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);
    },
    []
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const card = e.currentTarget as HTMLElement;
      card.style.setProperty("--mouse-x", "50%");
      card.style.setProperty("--mouse-y", "50%");
    },
    []
  );

  return (
    <section className="section" id="work">
      <div className="container">

        <motion.div
          className="section-head"
          {...fadeUp}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <div>
            <div className="eyebrow">Selected work</div>
            <h2 className="section-title">
              Security research, built end to end.
            </h2>
          </div>
          <p>
            A collection of projects across blockchain security, network
            defence, and applied cryptography — each built to solve a real
            problem, not to demonstrate a framework.
          </p>
        </motion.div>

        <div className="projects-grid">
          {projects.map((project) => (
            <motion.article
              key={project.title}
              className="project-card"
              data-expanded={expanded === project.title ? "true" : "false"}
              onClick={() =>
                setExpanded(
                  expanded === project.title ? null : project.title
                )
              }
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: "pointer" }}
              layout
              {...fadeUp}
              transition={{ layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }, duration: 0.6, ease: "easeOut" }}
            >
              {/* Visual area */}
              <div className="project-visual" aria-hidden="true">
                <div className="project-scanline" />

                {/* Terminal view — shown when showImage is false */}
                {!project.showImage && (
                  <div className="project-terminal">
                    <span className="pt-line pt-line--cmd">{`> init ${project.tags[0].toLowerCase().replace(/\s/g, '-')}`}</span>
                    <span className="pt-line pt-line--ok">✓ dependencies resolved</span>
                    <span className="pt-line pt-line--info">{`[${project.year}] ${project.tags.join(' · ')}`}</span>
                    <span className="pt-line pt-line--dim">running security audit...</span>
                    <span className="pt-line pt-line--cursor">█</span>
                  </div>
                )}

                {/* Image view — shown when showImage is true */}
                {project.showImage && project.image && (
                  <div className="project-image-wrap">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="project-image"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Fallback if showImage true but no image yet */}
                {project.showImage && !project.image && (
                  <div className="project-terminal">
                    <span className="pt-line pt-line--dim">image coming soon...</span>
                    <span className="pt-line pt-line--cursor">█</span>
                  </div>
                )}
              </div>

              {/* Always-visible info */}
              <div className="project-card-body">
                <div className="project-card-header">
                  <h3>{project.title}</h3>
                  <span className="project-year">{project.year}</span>
                </div>
                <p>{project.description}</p>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-github-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    View on GitHub
                  </a>
                )}
              </div>

              {/* Expanded-only info — AnimatePresence for smooth in/out */}
              <AnimatePresence>
                {expanded === project.title && (
                  <motion.div
                    className="project-card-expanded"
                    initial={{ opacity: 0, marginTop: 0 }}
                    animate={{ opacity: 1, marginTop: 0 }}
                    exit={{ opacity: 0, marginTop: "-0.5rem" }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    {project.role && (
                      <div className="project-expand-row">
                        <span className="project-expand-label">Role</span>
                        <span className="project-expand-value">{project.role}</span>
                      </div>
                    )}
                    {project.learned && (
                      <div className="project-expand-row">
                        <span className="project-expand-label">What I learned</span>
                        <span className="project-expand-value">{project.learned}</span>
                      </div>
                    )}
                    <div className="project-expand-hint">Click to collapse ↑</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
