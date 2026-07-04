import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-logo t-h3" style={{ fontStyle: 'normal', fontWeight: 700, letterSpacing: '0.05em' }}>
        ORYZO AI
      </div>

      <div className="nav-links">
        {['Intro', 'Features', 'Product', 'Contact'].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="nav-link t-label">
            {item}
            <span className="link-underline" />
          </a>
        ))}
      </div>

      <div className="nav-cta">
        <button className="btn-pill t-label">Order Now</button>
      </div>

      <style>{`
        .nav {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 1000;
          padding: 1.5rem clamp(1.5rem, 5vw, 6rem);
          display: flex; align-items: center; justify-content: space-between;
          transition: background 0.5s, border-color 0.5s;
        }
        .nav.scrolled {
          background: rgba(15,14,13,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .nav-links {
          display: flex; gap: 2.5rem;
        }
        .nav-link {
          position: relative;
          color: var(--text-muted);
          transition: color 0.3s;
          text-decoration: none;
        }
        .nav-link:hover {
          color: var(--text-primary);
        }
        .link-underline {
          position: absolute; bottom: -4px; left: 0;
          width: 100%; height: 1px;
          background: var(--text-primary);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-link:hover .link-underline {
          transform: scaleX(1);
        }
        .btn-pill {
          padding: 0.8rem 1.8rem;
          border-radius: 100px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-primary);
          cursor: none;
          transition: border-color 0.3s, background 0.3s;
        }
        .btn-pill:hover {
          background: var(--text-primary);
          color: var(--bg);
          border-color: var(--text-primary);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
