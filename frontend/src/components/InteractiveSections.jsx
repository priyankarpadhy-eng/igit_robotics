import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const FlipSection = () => {
  const [msg, setMsg] = useState('');
  const outputRef = useRef();

  const handleFlip = (type) => {
    if (type === 'encode') {
      gsap.fromTo(outputRef.current, 
        { rotationX: 0, opacity: 1 },
        { 
          rotationX: 180, 
          duration: 0.8, 
          ease: 'power3.inOut',
        }
      );
    } else {
      gsap.to(outputRef.current, {
        rotationX: 0,
        duration: 0.8,
        ease: 'power3.inOut'
      });
    }
  };

  return (
    <section className="main-section section-container flip-section">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 className="t-h2" data-split style={{ marginBottom: '1rem' }}>Smart flip encryption</h2>
        <p className="t-body" style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
          Write a message. Flip. Instantly secure.
        </p>
        
        <div className="flip-card card" style={{ padding: '3rem' }}>
          <textarea 
            className="t-body"
            placeholder="Type your secret message..." 
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            style={{ 
              width: '100%', minHeight: '120px', 
              background: 'transparent', border: 'none', 
              color: 'var(--text-primary)', outline: 'none',
              resize: 'none', borderBottom: '1px solid var(--border)'
            }}
          />
          <div className="flip-btns" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn-pill t-label" onClick={() => handleFlip('encode')}>Encode Message</button>
            <button className="btn-pill t-label" onClick={() => handleFlip('decode')}>Decode Message</button>
          </div>
          <div ref={outputRef} className="flip-output" style={{ marginTop: '3rem', perspective: '1000px', transformStyle: 'preserve-3d' }}>
            <div style={{ font: '500 1.5rem var(--font-body)', backfaceVisibility: 'hidden' }}>
              {msg || "Your message will appear here..."}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const GripStats = () => {
  const statsRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to({ val: 0 }, {
        val: 0.80,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.grip-section', start: 'top 70%' },
        onUpdate: function () {
          const num = document.querySelector('.friction-num');
          if (num) num.textContent = this.targets()[0].val.toFixed(2);
        }
      });

      gsap.from('.friction-bar-fill', {
        scrollTrigger: { trigger: '.friction-bar', start: 'top 75%' },
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.6,
        ease: 'power3.out'
      });
    }, statsRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={statsRef} className="main-section section-container grip-section">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <div>
          <div className="t-label" style={{ color: 'var(--accent-warm)', marginBottom: '1rem' }}>Performance</div>
          <h2 className="t-h2" style={{ marginBottom: '2rem' }}>Static Friction Coefficient</h2>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
            <span className="friction-num t-hero" style={{ fontSize: '8rem' }}>0.00</span>
          </div>
        </div>
        <div>
          <div className="friction-bar" style={{ height: '4px', background: 'var(--border)', width: '100%', marginBottom: '2rem' }}>
            <div className="friction-bar-fill" style={{ height: '100%', background: 'var(--accent-cork)', width: '80%' }} />
          </div>
          <div className="t-body" style={{ color: 'var(--text-muted)' }}>
            Comparison (Estimated):
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Oryzo Cork</span>
              <span>0.80μ</span>
            </div>
            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', opacity: 0.4 }}>
              <span>Generic Plastic</span>
              <span>0.35μ</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { FlipSection, GripStats };
