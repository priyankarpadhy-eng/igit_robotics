"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="footer relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-card-border to-transparent" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center"
      >
        <div className="footer-logo font-orbitron">AXIOM RC</div>
        <div className="footer-copy mt-4">TERMINAL 01 // INDIRA GANDHI INSTITUTE OF TECHNOLOGY</div>
        <div className="mt-2 text-[10px] text-muted opacity-50 uppercase tracking-[5px]">Sarang, Odisha // Established 2019</div>

        <div className="footer-links mt-12">
          {["GitHub", "Discord", "Instagram", "Research"].map((l, i) => (
            <a key={l} href="#" className="hover:text-neon transition-colors duration-300">
              <span className="text-[8px] text-neon mr-1">[{`0${i+1}`}]</span>
              {l}
            </a>
          ))}
        </div>

        <div className="mt-16 pb-8 text-[9px] text-muted tracking-widest">
           © {new Date().getFullYear()} // ALL RIGHTS RESERVED // AXIOM ROBOTICS UNIT
        </div>
      </motion.div>

      {/* Decorative lines */}
      <div className="absolute bottom-0 right-0 p-8 opacity-10 font-orbitron text-8xl pointer-events-none select-none">
        RC-04
      </div>
    </footer>
  );
}
