import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const MarqueeRow = ({ direction, speed, children }) => {
  const rowId = `marquee-${Math.random().toString(36).substr(2, 9)}`;
  
  useEffect(() => {
    const track = document.querySelector(`.${rowId} .marquee-track`);
    const duration = speed || 40;
    
    gsap.set(track, {
      animation: `marquee-${direction} ${duration}s linear infinite`
    });

    ScrollTrigger.create({
      onUpdate: (self) => {
        const vel = self.getVelocity() / 1000;
        gsap.to(track, {
          skewX: vel * -3,
          duration: 0.5,
          overwrite: true,
          ease: 'power3.out'
        });
      }
    });

  }, [direction, speed, rowId]);

  return (
    <div className={`marquee-row ${rowId}`} data-direction={direction}>
      <div className="marquee-track">
        {[...Array(6)].map((_, i) => (
          <span key={i}>{children}</span>
        ))}
      </div>
    </div>
  );
};

const Marquee = () => {
  return (
    <section className="marquee-container">
      <MarqueeRow direction="left" speed={40}>
        ORYZO-1 · OPEN WEIGHT MODEL · LIGHTWEIGHT · PORTABLE ·
      </MarqueeRow>
      <MarqueeRow direction="right" speed={55}>
        AI SLOP IDEAS FOR THIS WINTER · WE ARE SO COOKED ·
      </MarqueeRow>
      <MarqueeRow direction="left" speed={35}>
        ISSUE NO. 00124 · 255678 · ORYZO IS TAKING EVERYONE'S JOBS ·
      </MarqueeRow>
    </section>
  );
};

export default Marquee;
