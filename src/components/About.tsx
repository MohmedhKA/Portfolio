"use client";

import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" },
};

export default function About() {
  return (
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
  );
}
