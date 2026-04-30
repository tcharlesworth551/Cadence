import { useEffect, useState } from 'react';

export default function Landing({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{
      background: '#0a0a0a',
      color: '#f5f5f5',
      fontFamily: "'Syne', sans-serif",
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,700&family=JetBrains+Mono:wght@400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 20px 40px;
          display: flex; align-items: center; justify-content: space-between;
          transition: all 0.3s ease;
        }
        .nav.scrolled {
          background: rgba(10,10,10,0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #1a1a1a;
          padding: 16px 40px;
        }
        .nav-logo {
          font-size: 20px; font-weight: 700;
          letter-spacing: -0.5px; color: #f5f5f5;
        }
        .nav-logo span { color: #f0b429; }
        .nav-cta {
          background: #f0b429; border: none; border-radius: 6px;
          padding: 10px 20px; color: #0a0a0a;
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: opacity 0.15s; letter-spacing: 0.02em;
        }
        .nav-cta:hover { opacity: 0.9; }

        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 120px 20px 80px;
          position: relative;
        }
        .hero::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(240,180,41,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(240,180,41,0.1); border: 1px solid rgba(240,180,41,0.2);
          border-radius: 20px; padding: 6px 16px;
          font-size: 12px; font-weight: 600; color: #f0b429;
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 32px;
          animation: fadeUp 0.6s ease both;
        }
        .hero-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 8vw, 80px);
          font-weight: 700; line-height: 1.05;
          letter-spacing: -1px; margin-bottom: 24px;
          animation: fadeUp 0.6s 0.1s ease both;
        }
        .hero-headline em {
          font-style: italic; color: #f0b429;
        }
        .hero-sub {
          font-size: clamp(16px, 2.5vw, 20px);
          color: #888; max-width: 500px; line-height: 1.6;
          margin-bottom: 40px;
          animation: fadeUp 0.6s 0.2s ease both;
        }
        .hero-actions {
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
          justify-content: center;
          animation: fadeUp 0.6s 0.3s ease both;
        }
        .btn-primary {
          background: #f0b429; border: none; border-radius: 8px;
          padding: 16px 32px; color: #0a0a0a;
          font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
          cursor: pointer; transition: all 0.15s; letter-spacing: 0.02em;
        }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-secondary {
          background: none; border: 1px solid #333; border-radius: 8px;
          padding: 16px 32px; color: #888;
          font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 500;
          cursor: pointer; transition: all 0.15s;
        }
        .btn-secondary:hover { border-color: #555; color: #f5f5f5; }

        .stats-bar {
          display: flex; align-items: center; justify-content: center;
          gap: 48px; padding: 40px 20px;
          border-top: 1px solid #111; border-bottom: 1px solid #111;
          flex-wrap: wrap;
        }
        .stat { text-align: center; }
        .stat-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 28px; font-weight: 500; color: #f0b429;
          display: block; margin-bottom: 4px;
        }
        .stat-label { font-size: 12px; color: #555; text-transform: uppercase; letter-spacing: 0.08em; }

        .section { padding: 100px 20px; max-width: 1000px; margin: 0 auto; }
        .section-tag {
          font-size: 11px; font-weight: 600; color: #f0b429;
          text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 16px;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 5vw, 52px); font-weight: 700;
          line-height: 1.1; margin-bottom: 20px;
        }
        .section-body { font-size: 17px; color: #666; line-height: 1.7; max-width: 540px; }

        .problem-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1px; background: #111; margin-top: 60px;
          border-radius: 12px; overflow: hidden;
        }
        .problem-card {
          background: #0a0a0a; padding: 32px;
        }
        .problem-icon { font-size: 28px; margin-bottom: 16px; display: block; }
        .problem-title { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
        .problem-desc { font-size: 14px; color: #555; line-height: 1.6; }

        .features-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px; margin-top: 60px;
        }
        .feature-card {
          background: #111; border: 1px solid #1a1a1a;
          border-radius: 12px; padding: 32px;
          transition: border-color 0.2s;
        }
        .feature-card:hover { border-color: rgba(240,180,41,0.3); }
        .feature-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: #f0b429; margin-bottom: 16px; display: block;
        }
        .feature-title { font-size: 18px; font-weight: 600; margin-bottom: 10px; }
        .feature-desc { font-size: 14px; color: #555; line-height: 1.6; }

        .comparison {
          margin-top: 60px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
        }
        .comp-card {
          border-radius: 12px; padding: 32px;
        }
        .comp-card.bad { background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.15); }
        .comp-card.good { background: rgba(240,180,41,0.05); border: 1px solid rgba(240,180,41,0.15); }
        .comp-title { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 20px; }
        .comp-title.bad { color: #ef4444; }
        .comp-title.good { color: #f0b429; }
        .comp-item { font-size: 14px; color: #666; margin-bottom: 10px; display: flex; gap: 10px; line-height: 1.5; }
        .comp-item span { flex-shrink: 0; }

        .cta-section {
          text-align: center; padding: 100px 20px;
          position: relative;
        }
        .cta-section::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(240,180,41,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 6vw, 64px); font-weight: 700;
          line-height: 1.1; margin-bottom: 20px;
        }
        .cta-sub { font-size: 18px; color: #666; margin-bottom: 40px; }
        .cta-fine { font-size: 13px; color: #444; margin-top: 16px; }

        .footer {
          border-top: 1px solid #111; padding: 32px 40px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
        }
        .footer-logo { font-size: 16px; font-weight: 700; color: #333; }
        .footer-logo span { color: #f0b429; }
        .footer-text { font-size: 13px; color: #333; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .nav { padding: 16px 20px; }
          .comparison { grid-template-columns: 1fr; }
          .stats-bar { gap: 32px; }
          .footer { flex-direction: column; text-align: center; }
        }
      `}</style>

      {/* Nav */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo">cadence<span>.</span></div>
        <button className="nav-cta" onClick={onGetStarted}>Start Free →</button>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-tag">🔥 Built for the other 90% of traders</div>
        <h1 className="hero-headline">
          The trading journal built<br />
          for <em>discipline</em>,<br />
          not data scientists.
        </h1>
        <p className="hero-sub">
          Most journals are built for traders who already journal. Cadence is built for everyone else — fast, frictionless, and designed to build the habit.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={onGetStarted}>Start journalling free →</button>
          <button className="btn-secondary" onClick={onGetStarted}>See how it works</button>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-num">20s</span>
          <span className="stat-label">To log a trade</span>
        </div>
        <div className="stat">
          <span className="stat-num">90%</span>
          <span className="stat-label">Of traders don't journal</span>
        </div>
        <div className="stat">
          <span className="stat-num">6</span>
          <span className="stat-label">Emotion tags</span>
        </div>
        <div className="stat">
          <span className="stat-num">Free</span>
          <span className="stat-label">To get started</span>
        </div>
      </div>

      {/* Problem */}
      <section className="section">
        <div className="section-tag">The problem</div>
        <h2 className="section-title">Why traders stop journalling after day three.</h2>
        <p className="section-body">It's not laziness. Existing tools are built for the 10% who are already disciplined. They're slow, complex, and designed for desktop. You trade on your phone. Your journal should too.</p>
        <div className="problem-grid">
          <div className="problem-card">
            <span className="problem-icon">⏱️</span>
            <div className="problem-title">Too slow</div>
            <div className="problem-desc">Logging a single trade takes 5–10 minutes on most platforms. That's 5 minutes you don't have after a fast market.</div>
          </div>
          <div className="problem-card">
            <span className="problem-icon">📊</span>
            <div className="problem-title">Too complex</div>
            <div className="problem-desc">600 statistics nobody understands. You need to know three things: your win rate, your streak, and what emotion cost you money.</div>
          </div>
          <div className="problem-card">
            <span className="problem-icon">🖥️</span>
            <div className="problem-title">Wrong device</div>
            <div className="problem-desc">The market leader has no mobile app. You trade on your phone, screenshot on your phone, and then have to sit at a laptop to journal. Nobody does that.</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ borderTop: '1px solid #111' }}>
        <div className="section-tag">The solution</div>
        <h2 className="section-title">Everything you need. Nothing you don't.</h2>
        <p className="section-body">Cadence strips journalling back to what actually builds discipline — fast capture, honest reflection, and clear patterns over time.</p>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-num">01</span>
            <div className="feature-title">20-second trade log</div>
            <div className="feature-desc">Pair, direction, outcome, emotion. Done. No ten-tab setup process. No mandatory fields that don't apply to your strategy.</div>
          </div>
          <div className="feature-card">
            <span className="feature-num">02</span>
            <div className="feature-title">Screenshot upload</div>
            <div className="feature-desc">Attach your chart screenshot directly to the trade. The way you already work, built into your journal. Stored securely in the cloud.</div>
          </div>
          <div className="feature-card">
            <span className="feature-num">03</span>
            <div className="feature-title">Emotion insights</div>
            <div className="feature-desc">See your win rate broken down by emotion. Disciplined: 78%. FOMO: 23%. That one insight is worth more than 600 statistics.</div>
          </div>
          <div className="feature-card">
            <span className="feature-num">04</span>
            <div className="feature-title">Streak tracking</div>
            <div className="feature-desc">Gamify your discipline. Your logging streak keeps you honest on days when the market is quiet and it's tempting to skip.</div>
          </div>
          <div className="feature-card">
            <span className="feature-num">05</span>
            <div className="feature-title">Works everywhere</div>
            <div className="feature-desc">Web app that works on any device. Phone, tablet, desktop. No download. No App Store. Open the link and start logging.</div>
          </div>
          <div className="feature-card">
            <span className="feature-num">06</span>
            <div className="feature-title">Built for forex & crypto</div>
            <div className="feature-desc">Pre-loaded with the pairs you actually trade. EUR/USD, BTC/USD, XAU/USD, ETH/USD and more. Not stocks. Not options. Your market.</div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section" style={{ borderTop: '1px solid #111' }}>
        <div className="section-tag">Why Cadence</div>
        <h2 className="section-title">Built different. On purpose.</h2>
        <p className="section-body">Every other journal was built for traders who are already disciplined. We built Cadence for everyone who isn't there yet.</p>
        <div className="comparison">
          <div className="comp-card bad">
            <div className="comp-title bad">❌ Every other journal</div>
            <div className="comp-item"><span>—</span>Desktop only or no mobile app</div>
            <div className="comp-item"><span>—</span>5–10 minutes to log one trade</div>
            <div className="comp-item"><span>—</span>Hundreds of confusing statistics</div>
            <div className="comp-item"><span>—</span>Expensive monthly subscriptions</div>
            <div className="comp-item"><span>—</span>Built for experienced traders</div>
            <div className="comp-item"><span>—</span>No screenshot integration</div>
          </div>
          <div className="comp-card good">
            <div className="comp-title good">✓ Cadence</div>
            <div className="comp-item"><span>—</span>Works on any device, any browser</div>
            <div className="comp-item"><span>—</span>20 seconds to log a trade</div>
            <div className="comp-item"><span>—</span>Three numbers that actually matter</div>
            <div className="comp-item"><span>—</span>Free to start</div>
            <div className="comp-item"><span>—</span>Built for traders finding their edge</div>
            <div className="comp-item"><span>—</span>Screenshot upload built in</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2 className="cta-title">Start building your<br /><em style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', color: '#f0b429' }}>cadence</em> today.</h2>
        <p className="cta-sub">Free to start. No credit card. No excuses.</p>
        <button className="btn-primary" style={{ fontSize: '18px', padding: '18px 40px' }} onClick={onGetStarted}>
          Create your free account →
        </button>
        <p className="cta-fine">Join traders already building their discipline with Cadence.</p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo">cadence<span>.</span></div>
        <div className="footer-text">Built for traders who are serious about getting better.</div>
      </footer>
    </div>
  );
}