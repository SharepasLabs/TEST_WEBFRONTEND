import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import './App.css';
import { translations, LANGUAGES, LANGUAGE_NAMES } from './i18n/translations';

/* ═══════════════════════════════════════════
   LANGUAGE CONTEXT
   ═══════════════════════════════════════════ */

const LanguageContext = createContext({ lang: 'en', setLang: () => {} });

function useLanguage() {
  return useContext(LanguageContext);
}

function t(key, lang) {
  const keys = key.split('.');

  // Try selected language first
  let val = translations[lang];
  if (val) {
    for (const k of keys) {
      if (val && typeof val !== 'string' && val[k] !== undefined) val = val[k];
      else { val = undefined; break; }
    }
    // If we got a string or the root object, return it (for section-level calls)
    if (val !== undefined && (typeof val === 'string' || typeof val === 'object')) return val;
  }

  // Fallback to English
  val = translations.en;
  for (const k of keys) {
    if (val && typeof val !== 'string' && val[k] !== undefined) val = val[k];
    else { val = undefined; break; }
  }

  if (val !== undefined) return val;
  return key;
}

/* ═══════════════════════════════════════════
   INTERSECTION OBSERVER HOOK
   ═══════════════════════════════════════════ */

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className="reveal visible-scan"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   GLITCH TEXT COMPONENT
   ═══════════════════════════════════════════ */

function GlitchText({ text, className = '' }) {
  return (
    <span className={`glitch-text ${className}`} data-text={text}>
      {text}
    </span>
  );
}

/* ═══════════════════════════════════════════
   SCANLINE OVERLAY
   ═══════════════════════════════════════════ */

function Scanlines() {
  return <div className="scanlines" aria-hidden="true" />;
}

/* ═══════════════════════════════════════════
   NOISE OVERLAY
   ═══════════════════════════════════════════ */

function Noise() {
  return <div className="noise" aria-hidden="true" />;
}

/* ═══════════════════════════════════════════
   MATRIX RAIN (hero background)
   ═══════════════════════════════════════════ */

function MatrixRain() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    const cols = Math.floor(w / 18);
    const drops = Array(cols).fill(1);
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01';

    let raf;
    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(0, 255, 70, 0.08)';
      ctx.font = '14px "JetBrains Mono", monospace';

      for (let i = 0; i < cols; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * 18, drops[i] * 18);
        if (drops[i] * 18 > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    window.addEventListener('resize', onResize);

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} className="matrix-rain" aria-hidden="true" />;
}

/* ═══════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════ */

function Navbar() {
  const { lang, setLang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const nav = t('nav', lang);
  const safeNav = typeof nav === 'object' && nav ? nav : { logo: 'SherpaLabs|tech', about: 'About', mission: 'Mission', build: 'What We Build', values: 'Values', contact: 'Contact', cta: 'Get in Touch' };

  const navLinks = [
    { href: '#about', label: safeNav.about },
    { href: '#mission', label: safeNav.mission },
    { href: '#build', label: safeNav.build },
    { href: '#values', label: safeNav.values },
    { href: '#contact', label: safeNav.contact },
  ];

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#hero" className="nav-logo">
          <img src="/logo.png" alt="SherpaLabs" className="nav-logo-img" />
          <GlitchText text={safeNav.logo} className="nav-logo-text" />
        </a>

        {/* Desktop links */}
        <div className="nav-links">
          {navLinks.map(l => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
          <a href="#contact" className="nav-cta">{safeNav.cta}</a>

          {/* Lang switcher */}
          <div className="lang-switcher">
            {LANGUAGES.map(code => (
              <button
                key={code}
                className={`lang-btn${lang === code ? ' active' : ''}`}
                onClick={() => setLang(code)}
              >
                {LANGUAGE_NAMES[code]}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu visible-scan">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
          <div className="lang-switcher-mobile">
            {LANGUAGES.map(code => (
              <button
                key={code}
                className={`lang-btn${lang === code ? ' active' : ''}`}
                onClick={() => { setLang(code); setMenuOpen(false); }}
              >
                {LANGUAGE_NAMES[code]}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

/* ═══════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════ */

function HeroSection() {
  const { lang } = useLanguage();
  const hero = t('hero', lang);

  return (
    <section id="hero" className="hero">
      <MatrixRain />
      <div className="hero-glow" />
      <div className="hero-content">
        <Reveal>
          <p className="hero-eyebrow">{'> '}{hero.eyebrow}<span className="cursor-blink">_</span></p>
        </Reveal>
        <Reveal delay={150}>
          <h1 className="hero-title">
            <GlitchText text={hero.title} />
            <span className="accent">|{hero.titleSuffix}</span>
          </h1>
        </Reveal>
        <Reveal delay={300}>
          <p className="hero-line terminal-text">{hero.heroLine}</p>
        </Reveal>
        <Reveal delay={400}>
          <p className="hero-tagline">{hero.tagline}</p>
        </Reveal>
        <Reveal delay={500}>
          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">{hero.btnStart}</a>
            <a href="#about" className="btn btn-outline">{hero.btnLearn}</a>
          </div>
        </Reveal>
      </div>
      <div className="scroll-hint">
        <span className="scroll-line" />
        <span className="scroll-label">↓ scroll</span>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   ABOUT
   ═══════════════════════════════════════════ */

function AboutSection() {
  const { lang } = useLanguage();
  const about = t('about', lang);

  const points = typeof about.points === 'object' && Array.isArray(about.points)
    ? about.points
    : t('about.points', lang).split('\n');

  return (
    <section id="about" className="section about">
      <div className="container">
        <Reveal>
          <h2 className="section-title terminal-heading">{'// '}{about.heading}</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="section-subtitle">{about.subtitle}</p>
        </Reveal>
        <Reveal delay={200}>
          <p
            className="section-body"
            dangerouslySetInnerHTML={{ __html: about.body }}
          />
        </Reveal>
        <div className="sherpa-grid">
          {Array.isArray(about.points) && about.points.map((p, i) => (
            <Reveal key={i} delay={300 + i * 80}>
              <div className="sherpa-card">
                <span className="sherpa-card-icon">{'>'}</span>
                <p>{p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   MISSION
   ═══════════════════════════════════════════ */

function MissionSection() {
  const { lang } = useLanguage();
  const m = t('mission', lang);

  return (
    <section id="mission" className="section mission">
      <div className="container">
        <div className="mission-grid">
          <Reveal>
            <div className="mission-card terminal-card">
              <span className="mission-asciidoc">┌─── MISSION ───┐</span>
              <p className="mission-text">
                {m.text}
              </p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="mission-card terminal-card">
              <span className="mission-asciidoc">┌─── VISION ───┐</span>
              <p className="mission-text">
                {m.textV}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   WHAT WE BUILD
   ═══════════════════════════════════════════ */

function BuildSection() {
  const { lang } = useLanguage();
  const build = t('build', lang);

  const cards = (typeof build.cards === 'object' && Array.isArray(build.cards))
    ? build.cards
    : [];

  return (
    <section id="build" className="section build">
      <div className="container">
        <Reveal>
          <h2 className="section-title terminal-heading">{'// '}{build.heading}</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="section-subtitle">{build.subtitle}</p>
        </Reveal>
        <div className="build-grid">
          {cards.map((c, i) => (
            <Reveal key={i} delay={150 + i * 80}>
              <div className="build-card terminal-card">
                <span className="build-card-icon">{c.icon}</span>
                <h4>{'$ '}{c.title}</h4>
                <p>{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   CORE VALUES
   ═══════════════════════════════════════════ */

function ValuesSection() {
  const { lang } = useLanguage();
  const v = t('values', lang);

  const items = (typeof v.items === 'object' && Array.isArray(v.items))
    ? v.items
    : [];

  return (
    <section id="values" className="section values">
      <div className="container">
        <Reveal>
          <h2 className="section-title terminal-heading">{'// '}{v.heading}</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="section-subtitle">{v.subtitle}</p>
        </Reveal>
        <div className="values-grid">
          {items.map((item, i) => (
            <Reveal key={i} delay={200 + i * 100}>
              <div className="value-card">
                <span className="value-number">{String(i + 1).padStart(2, '0')}</span>
                <p className="terminal-text">{`> ${item}`}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   CONTACT (with form)
   ═══════════════════════════════════════════ */

function ContactSection() {
  const { lang } = useLanguage();
  const c = t('contact', lang);
  const labels = c.labels || {};
  const placeholders = c.placeholder || {};

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null); // null | 'sending' | 'success' | 'error'

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  }, [name, email, message]);

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <Reveal>
          <div className="contact-inner">
            <h2 className="contact-title terminal-heading">{'// '}{c.heading}</h2>
            <p className="contact-text terminal-text">{c.cta}</p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="contact-name">{labels.name}</label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={placeholders.name || ''}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">{labels.email}</label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={placeholders.email || ''}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-message">{labels.message}</label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={placeholders.message || ''}
                  rows={5}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? '...' : `> ${labels.send}`.trim()}
              </button>

              {status === 'success' && (
                <p className="form-status success">{`✓ ${c.success}`}</p>
              )}
              {status === 'error' && (
                <p className="form-status error">{`✗ ${c.error}`}</p>
              )}
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */

function Footer() {
  const { lang } = useLanguage();
  const f = t('footer', lang);
  const safeF = typeof f === 'object' && f ? f : { brand: 'SherpaLabs|tech', copy: '© {year} SherpaLabs.' };
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <GlitchText text={safeF.brand} className="footer-brand-glitch" />
          </div>
          <p className="footer-copy terminal-text">
            {(safeF.copy || '© {year} SherpaLabs.').replace('{year}', year)}
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   ROOT APP
   ═══════════════════════════════════════════ */

function App() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('sl-lang') || 'en'; } catch { return 'en'; }
  });

  useEffect(() => {
    try { localStorage.setItem('sl-lang', lang); } catch {}
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <div className="app-wrapper">
        <Scanlines />
        <Noise />
        <Navbar />
        <HeroSection />
        <AboutSection />
        <MissionSection />
        <BuildSection />
        <ValuesSection />
        <ContactSection />
        <Footer />
      </div>
    </LanguageContext.Provider>
  );
}

export default App;
