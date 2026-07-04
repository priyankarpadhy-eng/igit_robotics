"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      style={{
        padding: scrolled ? '1rem 6%' : '1.5rem 6%',
        background: scrolled ? 'rgba(2, 6, 12, 0.9)' : 'rgba(2, 6, 12, 0)',
        borderBottom: scrolled ? '1px solid var(--card-border)' : '1px solid transparent'
      }}
    >
      <div className="nav-logo group cursor-pointer">
        <span className="text-white">AXIOM</span>
        <span className="text-neon ml-2">RC</span>
        <div className="h-[2px] w-0 group-hover:w-full bg-neon transition-all duration-300" />
      </div>

      <ul className="nav-links">
        {["Projects", "Game", "Team", "Contact"].map((l, i) => (
          <motion.li 
            key={l}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (i * 0.1) }}
          >
            <a href={`#${l.toLowerCase()}`} className="nav-link-v2">
              <span className="text-[10px] text-neon mr-2 font-bold">{`0${i+1}`}</span>
              {l}
            </a>
          </motion.li>
        ))}
      </ul>

      <motion.button 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="nav-cta"
      >
        INITIATE
      </motion.button>

      <style jsx>{`
        .nav-link-v2 {
          text-decoration: none;
          color: var(--muted);
          font-family: var(--font-orbitron);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: all 0.3s;
        }
        .nav-link-v2:hover {
          color: white;
          text-shadow: 0 0 10px var(--neon-dim);
        }
        .navbar {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </motion.nav>
  );
}
