"use client";

import { motion } from "framer-motion";
import { projects } from "@/src/data/projects";

const fadeUp = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

export default function Work() {
  return (
    <section className="section" id="work">
      <div className="container">

        <motion.div className="section-head" {...fadeUp}>
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
              {...fadeUp}
            >
              <div className="project-visual" aria-hidden="true">
                <div className="tag-row">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="project-lines">
                  <span /><span /><span />
                </div>
              </div>
              <div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
