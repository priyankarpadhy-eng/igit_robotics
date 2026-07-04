"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function DroneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const W = canvas.width = 480;
    const H = canvas.height = 450;

    function drawPropeller(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, angle: number, alpha: number) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(cx, cy);
      for (let i = 0; i < 2; i++) {
        ctx.save();
        ctx.rotate(angle + (i * Math.PI));
        const g = ctx.createLinearGradient(-r, 0, r, 0);
        g.addColorStop(0, "rgba(0,245,212,0.05)");
        g.addColorStop(0.5, "rgba(0,245,212,0.8)");
        g.addColorStop(1, "rgba(0,245,212,0.05)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#00f5d4";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#00f5d4";
      ctx.fill();
      ctx.restore();
    }

    function draw(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      
      const hover = Math.sin(t * 1.5) * 20;
      const tiltX = Math.sin(t * 0.8) * 0.12;
      const tiltY = Math.sin(t * 0.6) * 0.08;
      const cx = W / 2, cy = H / 2 - 30 + hover;

      const armLength = 100;
      const bodyH = 20;
      const bodyW = 55;

      // === SHADOW ===
      ctx.save();
      ctx.translate(W / 2, H - 70);
      const shadowScale = 0.6 + 0.15 * (1 - hover / 50);
      ctx.scale(shadowScale * 2, 0.3);
      const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, 100);
      sg.addColorStop(0, "rgba(0,245,212,0.15)");
      sg.addColorStop(1, "transparent");
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(0, 0, 100, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const arms = [
        { dx: -armLength, dy: -armLength * 0.4 },
        { dx: armLength, dy: -armLength * 0.4 },
        { dx: armLength, dy: armLength * 0.4 },
        { dx: -armLength, dy: armLength * 0.4 },
      ];

      const tiltTransform = (dx: number, dy: number) => {
        return {
          x: cx + dx - dy * tiltY * 0.4,
          y: cy + dy * (1 - Math.abs(tiltX) * 0.2) + dx * tiltX * 0.3
        };
      };

      // Arms drawing
      arms.forEach((arm, i) => {
        const tip = tiltTransform(arm.dx, arm.dy);
        const bodyEnd = tiltTransform(arm.dx * 0.3, arm.dy * 0.3);
        
        ctx.save();
        const armG = ctx.createLinearGradient(bodyEnd.x, bodyEnd.y, tip.x, tip.y);
        armG.addColorStop(0, "#0a1628");
        armG.addColorStop(1, "#1a2a44");
        ctx.strokeStyle = armG;
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(bodyEnd.x, bodyEnd.y);
        ctx.lineTo(tip.x, tip.y);
        ctx.stroke();

        ctx.strokeStyle = "rgba(0,245,212,0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Pods
        ctx.save();
        ctx.translate(tip.x, tip.y);
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        const podG = ctx.createRadialGradient(-3, -3, 0, 0, 0, 12);
        podG.addColorStop(0, "#00f5d4");
        podG.addColorStop(0.5, "#0077b6");
        podG.addColorStop(1, "#020811");
        ctx.fillStyle = podG;
        ctx.fill();
        ctx.restore();

        const propAngle = t * (i % 2 === 0 ? 20 : -20);
        drawPropeller(ctx, tip.x, tip.y - 8, 45, propAngle, 0.9);
      });

      // === BODY ===
      ctx.save();
      ctx.translate(cx, cy);
      
      // Main Chassis
      ctx.beginPath();
      ctx.ellipse(0, 0, bodyW, bodyH, 0, 0, Math.PI * 2);
      const bodyG = ctx.createLinearGradient(-bodyW, -bodyH, bodyW, bodyH);
      bodyG.addColorStop(0, "#0f1f3d");
      bodyG.addColorStop(0.5, "#071224");
      bodyG.addColorStop(1, "#020811");
      ctx.fillStyle = bodyG;
      ctx.fill();
      ctx.strokeStyle = "rgba(0,245,212,0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Top Deck
      ctx.beginPath();
      ctx.ellipse(0, -10, bodyW * 0.8, bodyH * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,245,212,0.1)";
      ctx.fill();
      ctx.strokeStyle = "rgba(0,245,212,0.8)";
      ctx.stroke();

      // Lens/EYE
      ctx.beginPath();
      ctx.arc(0, 5, 12, 0, Math.PI * 2);
      const eyeG = ctx.createRadialGradient(-4, -4, 2, 0, 0, 12);
      eyeG.addColorStop(0, "#fff");
      eyeG.addColorStop(0.2, "#00f5d4");
      eyeG.addColorStop(1, "#001219");
      ctx.fillStyle = eyeG;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#00f5d4";
      ctx.fill();

      ctx.restore();

      // Atmospheric artifacts
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for(let i=0; i<3; i++) {
        const off = Math.sin(t + i) * 10;
        ctx.beginPath();
        ctx.arc(cx + off, cy + off, 60 + i*20, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(0, 245, 212, ${0.05 - i*0.01})`;
        ctx.stroke();
      }
      ctx.restore();
    }

    const loop = () => {
      timeRef.current += 0.016;
      draw(timeRef.current);
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="relative"
    >
      <canvas 
        ref={canvasRef} 
        className="drone-canvas" 
        style={{ 
          filter: "drop-shadow(0 0 30px rgba(0, 245, 212, 0.2))",
          mixBlendMode: "lighten"
        }} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
}
