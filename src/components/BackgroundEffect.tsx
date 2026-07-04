"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BackgroundEffect() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-fixed">
      <div className="grid-bg" />
      
      {/* Ambient Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{
          position: "fixed",
          top: "10%",
          left: "5%",
          width: "40vw",
          height: "40vw",
          background: "radial-gradient(circle, var(--neon-dim) 0%, transparent 70%)",
          filter: "blur(80px)",
          zIndex: -1
        }}
      />
      
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
          x: [0, -40, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{
          position: "fixed",
          bottom: "10%",
          right: "5%",
          width: "35vw",
          height: "35vw",
          background: "radial-gradient(circle, var(--neon3) 0%, transparent 70%)",
          filter: "blur(100px)",
          opacity: 0.2,
          zIndex: -1
        }}
      />

      {/* Floating Particles - Only render on client to avoid Math.random() hydration issues */}
      {mounted && [...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-10, -100],
            opacity: [0, 0.5, 0],
            x: Math.random() * 20 - 10
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 0.1,
            ease: "easeOut"
          }}
          style={{
            position: "fixed",
            left: `${Math.random() * 100}%`,
            bottom: "0%",
            width: "2px",
            height: "40px",
            background: "linear-gradient(to top, var(--neon), transparent)",
            zIndex: -1
          }}
        />
      ))}
    </div>
  );
}
