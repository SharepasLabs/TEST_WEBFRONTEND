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
    { href: '#ip', label: safeNav.ip || 'IP' },
    { href: '#partners', label: safeNav.partners || 'Partners' },
    { href: '#values', label: safeNav.values },
    { href: '#contact', label: safeNav.contact },
  ];

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#hero" className="nav-logo">
          {safeNav.logo}
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
      <div className="hero-content">
        <Reveal>
          <p className="hero-eyebrow">{hero.eyebrow}</p>
        </Reveal>
        <Reveal delay={150}>
          <h1 className="hero-title">
            {hero.title}<span className="accent"> | {hero.titleSuffix}</span>
          </h1>
        </Reveal>
        <Reveal delay={300}>
          <p className="hero-line">{hero.heroLine}</p>
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
          <h2 className="section-title ">{'// '}{about.heading}</h2>
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
            <div className="mission-card ">
              <span className="mission-asciidoc">┌─── MISSION ───┐</span>
              <p className="mission-text">
                {m.text}
              </p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="mission-card ">
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
          <h2 className="section-title ">{'// '}{build.heading}</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="section-subtitle">{build.subtitle}</p>
        </Reveal>
        <div className="build-grid">
          {cards.map((c, i) => (
            <Reveal key={i} delay={150 + i * 80}>
              <div className="build-card ">
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
   PARTNERS & PROVIDERS
   ═══════════════════════════════════════════ */

function PartnersSection() {
  const { lang } = useLanguage();
  const p = t('partners', lang);
  const boatDef = p.boatDefinition || {};

  // Helper to get icon URL (using Simple Icons CDN) - only for available icons
  const getIconUrl = (brand) => {
    const iconMap = {
      'OpenAI': 'openai',
      'Anthropic': 'anthropic',
      'Meta AI': 'meta',
      'Hugging Face': 'huggingface',
      'n8n': 'n8n',
      'UiPath': 'uipath',
      'Microsoft Power Automate': 'microsoft',
      'Zapier': 'zapier',
      'Make': 'make',
      'LangChain': 'langchain',
      'CrewAI': 'crewai',
      'Haystack': 'haystack',
      'Obsidian': 'obsidian',
      'Notion': 'notion',
      'Slack': 'slack',
      'Trello': 'trello',
      'Asana': 'asana',
      'AWS': 'amazonaws',
      'Azure': 'microsoftazure',
      'Google Cloud': 'googlecloud',
      'DigitalOcean': 'digitalocean',
      'Vercel': 'vercel',
      'Cloudflare': 'cloudflare',
      'GitHub': 'github',
      'Docker': 'docker',
      'Snowflake': 'snowflake',
      'Databricks': 'databricks',
      'MongoDB': 'mongodb',
      'PostgreSQL': 'postgresql',
      'Redis': 'redis',
      'Elasticsearch': 'elastic',
      'Kubernetes': 'kubernetes',
      'Terraform': 'terraform',
      'Jenkins': 'jenkins',
      'GitLab': 'gitlab',
      'CircleCI': 'circleci',
      'Datadog': 'datadog',
      'New Relic': 'newrelic',
      'Grafana': 'grafana',
      'Salesforce': 'salesforce',
      'HubSpot': 'hubspot',
      'Zendesk': 'zendesk',
      'Stripe': 'stripe',
      'Shopify': 'shopify',
      'Mailchimp': 'mailchimp',
      'Google DeepMind': 'google',
      'Google Workspace': 'google',
    };
    const slug = iconMap[brand];
    return slug ? `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg` : null;
  };

  return (
    <section id="partners" className="section partners">
      <div className="container">
        <Reveal>
          <h2 className="section-title">{p.heading}</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="section-subtitle">{p.subtitle}</p>
        </Reveal>
        <div className="partners-grid">
          {p.categories.map((cat, i) => (
            <Reveal key={i} delay={150 + i * 80}>
              <div className="partner-category">
                <h4>{cat.title}</h4>
                <div className="partner-logos">
                  {cat.brands.map((brand, j) => {
                    const iconUrl = getIconUrl(brand);
                    return (
                      <div key={j} className="partner-logo" title={brand}>
                        {iconUrl ? (
                          <img 
                            src={iconUrl} 
                            alt={brand}
                          />
                        ) : (
                          <span className="partner-fallback">{brand}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {cat.title.includes('BOAT') && boatDef.text && (
                  <div className="boat-definition">
                    <p className="boat-text">{boatDef.text}</p>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   IP & LICENSING
   ═══════════════════════════════════════════ */

function IPSection() {
  const { lang } = useLanguage();
  const ip = t('ip', lang);

  return (
    <section id="ip" className="section ip">
      <div className="container">
        <Reveal>
          <h2 className="section-title ">{'// '}{ip.heading}</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="section-subtitle">{ip.subtitle}</p>
        </Reveal>
        <div className="ip-grid">
          {ip.cards.map((c, i) => (
            <Reveal key={i} delay={200 + i * 100}>
              <div className="ip-card ">
                <h4>{'$ '}{c.title}</h4>
                <p>{c.desc}</p>
                <span className="ip-tag">{c.tag}</span>
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
          <h2 className="section-title ">{'// '}{v.heading}</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="section-subtitle">{v.subtitle}</p>
        </Reveal>
        <div className="values-grid">
          {items.map((item, i) => (
            <Reveal key={i} delay={200 + i * 100}>
              <div className="value-card">
                <span className="value-number">{String(i + 1).padStart(2, '0')}</span>
                <p className="">{`> ${item}`}</p>
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
            <h2 className="contact-title">{c.heading}</h2>
            <p className="contact-text">{c.cta}</p>

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
                {status === 'sending' ? '...' : labels.send}
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
            {safeF.brand}
          </div>
          <p className="footer-copy">
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
        <Navbar />
        <HeroSection />
        <AboutSection />
        <MissionSection />
        <BuildSection />
        <IPSection />
        <PartnersSection />
        <ValuesSection />
        <ContactSection />
        <Footer />
      </div>
    </LanguageContext.Provider>
  );
}

export default App;
