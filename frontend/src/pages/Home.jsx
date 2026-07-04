import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { Link } from 'react-router-dom';
import igitCampus from "../assets/igit_campus.png";
import * as THREE from 'three';
import { Mail } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import { eventsService, galleryService, membersService, defaultEvents, defaultGallery, defaultMembers } from '../services/dbService';

gsap.registerPlugin(ScrollTrigger);

// --- ANIMATION UTILS ---
const useMagnetic = (ref) => {
  useGSAP(() => {
    if (!ref || !ref.current) return;
    const element = ref.current;
    
    const xTo = gsap.quickTo(element, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' });
    const yTo = gsap.quickTo(element, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' });

    const mouseMove = (e) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = element.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x * 0.35);
      yTo(y * 0.35);
    };

    const mouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener('mousemove', mouseMove);
    element.addEventListener('mouseleave', mouseLeave);
    return () => {
      element.removeEventListener('mousemove', mouseMove);
      element.removeEventListener('mouseleave', mouseLeave);
    };
  }, { scope: ref });
};

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'none'
      });
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div ref={cursorRef} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '20px',
      height: '20px',
      backgroundColor: 'black',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: 9999,
      mixBlendMode: 'difference',
      transform: 'translate(-50%, -50%)'
    }} />
  );
};

// --- UI COMPONENTS ---
const Navbar = () => {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      pointerEvents: 'none',
    }}>
      {/* Left side: Logo in a floating card */}
      <div style={{
        position: 'absolute',
        top: '24px',
        left: '2rem',
        background: 'rgba(255, 255, 255, 0.4)',
        borderRadius: '32px',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '4px 4px 20px rgba(0,0,0,0.1)',
        pointerEvents: 'auto',
        cursor: 'pointer',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(0, 0, 0, 0.12)'
      }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <img src="/club-logo.png" alt="IGIT Robotics Logo" style={{ height: '72px' }} />
      </div>

      {/* Right side: Links and buttons in a separate thinner card */}
      <div style={{
        position: 'absolute',
        top: '24px',
        right: '2rem',
        background: 'rgba(255, 255, 255, 0.4)',
        borderRadius: '50px',
        padding: '0.25rem 0.75rem 0.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        pointerEvents: 'auto',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', gap: '2rem', fontWeight: 600, fontSize: '0.95rem' }}>
          <a href="#gallery" onClick={(e) => { e.preventDefault(); document.querySelector('#gallery').scrollIntoView({ behavior: 'smooth' }); }} style={{ color: '#475569', textDecoration: 'none' }}>Gallery</a>
          <a href="#team" onClick={(e) => { e.preventDefault(); document.querySelector('#team').scrollIntoView({ behavior: 'smooth' }); }} style={{ color: '#475569', textDecoration: 'none' }}>Team</a>
          <a href="#workshops" onClick={(e) => { e.preventDefault(); document.querySelector('#workshops').scrollIntoView({ behavior: 'smooth' }); }} style={{ color: '#475569', textDecoration: 'none' }}>Workshops</a>
          <a href="#achievements" onClick={(e) => { e.preventDefault(); document.querySelector('#achievements').scrollIntoView({ behavior: 'smooth' }); }} style={{ color: '#475569', textDecoration: 'none' }}>Achievements</a>
        </div>
        
        <div style={{ width: '1px', height: '20px', background: '#e2e8f0' }} />
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="https://www.instagram.com/igit_robotics" target="_blank" rel="noreferrer" style={{
            color: '#0f172a',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: '0.95rem'
          }}>Instagram</a>
          <button style={{ background: '#0f172a', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '50px', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'transform 0.1s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>Join Us</button>
        </div>
      </div>
    </nav>
  );
};


const Hero = () => {
  const heroRef = useRef(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    let activeVanta = null;
    let threeScript = null;
    let vantaScript = null;

    const loadScriptsAndInit = () => {
      // 1. Load Three.js r134 if not already present
      if (!window.THREE) {
        threeScript = document.createElement('script');
        threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
        threeScript.async = true;
        threeScript.onload = () => {
          loadVantaScript();
        };
        threeScript.onerror = () => console.error("Failed to load Three.js from CDN");
        document.body.appendChild(threeScript);
      } else {
        loadVantaScript();
      }
    };

    const loadVantaScript = () => {
      // 2. Load Vanta Clouds if not already present
      if (!window.VANTA || !window.VANTA.CLOUDS) {
        vantaScript = document.createElement('script');
        vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.clouds.min.js';
        vantaScript.async = true;
        vantaScript.onload = () => {
          initializeVanta();
        };
        vantaScript.onerror = () => console.error("Failed to load Vanta Clouds from CDN");
        document.body.appendChild(vantaScript);
      } else {
        initializeVanta();
      }
    };

    const initializeVanta = () => {
      if (heroRef.current && window.VANTA && window.VANTA.CLOUDS) {
        try {
          activeVanta = window.VANTA.CLOUDS({
            el: heroRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            backgroundColor: 0xffffff,
            skyColor: 0x68b8d7,
            cloudColor: 0xadc1de,
            cloudShadowColor: 0x183550,
            sunColor: 0xff9919,
            sunGlareColor: 0xff6633,
            sunlightColor: 0xff9933,
            speed: 1.0,
          });
          vantaRef.current = activeVanta;
        } catch (e) {
          console.error("Error initializing Vanta Clouds:", e);
        }
      }
    };

    loadScriptsAndInit();

    return () => {
      if (activeVanta) {
        activeVanta.destroy();
      }
    };
  }, []);

  useGSAP(() => {
    // Animate the text lines sliding up inside their overflow-hidden wrappers
    gsap.from('.hero-line span', {
      y: '105%',
      duration: 1.4,
      stagger: 0.18,
      ease: 'power4.out',
      delay: 0.4
    });

    // Fade in the scroll indicator with a slight slide up
    gsap.from('.scroll-indicator', {
      opacity: 0,
      y: 25,
      duration: 1.2,
      ease: 'power3.out',
      delay: 1.6
    });
  }, { scope: heroRef });

  return (
    <section ref={heroRef} style={{ padding: '0', textAlign: 'center', position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes scroll-wheel {
          0% { opacity: 1; transform: translateY(0); }
          30% { opacity: 1; }
          100% { opacity: 0; transform: translateY(18px); }
        }
      `}</style>
      
      <div className="container" style={{ position: 'relative', zIndex: 2, padding: '0 24px', maxWidth: '1400px' }}>
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 6.2vw, 6.8rem)', 
          fontWeight: 900, 
          lineHeight: 1.05, 
          color: '#111111', 
          textTransform: 'uppercase', 
          letterSpacing: '-0.03em', 
          fontFamily: "'Outfit', sans-serif",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.1em'
        }}>
          <div className="hero-line" style={{ overflow: 'hidden', width: '100%' }}>
            <span style={{ display: 'block' }}>Indira Gandhi</span>
          </div>
          <div className="hero-line" style={{ overflow: 'hidden', width: '100%' }}>
            <span style={{ display: 'block' }}>Institute of</span>
          </div>
          <div className="hero-line" style={{ overflow: 'hidden', width: '100%' }}>
            <span style={{ display: 'block' }}>Technology,</span>
          </div>
          <div className="hero-line" style={{ overflow: 'hidden', width: '100%', marginTop: '0.15em' }}>
            <span style={{ 
              display: 'block',
              color: '#0a6175', 
              textTransform: 'lowercase',
              fontStyle: 'italic',
              fontWeight: 800,
              fontSize: 'clamp(2.2rem, 5.6vw, 6.2rem)',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 20px rgba(255,255,255,0.5)'
            }}>
              sarang.
            </span>
          </div>
        </h1>
      </div>

      {/* Animated Scroll Symbol */}
      <div className="scroll-indicator" style={{
        position: 'absolute',
        bottom: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        zIndex: 2
      }} onClick={() => {
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      }}>
        <div style={{
          width: '30px',
          height: '50px',
          borderRadius: '16px',
          border: '3px solid #111',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '8px',
          backgroundColor: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '6px',
            height: '10px',
            borderRadius: '3px',
            backgroundColor: '#111',
            animation: 'scroll-wheel 1.6s cubic-bezier(0.25, 1, 0.5, 1) infinite'
          }} />
        </div>
        <span style={{ 
          fontSize: '0.75rem', 
          fontWeight: 800, 
          letterSpacing: '0.2em', 
          textTransform: 'uppercase', 
          color: '#111',
          textShadow: '0 1px 4px rgba(255,255,255,0.8)'
        }}>
          Scroll Down
        </span>
      </div>
    </section>
  );
};

const Ticker = () => {
  const tickerRef = useRef(null);

  useGSAP(() => {
    const anim = gsap.to(tickerRef.current, {
      xPercent: -50,
      repeat: -1,
      duration: 35,
      ease: 'none'
    });

    ScrollTrigger.create({
      onUpdate: (self) => {
        const vel = Math.abs(self.getVelocity() / 1500);
        const timeScale = gsap.utils.clamp(1, 3, 1 + vel * 0.8);
        gsap.to(anim, { timeScale, duration: 0.5 });
      }
    });
  });

  const companies = [
    'GOOGLE', 'MICROSOFT', 'AMAZON', 'TATA MOTORS', 'TCS', 'INFOSYS',
    'WIPRO', 'L&T', 'ISRO', 'DRDO', 'QUALCOMM', 'INTEL', 'TESLA', 'NVIDIA', 'META', 'SPACEX'
  ];

  const content = (
    <div style={{ display: 'flex', whiteSpace: 'nowrap' }}>
      {[...Array(2)].map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          {companies.map((text, j) => (
            <div key={j} style={{ fontWeight: 900, fontSize: '1.4rem', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '2rem', padding: '0 3rem' }}>
              <span style={{ letterSpacing: '0.05em' }}>{text}</span>
              <span style={{ fontSize: '0.6rem', opacity: 0.3 }}>✦</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ background: '#fdf9e1', borderTop: '2px solid black', borderBottom: '2px solid black', padding: '1.4rem 0', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center' }}>
      <div style={{
        position: 'absolute',
        left: 0,
        zIndex: 20,
        background: 'black',
        color: 'white',
        padding: '1.4rem 2rem',
        fontSize: '0.8rem',
        fontWeight: 950,
        borderRight: '2px solid black',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '10px 0 30px rgba(0,0,0,0.1)'
      }}>
        ALUMNI AT:
      </div>
      <div ref={tickerRef} style={{ display: 'flex', width: 'fit-content', marginLeft: '140px' }}>
        {content}
        {content}
      </div>
      {/* Gradient overlays for smooth entry/exit */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '100px', background: 'linear-gradient(to left, #fdf9e1, transparent)', zIndex: 10 }} />
    </div>
  );
};

const DeconstructedFlip = () => {
  const sectionRef = useRef(null);
  const imageUrl = igitCampus;

  const slices = [
    {
      name: "slice-left", pos: "0% 50%",
      bg: "#ffffff", color: "black", icon: "📈",
      title: "Going Zero to One",
      desc: "If you're navigating a new research unit or venturing into a robotics domain entirely."
    },
    {
      name: "slice-center", pos: "50% 50%",
      bg: "#e74c3c", color: "white", icon: "⚛️",
      title: "Scaling from One to N",
      desc: "Already achieved breakthrough? We help you scale your hardware and AI to the next level."
    },
    {
      name: "slice-right", pos: "100% 50%",
      bg: "#1a1a1a", color: "white", icon: "🪄",
      title: "Need Quick Solutions",
      desc: "If you know exactly what you want and need an elite team to step in and execute."
    }
  ];

  useGSAP(() => {
    // Set Initial State: Joined Side-by-Side
    gsap.set(".slice-left", { x: -240 });
    gsap.set(".slice-center", { x: 0 });
    gsap.set(".slice-right", { x: 240 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=300%", // Extra scroll for the new phase
        scrub: 1,
        pin: true,
      }
    });

    // Phase 1: Expansion (Break Apart)
    tl.to(".slice-left", { x: -320, rotateY: -15, ease: "power2.inOut" }, 0)
      .to(".slice-right", { x: 320, rotateY: 15, ease: "power2.inOut" }, 0);

    // Phase 2: The Flip
    tl.to(".slice-inner", {
      rotationY: 180,
      stagger: 0.1,
      duration: 1,
      ease: "power2.inOut"
    }, 0.5);

    // Final Fan alignment - Tight Overlapping Stack
    tl.to(".slice-left", { x: -90, rotationZ: -8, y: 15, ease: "back.out(1.2)" }, 1)
      .to(".slice-right", { x: 90, rotationZ: 8, y: 15, ease: "back.out(1.2)" }, 1)
      .to(".slice-center", { x: 0, y: -15, scale: 1.05, ease: "back.out(1.2)" }, 1);

    // Phase 4: Final Spread (Wider for maximum legibility)
    tl.to(".slice-left", { x: -420, rotationZ: -2, y: 0, ease: "power2.inOut" }, 1.5)
      .to(".slice-right", { x: 420, rotationZ: 2, y: 0, ease: "power2.inOut" }, 1.5)
      .to(".slice-center", { x: 0, y: 0, scale: 1, ease: "power2.inOut" }, 1.5);

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} style={{
      height: "100vh",
      background: "#f8f9fa", // Clean Technical Light Mode
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      perspective: "2000px",
      position: "relative"
    }}>
      {/* Precision Grid Pattern */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        opacity: 0.8
      }} />

      <div className="container" style={{ position: "relative", width: "100%", height: "450px", overflow: "visible" }}>
        {slices.map((s, i) => (
          <div key={i} className={`slice-container ${s.name}`} style={{
            width: "240px",
            height: "100%",
            position: "absolute",
            left: "50%",
            marginLeft: "-120px", // Half width to center it at 50%
            // Initial X transform to form the image: -240, 0, 240
            transform: `translateX(${(i - 1) * 240}px)`,
            transformStyle: "preserve-3d"
          }}>
            <div className="slice-inner" style={{ width: "100%", height: "100%", position: "absolute", transformStyle: "preserve-3d" }}>
              {/* FrontSide (Image Slice) */}
              <div style={{
                position: "absolute", inset: 0, backfaceVisibility: "hidden",
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "720px 100%", // 3 * 240
                backgroundPosition: s.pos,
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.1)"
              }} />

              {/* BackSide (Content) */}
              <div style={{
                position: "absolute", inset: 0,
                background: s.bg,
                color: s.color,
                borderRadius: "20px",
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                padding: "25px",
                display: "flex",
                flexDirection: "column",
                border: i === 0 ? "2px solid #e2e8f0" : "2px solid black",
                boxShadow: "0 40px 80px rgba(0,0,0,0.15)"
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "1.2rem" }}>{s.icon}</div>
                <h3 style={{ fontSize: "1.6rem", fontWeight: 900, marginBottom: "0.8rem", lineHeight: 1.1 }}>{s.title}</h3>
                <p style={{ fontSize: "0.85rem", fontWeight: 700, opacity: 0.8, lineHeight: 1.3 }}>{s.desc}</p>
                <div style={{ marginTop: "auto", fontWeight: 900, fontSize: "0.6rem", opacity: 0.5 }}>IGIT ROBOTICS // UNIT_0{i + 1}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
;



const SocialLink = ({ icon, color }) => {
  const btnRef = useRef(null);
  useMagnetic(btnRef);
  return (
    <div ref={btnRef} className="social-magnetic-container" style={{ display: 'inline-block' }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '2px solid black',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        fontWeight: 900,
        color: 'black',
        cursor: 'pointer',
        transition: 'background 0.2s, color 0.2s',
        boxShadow: '3px 3px 0 black'
      }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'black'; e.currentTarget.style.color = 'white'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'black'; }}
      >
        {icon}
      </div>
    </div>
  );
};

const MemberCard = ({ name, role, color, batch, themeColor, img }) => {
  const accentColor = themeColor || color;

  const cardBgStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: '24px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'default',
    position: 'relative',
    height: '100%',
    gap: '16px',
    border: '1px solid rgba(0,0,0,0.12)'
  };

  return (
    <div className="member-card" style={cardBgStyle}>
      {/* Left: Profile Image */}
      <div style={{
        width: '120px',
        height: '120px',
        flexShrink: 0,
        background: '#e0f2fe',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        <img src={img || "/profile-icon.jpg"} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Right: Content */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center', height: '100%', minWidth: 0 }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontWeight: 900, fontSize: '1.3rem', color: '#0f172a', margin: 0, textTransform: 'uppercase', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</h3>
          <p style={{ fontSize: '0.9rem', color: '#3b82f6', margin: '4px 0 0 0', textTransform: 'uppercase', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{role}</p>
          {batch && <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0 0', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{batch}</p>}
        </div>
        
        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="blob-btn" style={{ '--btn-color': accentColor }}>
            <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={16} /> EMAIL
            </span>
            <span className="blob-btn__inner">
              <span className="blob-btn__blobs">
                <span className="blob-btn__blob"></span>
                <span className="blob-btn__blob"></span>
                <span className="blob-btn__blob"></span>
                <span className="blob-btn__blob"></span>
              </span>
            </span>
          </button>
          <button className="blob-btn" style={{ '--btn-color': accentColor }}>
            <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaLinkedin size={16} /> LINKEDIN
            </span>
            <span className="blob-btn__inner">
              <span className="blob-btn__blobs">
                <span className="blob-btn__blob"></span>
                <span className="blob-btn__blob"></span>
                <span className="blob-btn__blob"></span>
                <span className="blob-btn__blob"></span>
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

const MemberGroup = ({ title, members, themeColor }) => {
  const groupRef = useRef(null);

  // Removed GSAP animation so cards are always visible

  return (
    <div ref={groupRef} style={{ marginBottom: '5rem' }}>
      <h3 style={{
        textAlign: 'left',
        fontSize: '1.2rem',
        fontWeight: 900,
        marginBottom: '1.5rem',
        display: 'inline-block',
        padding: '0.4rem 1.2rem',
        background: '#fbc531',
        color: '#0f172a',
        borderRadius: '8px',
        transform: 'rotate(-1deg)'
      }}>
        {title}
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
        {members.map((m, i) => <MemberCard key={i} name={m.n} role={m.r} color={m.c} batch={m.b} themeColor={themeColor} img={m.img} />)}
      </div>
    </div>
  );
};

const TeamSection = () => {
  const [activeTab, setActiveTab] = useState('leadership');
  const vantaRef = useRef(null);

  useEffect(() => {
    let activeVanta = null;
    let threeScript = null;
    let vantaScript = null;

    const loadScriptsAndInit = () => {
      if (!window.THREE) {
        threeScript = document.createElement('script');
        threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
        threeScript.async = true;
        threeScript.onload = loadVantaScript;
        document.body.appendChild(threeScript);
      } else {
        loadVantaScript();
      }
    };

    const loadVantaScript = () => {
      if (!window.VANTA || !window.VANTA.GLOBE) {
        vantaScript = document.createElement('script');
        vantaScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.globe.min.js';
        vantaScript.async = true;
        vantaScript.onload = initVanta;
        document.body.appendChild(vantaScript);
      } else {
        initVanta();
      }
    };

    const initVanta = () => {
      setTimeout(() => {
        if (!activeVanta && window.VANTA && window.VANTA.GLOBE && vantaRef.current) {
          activeVanta = window.VANTA.GLOBE({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            backgroundColor: 0xffffff,
            color: 0x0f172a,
            color2: 0x64748b
          });
        }
      }, 100);
    };

    loadScriptsAndInit();

    return () => {
      if (activeVanta && activeVanta.destroy) activeVanta.destroy();
    };
  }, []);

  const [members, setMembers] = useState(defaultMembers);

  useEffect(() => {
    membersService.getAll().then(setMembers);
  }, []);

  const facultyData = {
    professors: members.filter(m => m.category === 'faculty').map(m => ({ n: m.name, r: m.role, c: m.color, b: m.batch, img: m.img }))
  };

  const leadershipMembers = members.filter(m => m.category === 'leadership');
  const leadershipData = {
    advisors: leadershipMembers.filter(m => m.role?.toLowerCase().includes('advisor')).map(m => ({ n: m.name, r: m.role, c: m.color, b: m.batch, img: m.img })),
    secretaries: leadershipMembers.filter(m => m.role?.toLowerCase().includes('secretary')).map(m => ({ n: m.name, r: m.role, c: m.color, b: m.batch, img: m.img })),
    representatives: leadershipMembers.filter(m => m.role?.toLowerCase().includes('representative')).map(m => ({ n: m.name, r: m.role, c: m.color, b: m.batch, img: m.img }))
  };

  // Group alumni dynamically by batch
  const alumniData = {};
  const alumniMembers = members.filter(m => m.category === 'alumni');
  alumniMembers.forEach(m => {
    const yearMatch = m.batch?.match(/\d{4}/);
    const key = yearMatch ? `Class of ${yearMatch[0]}` : m.batch || 'Other';
    if (!alumniData[key]) alumniData[key] = [];
    alumniData[key].push({ n: m.name, r: m.role, c: m.color, b: m.batch, img: m.img });
  });

  const tabMeta = {
    leadership: {
      theme: '#0f172a',
    },
    alumni: {
      theme: '#fbc531',
    },
  };

  const meta = tabMeta[activeTab] || tabMeta.leadership;

  return (
    <section
      id="team"
      className="team-section"
      ref={vantaRef}
      style={{
        borderTop: '2px solid black',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#ffffff'
      }}
    >

      <div style={{ padding: '32px 1.5rem 80px 1.5rem', position: 'relative', zIndex: 2, width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        {/* TABS */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem' }}>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            background: 'white',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            padding: '0.5rem',
            borderRadius: '50px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            flexWrap: 'wrap'
          }}>
            {['leadership', 'alumni'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: activeTab === tab ? meta.theme : 'transparent',
                  color: activeTab === tab ? (meta.theme === '#fbc531' ? '#0f172a' : 'white') : '#64748b',
                  border: 'none',
                  padding: '0.6rem 2rem',
                  borderRadius: '50px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENT */}
        <div style={{ animation: 'fadeIn 0.5s ease-in-out', paddingLeft: '4vw', paddingRight: '2vw' }} key={activeTab}>
          {activeTab === 'leadership' && (
            <div>
              <MemberGroup title="Robotics Advisors" members={leadershipData.advisors} themeColor={meta.theme} />
              <MemberGroup title="Robotics Secretaries" members={leadershipData.secretaries} themeColor={meta.theme} />
              <MemberGroup title="Robotics Representatives" members={leadershipData.representatives} themeColor={meta.theme} />
            </div>
          )}
          {activeTab === 'alumni' && (
            <div>
              {Object.keys(alumniData).sort().reverse().map(batchTitle => (
                <MemberGroup 
                  key={batchTitle} 
                  title={batchTitle} 
                  members={alumniData[batchTitle]} 
                  themeColor={meta.theme} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); filter: blur(10px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0);    }
        }
        @keyframes shimmerSweep {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
};

const SimpleAchievementCard = ({ year, event, position, color, icon }) => {
  return (
    <div style={{
      background: color || '#f8fafc',
      borderRadius: '16px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid rgba(0,0,0,0.05)',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ 
          background: 'white', 
          color: 'black', 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: '1.2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          #{position}
        </div>
        <div style={{ fontSize: '2rem' }}>{icon}</div>
      </div>
      <div style={{ marginTop: 'auto' }}>
        <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>{year}</p>
        <h3 style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.3, margin: 0 }}>{event}</h3>
      </div>
    </div>
  );
};

const Achievements = () => {
  const achievementsData = [
    { year: '2023', event: 'National Robo-Con', position: '1', color: '#ffedd5', icon: '🏆' },
    { year: '2024', event: 'AI Pitch Fest at E-Summit', position: '1', color: '#dcfce7', icon: '👁️' },
    { year: '2022', event: 'Smart City Hackathon, IIT Bombay', position: '2', color: '#e0f2fe', icon: '🏙️' },
    { year: '2022', event: 'International Robotics Challenge', position: '3', color: '#f3e8ff', icon: '🌎' },
    { year: '2024', event: 'Smart India Hackathon', position: '2', color: '#fce7f3', icon: '🥈' },
    { year: '2021', event: 'Speed Challenge Line Follower', position: '1', color: '#fef9c3', icon: '🏎️' }
  ];

  return (
    <section id="achievements" style={{ background: '#ffffff', padding: '100px 0', borderTop: '1px solid #e2e8f0' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', color: '#0f172a', marginBottom: '1rem', fontWeight: 900, letterSpacing: '-1px' }}>Achievements</h2>
          <p style={{ fontWeight: 600, color: '#64748b', fontSize: '1.1rem' }}>A legacy of excellence and innovation.</p>
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {achievementsData.map((item, i) => (
            <SimpleAchievementCard key={i} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Events = () => {
  // Removed GSAP animation as requested

  const [eventsData, setEventsData] = useState(defaultEvents);

  useEffect(() => {
    eventsService.getAll().then(data => {
      setEventsData(data);
    });
  }, []);

  return (
    <section id="workshops" style={{ 
      backgroundColor: '#f5f3f7',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\\\'http://www.w3.org/2000/svg\\\' width=\\\'48\\\' height=\\\'48\\\' viewBox=\\\'0 0 48 48\\\'%3E%3Cg fill=\\\'%23b8b8b8\\\' fill-opacity=\\\'0.08\\\'%3E%3Cpath d=\\\'M12 0h18v6h6v6h6v18h-6v6h-6v6H12v-6H6v-6H0V12h6V6h6V0zm12 6h-6v6h-6v6H6v6h6v6h6v6h6v-6h6v-6h6v-6h-6v-6h-6V6zm-6 12h6v6h-6v-6zm24 24h6v6h-6v-6z\\\'%3E%3C/path%3E%3C/g%3E%3C/svg%3E")',
      padding: '60px 0' 
    }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        <h2 style={{ fontSize: '3.5rem', marginBottom: '2.5rem', textAlign: 'center', fontWeight: 900, color: '#0f172a', letterSpacing: '-1.5px' }}>Events</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {eventsData.map((ev, i) => (
            <div key={i} className="event-card" style={{
              background: '#ffffff',
              borderRadius: '32px',
              padding: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'default'
            }}>
              {/* Top Hero Image */}
              <div style={{
                width: '100%',
                height: '180px',
                borderRadius: '20px',
                overflow: 'hidden',
                marginBottom: '20px',
                position: 'relative'
              }}>
                <img src={ev.image} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: ev.status === 'LIVE' ? '#ef4444' : ev.status === 'UPCOMING' ? '#3b82f6' : '#1e293b',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}>
                  {ev.status}
                </div>
              </div>

              {/* Bottom Content Area */}
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 8px 16px 8px' }}>
                {/* Top Row: Date + Divider + Location/Title */}
                <div style={{ display: 'flex', marginBottom: '16px' }}>
                  {/* Left: Large Date */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'flex-start',
                    paddingRight: '20px',
                    borderRight: '1px solid #e2e8f0',
                    minWidth: '70px'
                  }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#334155', lineHeight: 1.2 }}>{ev.dateMonth}</span>
                    <span style={{ fontSize: '3.2rem', fontWeight: 900, color: ev.color, lineHeight: 1, letterSpacing: '-2px' }}>{ev.dateDay}</span>
                  </div>

                  {/* Right: Location & Title */}
                  <div style={{ paddingLeft: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{ev.location}</span>
                    </div>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.1 }}>{ev.title}</h3>
                  </div>
                </div>

                {/* Bottom Row: Desc & Price (aligned left) */}
                <div>
                  <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#475569', marginBottom: '20px', lineHeight: 1.4 }}>{ev.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                      <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>{ev.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


const GalleryRow = React.forwardRef(({ rowData, onImageClick }, ref) => {
  const duplicatedData = [...rowData, ...rowData];

  return (
    <div style={{ display: 'flex', width: 'fit-content', gap: '1rem', marginBottom: '1rem' }} ref={ref}>
      {duplicatedData.map((item, i) => (
        <div
          key={i}
          style={{ 
            width: '280px', 
            height: '170px', 
            flexShrink: 0, 
            borderRadius: '12px', 
            overflow: 'hidden', 
            cursor: 'pointer', 
            position: 'relative', 
            border: '2px solid rgba(255,255,255,0.1)',
            transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s ease'
          }}
          onClick={() => onImageClick(item)}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; e.currentTarget.style.borderColor = 'white'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        >
          <img src={item.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ))}
    </div>
  );
});

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const sectionRef = useRef(null);
  const rowRefs = useRef([]);

  const [galleryList, setGalleryList] = useState(defaultGallery);

  useEffect(() => {
    galleryService.getAll().then(setGalleryList);
  }, []);

  const galleryData = [
    galleryList.filter((_, i) => i % 4 === 0),
    galleryList.filter((_, i) => i % 4 === 1),
    galleryList.filter((_, i) => i % 4 === 2),
    galleryList.filter((_, i) => i % 4 === 3)
  ];

  useGSAP(() => {
    rowRefs.current.forEach((row, i) => {
      if (!row) return;
      const direction = i % 2 === 0 ? 'left' : 'right';
      const duration = 28 + (i * 4); // smooth, organic speed variations

      if (direction === 'left') {
        gsap.to(row, {
          xPercent: -50,
          ease: 'none',
          duration: duration,
          repeat: -1
        });
      } else {
        gsap.set(row, { xPercent: -50 });
        gsap.to(row, {
          xPercent: 0,
          ease: 'none',
          duration: duration,
          repeat: -1
        });
      }
    });
  }, { scope: sectionRef });

  return (
    <section id="gallery" ref={sectionRef} style={{ background: 'white', padding: '120px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderTop: '2px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {galleryData.map((row, index) => (
          <GalleryRow
            key={index}
            ref={(el) => (rowRefs.current[index] = el)}
            rowData={row}
            onImageClick={setSelectedImage}
          />
        ))}
      </div>

      {/* Modal Overlay */}
      {selectedImage && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.85)', zIndex: 100000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          padding: '1rem'
        }}
          onClick={() => setSelectedImage(null)}
        >
          <div style={{
            background: 'white', borderRadius: '16px', overflow: 'hidden',
            width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            position: 'relative'
          }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'absolute', top: '15px', right: '15px',
                background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none',
                borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.2rem',
                cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)'
              }}
            >
              ×
            </button>
            <img src={selectedImage.url} alt={selectedImage.title} style={{ width: '100%', maxHeight: '65vh', objectFit: 'cover' }} />
            <div style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', color: 'black' }}>{selectedImage.title}</h3>
              <p style={{ fontSize: '1.1rem', color: '#555', fontWeight: 500 }}>{selectedImage.context}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const Footer = () => (
  <footer style={{ background: 'white', color: '#0f172a', padding: '50px 0', borderTop: '2px solid #e2e8f0' }}>
    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <img src="/club-logo.png" alt="IGIT Robotics Logo" style={{ height: '80px' }} />
        <div>
          <div style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '0.2rem' }}>IGIT ROBOTICS SOCIETY</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>© 2024 IGIT Sarang // Innovation for the next generation.</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <a href="https://www.instagram.com/igit_robotics" target="_blank" rel="noreferrer" style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ borderBottom: '2px solid #fbc531' }}>INSTAGRAM</span>
        </a>
        <button className="btn-buddy" style={{ background: '#0f172a', color: 'white', padding: '0.5rem 1.5rem' }}>JOIN THE CLUB</button>
      </div>
    </div>
  </footer>
);

const Home = () => {
  // --- SMOOTH SCROLL ---
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  // --- GLOBAL ANIMATIONS ---
  useGSAP(() => {
    // Section Title Reveal (Global)
    gsap.utils.toArray('h2').forEach(heading => {
      gsap.from(heading, {
        filter: 'blur(15px)',
        scale: 1.1,
        y: 40,
        opacity: 0,
        duration: 1.5,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: heading,
          start: 'top 92%',
          toggleActions: 'play none none reverse'
        }
      });
    });
  });

  return (
    <div style={{ paddingBottom: '0', position: 'relative' }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10000,
        opacity: 0.04,
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />
      <CustomCursor />
      <Navbar />
      <Hero />
      <Ticker />
      <DeconstructedFlip />
      <Gallery />
      <Events />
      <Achievements />
      <TeamSection />
      <Footer />
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: 'none' }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7" result="goo"></feColorMatrix>
            <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default Home;
