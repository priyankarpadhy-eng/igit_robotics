import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const StatementSection = () => {
  const sectionRef = useRef();

  useEffect(() => {
    const stTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=250%',
        pin: true,
        scrub: 1.5,
      }
    });

    stTl
      .from('.statement-text .word', { 
        y: 60, 
        opacity: 0, 
        duration: 0.3, 
        stagger: 0.05 
      })
      .to('.ai-word', {
        fontSize: 'clamp(8rem, 25vw, 28rem)',
        opacity: 1,
        duration: 1,
        ease: 'none'
      })
      .to('.statement-text', { 
        opacity: 0, 
        y: -40, 
        duration: 0.3 
      }, '-=0.5');

  }, []);

  return (
    <section ref={sectionRef} className="statement-section">
      <div className="statement-pin">
        <h2 className="statement-text t-h1" data-split>
          isn't just a coaster.
        </h2>
      </div>
      <div className="ai-reveal">
        <span className="ai-word">Powered by AI*</span>
      </div>
    </section>
  );
};

export default StatementSection;
