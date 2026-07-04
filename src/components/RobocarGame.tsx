"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GAME_W = 680, GAME_H = 420;
const CAR_W = 50, CAR_H = 28;
const OBSTACLE_TYPES = [
  { w: 35, h: 35, color: "#ff6b35", label: "⬡", score: 10 },
  { w: 50, h: 25, color: "#7c3aed", label: "▬", score: 15 },
  { w: 30, h: 50, color: "#00b4d8", label: "▮", score: 20 },
];

export default function RobocarGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const stateRef = useRef({
    car: { x: 120, y: GAME_H / 2, vx: 0, vy: 0, angle: 0, turbo: false },
    obstacles: [] as any[],
    bullets: [] as any[],
    particles: [] as any[],
    score: 0,
    distance: 0,
    speed: 4,
    level: 1,
    hp: 3,
    running: false,
    gameOver: false,
    shake: 0,
  });
  
  const keysRef = useRef<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [ui, setUi] = useState({ score: 0, distance: 0, hp: 3, level: 1, running: false, gameOver: false });
  const [showOverlay, setShowOverlay] = useState(true);

  const startGame = () => {
    stateRef.current = {
      car: { x: 120, y: GAME_H / 2, vx: 0, vy: 0, angle: 0, turbo: false },
      obstacles: [],
      bullets: [],
      particles: [],
      score: 0,
      distance: 0,
      speed: 4,
      level: 1,
      hp: 3,
      running: true,
      gameOver: false,
      shake: 0,
    };
    setShowOverlay(false);
    setUi({ ...stateRef.current });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      keysRef.current[e.key] = down;
      if (down && ["ArrowUp", "ArrowDown", " ", "Shift"].includes(e.key)) e.preventDefault();
    };
    window.addEventListener("keydown", (e) => onKey(e, true));
    window.addEventListener("keyup", (e) => onKey(e, false));
    return () => {
      window.removeEventListener("keydown", (e) => onKey(e, true));
      window.removeEventListener("keyup", (e) => onKey(e, false));
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastSpawn = 0;
    let lastFire = 0;
    let t = 0;

    function spawnParticles(x: number, y: number, color: string, n = 10) {
      for (let i = 0; i < n; i++) {
        stateRef.current.particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          life: 1,
          color,
          r: 2 + Math.random() * 4
        });
      }
    }

    function draw(dt: number) {
      const s = stateRef.current;
      t += dt;
      
      // Update logic
      if (s.running) {
        const k = keysRef.current;
        s.car.turbo = k["Shift"] || false;
        const spd = s.car.turbo ? 7 : 4.5;
        
        if (k["ArrowUp"] || k["w"]) s.car.vy -= spd;
        if (k["ArrowDown"] || k["s"]) s.car.vy += spd;
        s.car.vy *= 0.85;
        s.car.y += s.car.vy;
        s.car.y = Math.max(50 + CAR_H / 2, Math.min(GAME_H - 50 - CAR_H / 2, s.car.y));
        s.car.angle = s.car.vy * 0.03;

        // Fire
        if ((k[" "] || k["f"]) && t - lastFire > 0.15) {
          s.bullets.push({ x: s.car.x + 30, y: s.car.y, vx: 18 });
          lastFire = t;
        }

        // Spawn
        s.speed += dt * 0.05;
        s.distance += s.speed * dt * 5;
        s.level = Math.floor(s.distance / 500) + 1;
        
        if (t - lastSpawn > Math.max(0.6, 2 - s.level * 0.15)) {
          const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
          s.obstacles.push({
            x: GAME_W + 50,
            y: 70 + Math.random() * (GAME_H - 140),
            ...type,
            vx: -s.speed - Math.random() * 2
          });
          lastSpawn = t;
        }

        // Processing
        s.bullets = s.bullets.filter(b => {
          b.x += b.vx;
          return b.x < GAME_W + 50;
        });

        s.obstacles = s.obstacles.filter(o => {
          o.x += o.vx;
          // Collision with bullet
          s.bullets = s.bullets.filter(b => {
            const h = Math.hypot(b.x - o.x, b.y - o.y);
            if (h < o.w) {
              spawnParticles(o.x, o.y, o.color);
              s.score += o.score;
              o.dead = true;
              return false;
            }
            return true;
          });

          // Collision with car
          if (!o.dead && Math.abs(s.car.x - o.x) < 40 && Math.abs(s.car.y - o.y) < 30) {
             s.hp--;
             s.shake = 15;
             spawnParticles(s.car.x, s.car.y, "#ff0000", 20);
             if (s.hp <= 0) { s.running = false; s.gameOver = true; }
             return false;
          }
          return !o.dead && o.x > -100;
        });

        s.particles = s.particles.filter(p => {
          p.x += p.vx; p.y += p.vy; p.life -= 0.04;
          return p.life > 0;
        });

        if (s.shake > 0) s.shake *= 0.9;
        
        if (Math.floor(t * 10) % 10 === 0) setUi({ ...s });
      }

      // Render logic
      ctx.fillStyle = "#02060c";
      ctx.fillRect(0, 0, GAME_W, GAME_H);

      ctx.save();
      if (s.shake > 1) ctx.translate((Math.random() - 0.5) * s.shake, (Math.random() - 0.5) * s.shake);

      // Grid
      ctx.strokeStyle = "rgba(0, 245, 212, 0.05)";
      const gridOff = (t * 120) % 60;
      for (let x = -gridOff; x < GAME_W; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, GAME_H); ctx.stroke();
      }
      for (let y = 0; y < GAME_H; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(GAME_W, y); ctx.stroke();
      }

      // Road
      ctx.strokeStyle = "rgba(0, 245, 212, 0.2)";
      ctx.lineWidth = 3;
      ctx.setLineDash([30, 20]);
      ctx.lineDashOffset = -(t * 200) % 50;
      ctx.beginPath(); ctx.moveTo(0, 40); ctx.lineTo(GAME_W, 40); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, GAME_H - 40); ctx.lineTo(GAME_W, GAME_H - 40); ctx.stroke();
      ctx.setLineDash([]);

      // Bullets
      s.bullets.forEach(b => {
        ctx.fillStyle = "#00f5d4";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#00f5d4";
        ctx.fillRect(b.x, b.y - 2, 20, 4);
      });

      // Car
      ctx.save();
      ctx.translate(s.car.x, s.car.y);
      ctx.rotate(s.car.angle);
      ctx.fillStyle = "#0a1628";
      ctx.strokeStyle = "#00f5d4";
      ctx.lineWidth = 2;
      ctx.beginPath();
      // @ts-ignore
      ctx.roundRect ? ctx.roundRect(-CAR_W/2, -CAR_H/2, CAR_W, CAR_H, 8) : ctx.rect(-CAR_W/2, -CAR_H/2, CAR_W, CAR_H);
      ctx.fill();
      ctx.stroke();
      // Exhaust
      if (s.car.turbo) {
        ctx.fillStyle = "rgba(0, 245, 212, 0.6)";
        ctx.beginPath(); ctx.arc(-30, 0, 10, 0, Math.PI*2); ctx.fill();
      }
      ctx.restore();

      // Obstacles
      s.obstacles.forEach(o => {
        ctx.fillStyle = o.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = o.color;
        ctx.beginPath();
        // @ts-ignore
        ctx.roundRect ? ctx.roundRect(o.x - o.w/2, o.y - o.h/2, o.w, o.h, 6) : ctx.rect(o.x - o.w/2, o.y - o.h/2, o.w, o.h);
        ctx.fill();
      });

      // Particles
      s.particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
      });

      ctx.restore();
    }

    let lastTime = 0;
    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      draw(dt > 0.1 ? 0.016 : dt);
      requestRef.current = requestAnimationFrame(loop);
    };
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div className="game-section-v2" ref={containerRef}>
      <div className="max-w-6xl mx-auto">
        <div className="section-tag">// APEX SIMULATOR</div>
        <h2 className="section-title heading">NEURAL <span className="text-neon">DRIVE</span></h2>
        
        <div className="game-main-box mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden border border-card-border bg-black shadow-2xl">
            <canvas ref={canvasRef} width={GAME_W} height={GAME_H} className="w-full h-auto cursor-none" />
            <AnimatePresence>
              {showOverlay && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20"
                >
                   <motion.div 
                     initial={{ scale: 0.8 }}
                     animate={{ scale: 1 }}
                     className="text-center"
                   >
                     <h3 className="font-orbitron font-black text-6xl text-white mb-2">
                       {ui.gameOver ? "UNIT DESTROYED" : "INITIATE"}
                     </h3>
                     <p className="text-muted tracking-[10px] uppercase font-bold mb-10">Simulation Protocol v2.4</p>
                     <button onClick={startGame} className="btn-primary px-12 py-4">ENTER STREAM</button>
                   </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="stat-card-v3">
                <div className="stat-label">SCORE</div>
                <div className="stat-value">{ui.score}</div>
              </div>
              <div className="stat-card-v3">
                <div className="stat-label">LEVEL</div>
                <div className="stat-value">{ui.level}</div>
              </div>
            </div>
            
            <div className="stat-card-v3 col-span-2">
               <div className="stat-label">HULL INTEGRITY</div>
               <div className="mt-4 flex gap-3">
                 {[1,2,3].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ opacity: i <= ui.hp ? 1 : 0.2, scale: i <= ui.hp ? 1 : 0.9 }}
                      className="h-3 flex-1 rounded-full bg-neon shadow-neon"
                      style={{ filter: i <= ui.hp ? "none" : "grayscale(1)" }}
                    />
                 ))}
               </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
               <div className="text-[10px] font-black tracking-widest text-muted mb-4">COMMANDS</div>
               <div className="flex flex-col gap-3">
                 <div className="flex justify-between items-center text-xs font-bold">
                   <span className="text-muted">VERTICAL DRIVE</span>
                   <span className="px-2 py-1 bg-white/10 rounded uppercase">W / S / ARROWS</span>
                 </div>
                 <div className="flex justify-between items-center text-xs font-bold">
                   <span className="text-muted">PLASMA STREAM</span>
                   <span className="px-2 py-1 bg-white/10 rounded uppercase">SPACE / F</span>
                 </div>
                 <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-muted">AUX OVERDRIVE</span>
                    <span className="px-2 py-1 bg-white/10 rounded uppercase">L-SHIFT</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stat-card-v3 {
          padding: 1.5rem;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .stat-label {
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 2px;
          color: var(--muted);
        }
        .stat-value {
          font-family: var(--font-orbitron);
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          line-height: 1;
          margin-top: 5px;
        }
        .shadow-neon {
          box-shadow: 0 0 15px var(--neon);
        }
      `}</style>
    </div>
  );
}
