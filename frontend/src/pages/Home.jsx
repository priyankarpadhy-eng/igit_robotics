import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { Link } from 'react-router-dom';
import igitCampus from "../assets/igit_campus.png";
import * as THREE from 'three';

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
  const navRef = useRef(null);


  return (
    <nav ref={navRef} style={{ padding: '1.5rem 0', display: 'flex', justifyContent: 'center', position: 'fixed', width: '100%', top: 0, zIndex: 1000, pointerEvents: 'none' }}>
      <div className="brutalist-nav" style={{
        background: 'white',
        border: '2px solid black',
        borderRadius: '100px',
        padding: '0.6rem 1.8rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2.5rem',
        boxShadow: '8px 8px 0 black',
        pointerEvents: 'auto'
      }}>
        <div style={{ fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>IGIT ROBOTICS</div>
        <div style={{ display: 'flex', gap: '1.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
          <a href="#gallery" onClick={(e) => { e.preventDefault(); document.querySelector('#gallery').scrollIntoView({ behavior: 'smooth' }); }} style={{ color: 'black', textDecoration: 'none' }}>Gallery</a>
          <a href="#team" onClick={(e) => { e.preventDefault(); document.querySelector('#team').scrollIntoView({ behavior: 'smooth' }); }} style={{ color: 'black', textDecoration: 'none' }}>Team</a>
          <a href="#workshops" onClick={(e) => { e.preventDefault(); document.querySelector('#workshops').scrollIntoView({ behavior: 'smooth' }); }} style={{ color: 'black', textDecoration: 'none' }}>Workshops</a>
          <a href="#achievements" onClick={(e) => { e.preventDefault(); document.querySelector('#achievements').scrollIntoView({ behavior: 'smooth' }); }} style={{ color: 'black', textDecoration: 'none' }}>Achievements</a>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="https://www.instagram.com/igit_robotics" target="_blank" rel="noreferrer" style={{
            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            color: 'white',
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: 900,
            textDecoration: 'none',
            border: '2px solid black',
            boxShadow: '3px 3px 0 black'
          }}>
            IG
          </a>
          <button style={{ background: 'black', color: 'white', padding: '0.4rem 1.5rem', borderRadius: '50px', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Join Us</button>
        </div>
      </div>
    </nav>
  );
};

const SectionDecor = ({ color }) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const elements = gsap.utils.toArray('.decor-shape', containerRef.current);
    elements.forEach(el => {
      gsap.to(el, {
        x: 'random(-50, 50)',
        y: 'random(-50, 50)',
        rotation: 'random(-180, 180)',
        duration: 'random(3, 6)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden', opacity: 0.4, zIndex: 0 }}>
      {/* Abstract Curves / Threads */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <path d="M-100,100 C200,300 400,0 600,200 S1000,400 1200,100" fill="none" stroke={color || 'black'} strokeWidth="2" opacity="0.3" />
        <path d="M-50,400 C300,100 600,500 900,200 S1400,600 1600,300" fill="none" stroke={color || 'black'} strokeWidth="1" opacity="0.2" />
        <line x1="0" y1="0" x2="100%" y2="100%" stroke={color || 'black'} strokeWidth="0.5" opacity="0.1" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke={color || 'black'} strokeWidth="0.5" opacity="0.1" />
      </svg>

      {[...Array(15)].map((_, i) => (
        <React.Fragment key={i}>
          <div className="decor-shape" style={{ position: 'absolute', top: `${Math.random() * 90}%`, left: `${Math.random() * 90}%`, width: '40px', height: '40px', border: `3px solid ${color || 'black'}`, borderRadius: i % 3 === 0 ? '50%' : i % 3 === 1 ? '12px' : '0', transform: `rotate(${Math.random() * 360}deg)` }} />
          <div className="decor-shape" style={{ position: 'absolute', top: `${Math.random() * 90}%`, left: `${Math.random() * 90}%`, fontSize: '2.5rem', fontWeight: 900, color: color || 'black', transform: `rotate(${Math.random() * 45}deg)` }}>+</div>
        </React.Fragment>
      ))}
    </div>
  );
};

const Sticker = ({ text, color, top, left, rotate }) => (
  <div className="sticker float" style={{
    backgroundColor: color,
    top, left,
    transform: `rotate(${rotate}deg)`,
    padding: '8px 16px',
    fontSize: '0.75rem'
  }}>
    {text}
  </div>
);

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

const MemberCard = ({ name, role, color, batch }) => {
  const btnRef = useRef(null);
  useMagnetic(btnRef);

  const cardBgStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '28px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'default',
    position: 'relative',
    border: '3px solid black',
    boxShadow: '6px 6px 0 black',
    transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.2s ease',
    height: '100%'
  };

  return (
    <div className="member-card" style={cardBgStyle}
      onMouseEnter={(e) => { 
        e.currentTarget.style.transform = 'translate(-4px, -4px)'; 
        e.currentTarget.style.boxShadow = '10px 10px 0 black'; 
      }}
      onMouseLeave={(e) => { 
        e.currentTarget.style.transform = 'none'; 
        e.currentTarget.style.boxShadow = '6px 6px 0 black'; 
      }}
    >
      {/* Large Image Placeholder */}
      <div style={{
        width: '100%',
        aspectRatio: '1/1',
        background: color,
        border: '3px solid black',
        boxShadow: '4px 4px 0 black',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Soft abstract lighting */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.6) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-20%', width: '150px', height: '150px', background: 'rgba(0,0,0,0.05)', borderRadius: '50%', filter: 'blur(20px)' }} />

        {/* Big initial as placeholder */}
        <span style={{ fontSize: '6rem', fontWeight: 900, color: 'rgba(0,0,0,0.15)', position: 'relative', zIndex: 1, textShadow: '2px 2px 0 rgba(255,255,255,0.3)' }}>
          {name.charAt(0)}
        </span>
      </div>

      {/* Content Container */}
      <div style={{ padding: '0 0.4rem 0.4rem 0.4rem', textAlign: 'left', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {/* Name and Verified Check */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <h3 style={{ fontWeight: 900, fontSize: '1.35rem', color: 'black', margin: 0, letterSpacing: '-0.5px' }}>{name}</h3>
          <div style={{
            width: '20px', height: '20px',
            background: '#22c55e',
            border: '2px solid black',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', color: 'white', fontWeight: 900
          }}>✓</div>
        </div>

        {/* Description */}
        <p style={{
          fontSize: '0.95rem',
          color: '#1e293b',
          lineHeight: 1.45,
          fontWeight: 700,
          marginBottom: '1.5rem'
        }}>
          {role} who focuses on robotics excellence. ({batch})
        </p>

        {/* Footer / Socials & Connect Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          {/* Social Links Row */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {[
              { icon: 'IG', color: '#E1306C' },
              { icon: 'IN', color: '#0077b5' }
            ].map((soc, i) => (
              <SocialLink key={i} icon={soc.icon} color={soc.color} />
            ))}
          </div>

          {/* Connect Button in Neo-Brutalist Style */}
          <button ref={btnRef} style={{
            background: 'white',
            border: '3px solid black',
            padding: '8px 16px',
            borderRadius: '16px',
            fontWeight: 900,
            fontSize: '0.9rem',
            color: 'black',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '3px 3px 0 black',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease'
          }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.transform = 'translate(-2px, -2px)';
              e.currentTarget.style.boxShadow = '5px 5px 0 black';
              e.currentTarget.style.backgroundColor = '#fdf9e1';
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '3px 3px 0 black';
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            Connect <span style={{ fontWeight: 400 }}>+</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const MemberGroup = ({ title, members }) => {
  const groupRef = useRef(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray('.member-card', groupRef.current);
    gsap.from(cards, {
      scale: 0.9,
      y: 40,
      autoAlpha: 0, // Better than opacity for ensuring it shows up
      stagger: 0.1,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: groupRef.current,
        start: 'top 95%', // Fire much earlier
        toggleActions: 'play none none reverse'
      }
    });
  }, { scope: groupRef });

  return (
    <div ref={groupRef} style={{ marginBottom: '5rem' }}>
      <h3 style={{
        textAlign: 'left',
        fontSize: '1.2rem',
        fontWeight: 900,
        marginBottom: '1.5rem',
        display: 'inline-block',
        padding: '0.4rem 1.2rem',
        background: 'black',
        color: 'white',
        borderRadius: '8px',
        transform: 'rotate(-1deg)'
      }}>
        {title}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
        {members.map((m, i) => <MemberCard key={i} name={m.n} role={m.r} color={m.c} batch={m.b} />)}
      </div>
    </div>
  );
};

const TeamSection = () => {
  const [activeTab, setActiveTab] = useState('faculty');

  const facultyData = {
    professors: [
      { n: 'Dr. A. K. Sharma', r: 'Faculty Advisor', c: '#ffcd6d', b: 'Dept. of CS' },
      { n: 'Dr. B. P. Singh', r: 'Co-Advisor', c: '#95d5b2', b: 'Dept. of EE' }
    ]
  };

  const leadershipData = {
    advisors: [
      { n: 'Navdeep Ghosh', r: 'Robotics Advisor', c: '#ffcd6d', b: '41st Batch' },
      { n: 'Debasish Mallick', r: 'Robotics Advisor', c: '#95d5b2', b: '41st Batch' },
      { n: 'Reetika Mohanty', r: 'Robotics Advisor', c: '#e5d0f1', b: '41st Batch' }
    ],
    secretaries: [
      { n: 'Pritish Nayak', r: 'Robotics Secretary', c: '#fdf9e1', b: '42nd Batch' },
      { n: 'Prayash Agarwal', r: 'Robotics Secretary', c: '#d8e9f0', b: '42nd Batch' },
      { n: 'Pritiparana Nayak', r: 'Robotics Secretary', c: '#ffcd6d', b: '42nd Batch' }
    ],
    representatives: [
      { n: 'Satya Sworup Pradhan', r: 'Robotics Representative', c: '#95d5b2', b: '43rd Batch' },
      { n: 'Sushree Mohanty', r: 'Robotics Representative', c: '#e5d0f1', b: '43rd Batch' }
    ]
  };

  const alumniData = {
    alumni2020: [
      { n: 'Rahul Verma', r: 'Software Engineer @ Google', c: '#fdf9e1', b: 'Class of 2020' },
      { n: 'Anjali Das', r: 'Robotics Engineer @ Tesla', c: '#d8e9f0', b: 'Class of 2020' }
    ],
    alumni2021: [
      { n: 'Vikas Kumar', r: 'Researcher @ ISRO', c: '#ffcd6d', b: 'Class of 2021' }
    ]
  };

  const svgPattern = (fillColor, fillOpacity) =>
    `url("data:image/svg+xml,%3Csvg width='84' height='84' viewBox='0 0 84 84' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${fillColor}' fill-opacity='${fillOpacity}'%3E%3Cpath d='M84 23c-4.417 0-8-3.584-8-7.998V8h-7.002C64.58 8 61 4.42 61 0H23c0 4.417-3.584 8-7.998 8H8v7.002C8 19.42 4.42 23 0 23v38c4.417 0 8 3.584 8 7.998V76h7.002C19.42 76 23 79.58 23 84h38c0-4.417 3.584-8 7.998-8H76v-7.002C76 64.58 79.58 61 84 61V23zM59.05 83H43V66.95c5.054-.5 9-4.764 9-9.948V52h5.002c5.18 0 9.446-3.947 9.95-9H83v16.05c-5.054.5-9 4.764-9 9.948V74h-5.002c-5.18 0-9.446 3.947-9.95 9zm-34.1 0H41V66.95c-5.053-.502-9-4.768-9-9.948V52h-5.002c-5.184 0-9.447-3.946-9.95-9H1v16.05c5.053.502 9 4.768 9 9.948V74h5.002c5.184 0 9.447 3.946 9.95 9zm0-82H41v16.05c-5.054.5-9 4.764-9 9.948V32h-5.002c-5.18 0-9.446 3.947-9.95 9H1V24.95c5.054-.5 9-4.764 9-9.948V10h5.002c5.18 0 9.446-3.947 9.95-9zm34.1 0H43v16.05c5.053.502 9 4.768 9 9.948V32h5.002c5.184 0 9.447 3.946 9.95 9H83V24.95c-5.053-.502-9-4.768-9-9.948V10h-5.002c-5.184 0-9.447-3.946-9.95-9zM50 50v7.002C50 61.42 46.42 65 42 65c-4.417 0-8-3.584-8-7.998V50h-7.002C22.58 50 19 46.42 19 42c0-4.417 3.584-8 7.998-8H34v-7.002C34 22.58 37.58 19 42 19c4.417 0 8 3.584 8 7.998V34h7.002C61.42 34 65 37.58 65 42c0 4.417-3.584 8-7.998 8H50z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

  const tabMeta = {
    faculty: {
      bg: `#e8f5f8 ${svgPattern('0097a7', '0.25')}`,
      theme: '#00bcd4',
    },
    leadership: {
      bg: `#f3eaf8 ${svgPattern('5b12cf', '0.4')}`,
      theme: '#8e44ad',
    },
    alumni: {
      bg: `#fef5ea ${svgPattern('c45200', '0.25')}`,
      theme: '#e65100',
    },
  };

  const meta = tabMeta[activeTab];

  const allTabs = ['faculty', 'leadership', 'alumni'];

  return (
    <section
      id="team"
      className="team-section"
      style={{
        borderTop: '2px solid black',
        position: 'relative',
        overflow: 'hidden',
        background: '#f0f0f0', // fallback
      }}
    >
      {/* Stacked gradient layers — crossfade via opacity */}
      {allTabs.map(tab => (
        <div key={tab} style={{
          position: 'absolute', inset: 0,
          background: tabMeta[tab].bg,
          opacity: activeTab === tab ? 1 : 0,
          transition: 'opacity 0.8s ease',
          zIndex: 0,
          pointerEvents: 'none',
        }} />
      ))}

      <div className="container" style={{ padding: '100px 1.5rem', position: 'relative', zIndex: 2, minHeight: '80vh' }}>
        <h2 style={{ marginBottom: '3rem', textAlign: 'center', fontSize: '3.5rem' }}>Our People</h2>

        {/* TABS */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '5rem', flexWrap: 'wrap' }}>
          {['faculty', 'leadership', 'alumni'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? meta.theme : 'white',
                color: activeTab === tab ? 'white' : 'black',
                border: '3px solid black',
                boxShadow: activeTab === tab ? '0px 0px 0 black' : '6px 6px 0 black',
                transform: activeTab === tab ? 'translate(6px, 6px)' : 'none',
                padding: '0.8rem 2.5rem',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s cubic-bezier(0.25,1,0.5,1)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div style={{ animation: 'fadeIn 0.5s ease-in-out' }} key={activeTab}>
          {activeTab === 'faculty' && (
            <MemberGroup title="Faculty Advisors" members={facultyData.professors} />
          )}
          {activeTab === 'leadership' && (
            <div>
              <MemberGroup title="Robotics Advisors" members={leadershipData.advisors} />
              <MemberGroup title="Robotics Secretaries" members={leadershipData.secretaries} />
              <MemberGroup title="Robotics Representatives" members={leadershipData.representatives} />
            </div>
          )}
          {activeTab === 'alumni' && (
            <div>
              <MemberGroup title="Class of 2020" members={alumniData.alumni2020} />
              <MemberGroup title="Class of 2021" members={alumniData.alumni2021} />
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

const DynamicAchievementCard = ({ items, index, hoveredIndex, setHoveredIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(null);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'exit' | 'enter'
  const isHoveredRef = useRef(false);
  const timeoutRef = useRef(null);

  isHoveredRef.current = hoveredIndex === index;
  const isHovered = hoveredIndex === index;
  const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;
  const ac = items[currentIndex];

  useEffect(() => {
    if (!items || items.length <= 1) return;

    const scheduleFlip = (delay) => {
      timeoutRef.current = setTimeout(() => {
        if (isHoveredRef.current) {
          scheduleFlip(3000);
          return;
        }
        const next = (currentIndex + 1) % items.length; // captured via ref below
        setNextIndex(next);
        setPhase('exit');
      }, delay);
    };

    const initialDelay = 4000 + index * 1700 + Math.random() * 2000;
    scheduleFlip(initialDelay);
    return () => clearTimeout(timeoutRef.current);
  }, [items, index]);

  // Drive the exit → swap → enter state machine
  useEffect(() => {
    if (phase === 'exit') {
      const t = setTimeout(() => {
        setCurrentIndex(nextIndex);
        setPhase('enter');
      }, 500);
      return () => clearTimeout(t);
    }
    if (phase === 'enter') {
      const t = setTimeout(() => {
        setPhase('idle');
        // Schedule next flip
        const delay = 6000 + Math.random() * 6000;
        timeoutRef.current = setTimeout(() => {
          if (isHoveredRef.current) return;
          setNextIndex(prev => (prev === null ? 1 : (prev + 1) % items.length));
          setPhase('exit');
        }, delay);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [phase, nextIndex, items]);

  const contentStyle = {
    transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease, filter 0.5s ease',
    transform: phase === 'exit'
      ? 'scale(0.82) translateY(24px)'
      : phase === 'enter'
        ? 'scale(0.82) translateY(-24px)'
        : 'scale(1) translateY(0)',
    opacity: phase === 'idle' ? 1 : 0,
    filter: phase === 'idle' ? 'blur(0px)' : 'blur(10px)',
  };

  return (
    <div
      className={`bento-card ${ac.spanClass}`}
      onMouseEnter={() => setHoveredIndex(index)}
      style={{
        background: ac.color,
        borderRadius: '16px',
        padding: '2.5rem',
        border: '4px solid black',
        minHeight: '220px',
        boxShadow: isHovered ? '12px 12px 0 black' : '6px 6px 0 black',
        cursor: 'pointer',
        transition: 'background 0.8s ease, transform 0.3s cubic-bezier(0.25,1,0.5,1), box-shadow 0.3s ease, opacity 0.3s ease, filter 0.3s ease',
        transform: isHovered ? 'translate(-6px,-6px)' : isOtherHovered ? 'scale(0.98)' : 'scale(1)',
        opacity: isOtherHovered ? 0.55 : 1,
        filter: isOtherHovered ? 'grayscale(80%)' : 'none',
        zIndex: isHovered ? 10 : 1,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Shimmer sweep on transition */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%)',
        backgroundSize: '200% 100%',
        animation: phase !== 'idle' ? 'shimmerSweep 0.5s ease forwards' : 'none',
        pointerEvents: 'none', zIndex: 3,
      }} />

      {/* Hover detail overlay */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '12px',
        background: 'rgba(0,0,0,0.82)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: '2rem', textAlign: 'center',
        opacity: isHovered ? 1 : 0,
        transform: isHovered ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        zIndex: 4,
        pointerEvents: isHovered ? 'auto' : 'none',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{ac.icon}</div>
        <h3 style={{ color: 'white', fontWeight: 900, fontSize: '1.4rem', marginBottom: '0.7rem', lineHeight: 1.1 }}>{ac.title}</h3>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.5 }}>{ac.desc}</p>
        <div style={{ marginTop: '1.2rem', background: ac.color, color: 'black', padding: '4px 14px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 900 }}>{ac.date}</div>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem', ...contentStyle }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '3.5rem' }}>{ac.icon}</div>
          <div style={{ background: 'black', color: 'white', padding: '6px 14px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>
            {ac.date}
          </div>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'black', marginBottom: '0.5rem', lineHeight: 1.2 }}>{ac.title}</h3>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: 'rgba(0,0,0,0.7)', lineHeight: 1.5 }}>{ac.desc}</p>
        </div>
      </div>
    </div>
  );
};

const Achievements = () => {
  const containerRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const achievementsData = [
    [
      { title: 'National Champion', desc: '1st Place in National Robo-Con 2023 for Autonomous Navigation.', date: '2023', icon: '🏆', color: '#ffcd6d', spanClass: 'bento-a' },
      { title: 'Presidential Honor', desc: 'Highest award for student technical innovation in India.', date: '2024', icon: '🎖️', color: '#e5d0f1', spanClass: 'bento-a' }
    ],
    [
      { title: 'Innovation Award', desc: 'AI-driven agricultural drone project recognized nationally.', date: '2024', icon: '💡', color: '#95d5b2', spanClass: 'bento-b' },
      { title: 'Smart City Hack', desc: 'IoT traffic management challenge winners at IIT Bombay.', date: '2022', icon: '🏙️', color: '#d8e9f0', spanClass: 'bento-b' }
    ],
    [
      { title: 'Global Finalists', desc: 'Top 5 in International Robotics Challenge, Singapore.', date: '2022', icon: '🌎', color: '#e5d0f1', spanClass: 'bento-c' },
      { title: 'Tech for Good', desc: 'Developed affordable prosthetic hand for rural communities.', date: '2023', icon: '🦾', color: '#95d5b2', spanClass: 'bento-c' }
    ],
    [
      { title: 'Best Design', desc: 'Aesthetic and functional design award at Robo Expo 2023.', date: '2023', icon: '🎨', color: '#fce4ec', spanClass: 'bento-d' },
      { title: 'Speed Challenge', desc: 'Fastest line follower robot in Odisha state competition.', date: '2021', icon: '🏎️', color: '#e5d0f1', spanClass: 'bento-d' }
    ],
    [
      { title: 'Research Excellence', desc: 'Published 15+ papers in IEEE & Springer on swarm robotics.', date: 'Ongoing', icon: '📚', color: '#d8e9f0', spanClass: 'bento-e' },
      { title: 'Open Source Grant', desc: '$10K grant by Linux Foundation for ROS2 contributions.', date: '2024', icon: '🐧', color: '#c8e6c9', spanClass: 'bento-e' }
    ],
    [
      { title: 'Hackathon Winners', desc: 'Smart India Hackathon hardware edition grand finalists.', date: '2021', icon: '🥇', color: '#fff3e0', spanClass: 'bento-f' },
      { title: 'AI Pitch Fest', desc: 'First place for computer vision startup at E-Summit.', date: '2024', icon: '👁️', color: '#ffcd6d', spanClass: 'bento-f' }
    ],
    [
      { title: 'Community Outreach', desc: 'Trained 500+ school students across 12 districts in robotics.', date: '2024', icon: '🤝', color: '#c8e6c9', spanClass: 'bento-g' },
      { title: 'STEM Workshop', desc: 'Hosted 3-day intensive bootcamps for women in engineering.', date: '2023', icon: '👩‍💻', color: '#d8e9f0', spanClass: 'bento-g' }
    ],
    [
      { title: 'Startup Grant', desc: '₹25L seed funding for drone delivery spin-off venture.', date: '2023', icon: '💰', color: '#fff9c4', spanClass: 'bento-h' },
      { title: 'Incubation', desc: 'Selected for National Incubation Center, IIT Bhubaneswar.', date: '2024', icon: '🚀', color: '#95d5b2', spanClass: 'bento-h' }
    ],
    [
      { title: 'Tech Symposium', desc: 'Hosted state-level technical symposium with 1200+ participants.', date: '2022', icon: '🎫', color: '#e8eaf6', spanClass: 'bento-i' },
      { title: 'Maker Faire', desc: 'Featured exhibit at Maker Faire India, New Delhi.', date: '2023', icon: '🎪', color: '#e5d0f1', spanClass: 'bento-i' }
    ],
    [
      { title: 'Drone Racing', desc: 'Undefeated champions at Inter-College Drone Racing Cup.', date: '2024', icon: '🛸', color: '#b3e5fc', spanClass: 'bento-j' },
      { title: 'Underwater Bot', desc: 'Built ROV for underwater pipeline inspection system.', date: '2023', icon: '🤿', color: '#ffe0b2', spanClass: 'bento-j' }
    ],
    [
      { title: 'Industry Collab', desc: 'MoU with Tata Advanced Systems for defense robotics R&D.', date: '2024', icon: '🏭', color: '#ffcd6d', spanClass: 'bento-k' },
      { title: 'Patent Filed', desc: '2 patents filed for autonomous warehouse navigation.', date: '2024', icon: '📝', color: '#e5d0f1', spanClass: 'bento-k' }
    ],
    [
      { title: 'Media Feature', desc: 'Featured on NDTV and The Hindu for social-impact bots.', date: '2023', icon: '📺', color: '#f3e5f5', spanClass: 'bento-l' },
      { title: 'TEDx Talk', desc: 'Student speaker at TEDxBhubaneswar on future of robotics.', date: '2024', icon: '🎤', color: '#fce4ec', spanClass: 'bento-l' }
    ]
  ];

  useGSAP(() => {
    gsap.from('.bento-card', {
      y: 80,
      opacity: 0,
      rotationX: -15,
      stagger: 0.08,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
      }
    });
  }, { scope: containerRef });

  return (
    <section id="achievements" ref={containerRef} style={{ background: '#ffffff', padding: '120px 0', borderTop: '4px solid black', backgroundImage: 'radial-gradient(circle, #e2e8f0 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
      <style>
        {`
          .bento-grid {
            display: grid;
            gap: 1.5rem;
            perspective: 1200px;
            grid-template-columns: 1fr;
          }
          @media (min-width: 768px) {
            .bento-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (min-width: 1024px) {
            .bento-grid {
              grid-template-columns: repeat(4, 1fr);
              grid-template-rows: auto;
              grid-template-areas:
                "a a   b   c"
                "d e   e   f"
                "g g   h   i"
                "j k   k   l";
            }
            .bento-a { grid-area: a; }
            .bento-b { grid-area: b; }
            .bento-c { grid-area: c; }
            .bento-d { grid-area: d; }
            .bento-e { grid-area: e; }
            .bento-f { grid-area: f; }
            .bento-g { grid-area: g; }
            .bento-h { grid-area: h; }
            .bento-i { grid-area: i; }
            .bento-j { grid-area: j; }
            .bento-k { grid-area: k; }
            .bento-l { grid-area: l; }
          }
        `}
      </style>
      
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '4rem', color: 'black', marginBottom: '1rem', letterSpacing: '-1px', textTransform: 'uppercase' }}>Achievements</h2>
          <p style={{ fontWeight: 800, color: 'black', opacity: 0.6, fontSize: '1.2rem' }}>A legacy of excellence and innovation.</p>
        </div>
        
        <div 
          className="bento-grid"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {achievementsData.map((items, i) => (
            <DynamicAchievementCard 
              key={i} 
              items={items} 
              index={i} 
              hoveredIndex={hoveredIndex} 
              setHoveredIndex={setHoveredIndex} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const Workshops = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from('.workshop-card', {
      y: 100,
      opacity: 0,
      rotateX: -45,
      stagger: 0.15,
      duration: 1,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%'
      }
    });
  }, { scope: containerRef });

  return (
    <section id="workshops" ref={containerRef} style={{ background: '#fdf9e1', borderTop: '4px solid black', padding: '100px 0', position: 'relative', overflow: 'hidden', perspective: '1000px' }}>
      <SectionDecor color="#ff4757" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem', textAlign: 'center' }}>Technical Workshops</h2>
        <p style={{ textAlign: 'center', fontWeight: 600, opacity: 0.6, marginBottom: '5rem' }}>Hands-on training sessions for future engineers.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          {[
            { title: 'Intro to Arduino', level: 'Beginner', mod: 'Module 01', color: '#ffcd6d', status: 'COMPLETED' },
            { title: 'ROS Masterclass', level: 'Advanced', mod: 'Module 04', color: '#95d5b2', status: 'ONGOING' },
            { title: 'PCB Fabrication', level: 'Intermediate', mod: 'Module 02', color: '#e5d0f1', status: 'UPCOMING' },
            { title: 'AI & Computer Vision', level: 'Advanced', mod: 'Module 05', color: '#d8e9f0', status: 'REGISTRATION OPEN' }
          ].map((ws, i) => (
            <div key={i} className="workshop-card" style={{
              position: 'relative',
              background: ws.color,
              borderRadius: '24px',
              paddingTop: '6px',
              boxShadow: '0 10px 0 black',
              border: '2px solid black'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '22px',
                padding: '2rem',
                border: '2px solid black',
                position: 'relative',
                zIndex: 2,
                marginBottom: '40px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
                  <div style={{ width: '20px', height: '20px', background: ws.color, borderRadius: '4px', border: '1px solid black' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>IGIT ROBOTICS</span>
                </div>

                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem', lineHeight: '1.1' }}>{ws.title}</h3>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.5, marginBottom: '1.5rem' }}>{ws.mod}</div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ border: '1.5px solid black', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    {ws.level}
                  </div>
                  <div style={{ border: '1.5px solid black', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', background: '#f5f6fa' }}>
                    LAB WORK
                  </div>
                </div>
              </div>

              <div style={{
                position: 'absolute',
                bottom: '12px',
                width: '100%',
                textAlign: 'center',
                fontSize: '0.75rem',
                fontWeight: 900,
                color: 'black',
                letterSpacing: '1px'
              }}>
                {ws.status}
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
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '100%', background: 'rgba(0,0,0,0.3)', pointerEvents: 'none' }} />
        </div>
      ))}
    </div>
  );
});

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const sectionRef = useRef(null);
  const rowRefs = useRef([]);

  const galleryData = [
    [
      { url: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=600', title: 'Robo Wars', context: 'Our combat robot in action at TechFest.' },
      { url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600', title: 'AI Automation', context: 'Testing the vision system for our autonomous rover.' },
      { url: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=600', title: 'Team Meeting', context: 'Strategizing for the upcoming hackathon.' },
      { url: 'https://images.unsplash.com/photo-1563207153-f40879981881?q=80&w=600', title: 'Hardware Dev', context: 'Soldering custom PCBs in the lab.' },
    ],
    [
      { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600', title: '3D Printing', context: 'Prototyping chassis parts overnight.' },
      { url: 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=80&w=600', title: 'Drone Testing', context: 'First flight test of the Quadcopter.' },
      { url: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=600', title: 'Coding Session', context: 'Debugging the ROS nodes.' },
      { url: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=600', title: 'Workshop', context: 'Teaching juniors about microcontrollers.' },
    ],
    [
      { url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600', title: 'Circuit Design', context: 'Finalizing the schematics.' },
      { url: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=600', title: 'Machine Learning', context: 'Training models for object detection.' },
      { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600', title: 'Exhibition', context: 'Showcasing our projects to the university.' },
      { url: 'https://images.unsplash.com/photo-1495055154266-57bbdeada43e?q=80&w=600', title: 'Sensor Integration', context: 'Calibrating the LIDAR.' },
    ],
    [
      { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600', title: 'Data Analysis', context: 'Reviewing logs from the autonomous run.' },
      { url: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?q=80&w=600', title: 'Assembly Line', context: 'Putting together the robotic arm.' },
      { url: 'https://images.unsplash.com/photo-1610309995543-c0d6cfdfa380?q=80&w=600', title: 'VR Setup', context: 'Teleoperating the rover in VR.' },
      { url: 'https://images.unsplash.com/photo-1576401662998-ce8ccf149b18?q=80&w=600', title: 'Success!', context: 'Winning the regional championship.' },
    ]
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
    <section id="gallery" ref={sectionRef} style={{ background: '#111', padding: '120px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderTop: '4px solid black', position: 'relative', overflow: 'hidden' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: 'white', textAlign: 'center', fontSize: '3rem', margin: '0 0 1rem 0' }}>Gallery</h2>
        <p style={{ color: 'white', opacity: 0.6, textAlign: 'center', fontWeight: 600 }}>Capturing our journey frame by frame.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', transform: 'rotate(-2deg) scale(1.05)' }}>
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
  <footer style={{ background: '#1a1a1a', color: 'white', padding: '50px 0', borderTop: '5px solid black' }}>
    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '0.5rem' }}>IGIT ROBOTICS SOCIETY</div>
        <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>© 2024 IGIT Sarang // Innovation for the next generation.</div>
      </div>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <a href="https://www.instagram.com/igit_robotics" target="_blank" rel="noreferrer" style={{ color: 'white', textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ borderBottom: '2px solid #fbc531' }}>INSTAGRAM</span>
        </a>
        <button className="btn-buddy" style={{ background: '#fbc531', padding: '0.5rem 1.5rem' }}>JOIN THE CLUB</button>
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
      <Workshops />
      <Achievements />
      <TeamSection />
      <Footer />
    </div>
  );
};

export default Home;
