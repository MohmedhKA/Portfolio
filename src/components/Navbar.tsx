"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface NavbarProps {
  onContactClick?: () => void;
}

export default function Navbar({ onContactClick }: NavbarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  // Avoid hydration mismatch — icon only renders after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  function scrollTo(id: string) {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      
      // Add overlay fade-out class
      document.body.classList.add("page-transitioning");
      
      setTimeout(() => {
        // Jump to section while hidden
        document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
        
        // Short delay, then remove fade overlay to fade back in
        setTimeout(() => {
          document.body.classList.remove("page-transitioning");
        }, 50);
      }, 400); // Wait for the CSS opacity transition
    };
  }

  return (
    <header className="site-header">
      <div className="container nav">

        {/* Brand / logo */}
        <a href="#top" className="brand" aria-label="Go to top" onClick={scrollTo("top")}>
          <svg
            className="brand-mark"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M14 45C14 28 24 14 39 14C47 14 52 18 52 25C52 36 42 42 28 42H18"
              stroke="currentColor"
              strokeWidth="4.4"
              strokeLinecap="round"
            />
            <path
              d="M18 50L32 14"
              stroke="currentColor"
              strokeWidth="4.4"
              strokeLinecap="round"
            />
            <path
              d="M20 50H48"
              stroke="currentColor"
              strokeWidth="4.4"
              strokeLinecap="round"
            />
          </svg>
          <span>Mohmedh K A</span>
        </a>

        {/* Nav links — smooth scroll so SkillGraph fade plays naturally */}
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#work"     onClick={scrollTo("work")}>Work</a>
          <a href="#domains"  onClick={scrollTo("domains")}>Domains</a>
          <a href="#about"    onClick={scrollTo("about")}>About</a>
          <a href="#approach" onClick={scrollTo("approach")}>Approach</a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              if (onContactClick) {
                onContactClick();
              } else {
                scrollTo("contact")(e as React.MouseEvent<HTMLAnchorElement>);
              }
            }}
          >
            Contact
          </a>
        </nav>

        {/* Theme toggle */}
        <button
          id="theme-toggle"
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={
            mounted
              ? isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
              : "Toggle theme"
          }
        >
          {/* Only render icon after mount to match SSR output */}
          {mounted && (
            isDark ? (
              /* Sun — shown in dark mode */
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              /* Moon — shown in light mode */
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )
          )}
        </button>

      </div>
    </header>
  );
}
