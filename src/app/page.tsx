"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import DroneCanvas from "@/components/DroneCanvas";
import RobocarGame from "@/components/RobocarGame";
import BackgroundEffect from "@/components/BackgroundEffect";
import { Cpu, Rocket, Shield, Activity, ArrowRight, Zap, Target, Globe } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const TEAM = [
  { name: "Anya Sharma", role: "Software Architect", bio: "Leading our autonomy stack with ROS2 and C++. Former intern at Boston Dynamics.", color: "#00f5d4", icon: <Cpu /> },
  { name: "Ravi Mehta", role: "Hardware Lead", bio: "Hardware design expert. Specializes in custom PCB routing and motor controllers.", color: "#7c3aed", icon: <Rocket /> },
  { name: "Priya Nair", role: "AI Engineer", bio: "Implementing SLAM and deep reinforcement learning for multi-agent swarm systems.", color: "#ff6b35", icon: <Shield /> },
  { name: "Dev Gupta", role: "Product Manager", bio: "Bridging the gap between code and reality. Coordinating operations for national trials.", color: "#0077b6", icon: <Activity /> },
];

const PROJECTS = [
  { tag: "Autonomous", name: "TITAN-VX Rover", desc: "Our 2024 flagship UGV. Features Level 4 autonomy on rugged terrain using multi-sensor fusion.", tech: ["LiDAR", "PyTorch", "ROS2"], bg: "rgba(0, 245, 212, 0.05)", icon: <Target className="text-neon" /> },
  { tag: "Swarm Intelligence", name: "HIVE-X Network", desc: "Distributed communication protocol for multi-bot coordination without a central server.", tech: ["Rust", "ZeroMQ", "P2P"], bg: "rgba(124, 58, 237, 0.05)", icon: <Globe className="text-neon3" /> },
  { tag: "Aerial Systems", name: "APEX DRONE", desc: "High-speed FPV drone equipped with AI for tracking and intercepting high-velocity targets.", tech: ["OpenCV", "PX4", "C++"], bg: "rgba(255, 107, 53, 0.05)", icon: <Zap className="text-neon2" /> },
];

export default function Home() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useGSAP(() => {
    // Title split animation
    const words = titleRef.current?.querySelectorAll(".word");
    if (words) {
      gsap.from(words, {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.5
      });
    }

    // Floating animation for drone
    gsap.to(".drone-float", {
      y: 30,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

  }, { scope: heroRef });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="main-wrapper">
      <BackgroundEffect />

      {/* HERO SECTION */}
      <section className="hero-v2" ref={heroRef} style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="hero-content-box">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <span className="hero-tagline">// PIONEERING AUTONOMOUS HARDWARE</span>
            </motion.div>
            
            <h1 className="hero-title-v2 font-orbitron" ref={titleRef}>
              <span className="block overflow-hidden"><span className="word inline-block">ENGINEER</span></span>
              <span className="block overflow-hidden"><span className="word inline-block text-neon">THE FUTURE</span></span>
              <span className="block overflow-hidden"><span className="word inline-block">OF AI MACHINES</span></span>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-6 text-xl text-muted max-w-lg"
            >
              Building high-fidelity robots that see, think, and act. Axiom Robotics is where theoretical AI meets rugged engineering.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-10 flex gap-6"
            >
              <button className="btn-primary flex items-center gap-2">
                CORE PROJECTS <ArrowRight size={18} />
              </button>
              <button className="btn-secondary">JOIN THE MISSION</button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="drone-float-wrap flex justify-center items-center"
          >
            <div className="drone-float">
               <DroneCanvas />
            </div>
            <div className="absolute -z-10 w-[500px] h-[500px] bg-neon-glow rounded-full blur-[120px]" />
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-[10px] uppercase font-bold tracking-[4px] text-muted">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-neon to-transparent" />
        </motion.div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="section bg-dark2/50 relative overflow-hidden" id="projects">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
             <div className="section-tag">PROJECT PORTFOLIO</div>
             <h2 className="section-title heading">Next-Gen <span className="text-neon">Builds</span></h2>
             
             <div className="projects-grid mt-12">
               {PROJECTS.map((project, idx) => (
                 <motion.div key={idx} variants={itemVariants} className="project-card-v2 group">
                   <div className="relative overflow-hidden aspect-video bg-black/40 rounded-t-2xl flex items-center justify-center p-8">
                     <div className="w-24 h-24 rounded-2xl bg-white/5 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
                        {project.icon}
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-t from-dark2 to-transparent opacity-60" />
                   </div>
                   <div className="p-8 bg-card-bg border-x border-b border-card-border rounded-b-2xl">
                     <span className="project-tag-v2">{project.tag}</span>
                     <h3 className="project-name-v2 font-orbitron mt-4">{project.name}</h3>
                     <p className="text-muted mt-3 text-sm leading-relaxed">{project.desc}</p>
                     <div className="mt-6 flex flex-wrap gap-2">
                       {project.tech.map(t => <span key={t} className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-muted border border-white/5 uppercase tracking-wider">{t}</span>)}
                     </div>
                   </div>
                 </motion.div>
               ))}
             </div>
          </motion.div>
        </div>
      </section>

      {/* GAME SECTION */}
      <section className="section" id="game">
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
        >
          <RobocarGame />
        </motion.div>
      </section>

      {/* TEAM SECTION */}
      <section className="section bg-dark3/30" id="team">
        <div className="container mx-auto px-6">
          <div className="section-tag">CORE UNIT</div>
          <h2 className="section-title heading text-center lg:text-left">The <span className="text-neon">Engineers</span></h2>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
          >
            {TEAM.map((member, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="member-card-v2 group"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-dark border-2 border-card-border flex items-center justify-center text-3xl group-hover:border-neon transition-colors duration-300" style={{ color: member.color }}>
                    {member.icon}
                  </div>
                  <div className="absolute -inset-2 rounded-2xl border border-neon/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110" />
                </div>
                <h4 className="font-orbitron text-center text-lg">{member.name}</h4>
                <p className="text-center text-xs font-bold uppercase tracking-widest mt-1 mb-4" style={{ color: member.color }}>{member.role}</p>
                <p className="text-center text-muted text-sm px-2 opacity-80">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="section relative overflow-hidden" id="contact">
        <div className="absolute inset-0 bg-neon/5 -z-10" />
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-6xl font-orbitron font-black leading-tight">READY TO <span className="text-neon">JOIN THE UNIT?</span></h2>
            <p className="text-muted mt-6 text-lg">We are looking for creators, designers, and engineers who aren't afraid of complex problems.</p>
            
            <div className="mt-12 p-1 bg-card-border rounded-3xl backdrop-blur-xl">
              <div className="bg-dark2 rounded-[22px] p-8 lg:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <input className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-neon transition-colors" placeholder="YOUR NAME" />
                   <input className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-neon transition-colors" placeholder="EMAIL ADDRESS" />
                </div>
                <textarea rows={4} className="w-full mt-6 bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-neon transition-colors" placeholder="YOUR MESSAGE / SKILLS" />
                <button 
                  onClick={() => setIsSubmitting(true)}
                  className="w-full mt-8 btn-primary text-xl"
                >
                  {isSubmitting ? "TRANSMITTING..." : "SEND APPLICATION"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .hero-title-v2 {
          font-size: clamp(3rem, 8vw, 6rem);
          line-height: 1.1;
          font-weight: 900;
        }
        .hero-tagline {
          font-size: 0.9rem;
          font-weight: 800;
          letter-spacing: 4px;
          color: var(--neon);
        }
        .project-card-v2, .member-card-v2 {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .project-tag-v2 {
          font-size: 0.6rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--neon);
          background: rgba(0, 245, 212, 0.1);
          padding: 4px 12px;
          border-radius: 4px;
        }
        .btn-primary {
          background: var(--neon);
          color: black;
          padding: 1rem 2rem;
          font-weight: 900;
          letter-spacing: 1px;
          clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0% 30%);
        }
        .btn-secondary {
          border: 1px solid var(--neon);
          color: var(--neon);
          padding: 1rem 2rem;
          font-weight: 900;
          letter-spacing: 1px;
          clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0% 30%);
        }
      `}</style>
    </div>
  );
}
